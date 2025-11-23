/**
 * Prettier Plugin: Tailwind Class Grouper
 * Automatically organizes Tailwind CSS classes into logical groups
 */

const { parsers: typescriptParsers } = require('prettier/parser-typescript');
const { parsers: babelParsers } = require('prettier/parser-babel');

// Define class categories and their patterns
const CLASS_GROUPS = {
  size: {
    comment: '// Size',
    patterns: [
      /^(w|h|min-w|max-w|min-h|max-h|size)-/,
      /^(text|leading)-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/
    ]
  },
  layout: {
    comment: '// Layout',
    patterns: [
      /^(flex|grid|inline|block|hidden|table|flow-root)/,
      /^(static|fixed|absolute|relative|sticky)/,
      /^(top|right|bottom|left|inset)-/,
      /^(float|clear|isolation|z)-/,
      /^(flex-|grid-|place-|items-|justify-|content-|self-|auto-)/,
      /^(cols|rows|gap|row|col|flow)-/
    ]
  },
  spacing: {
    comment: '// Spacing',
    patterns: [
      /^(m|mx|my|mt|mr|mb|ml|p|px|py|pt|pr|pb|pl|space)-/
    ]
  },
  border: {
    comment: '// Border',
    patterns: [
      /^(border|divide|ring|rounded|outline)/,
      /^(border|divide|ring|outline)-(t|r|b|l|x|y)?-?/
    ]
  },
  background: {
    comment: '// Background',
    patterns: [
      /^bg-/,
      /^(from|via|to)-/,
      /^gradient-to-/,
      /^backdrop-/
    ]
  },
  text: {
    comment: '// Text',
    patterns: [
      /^(text|font|tracking|leading|decoration|underline|uppercase|lowercase|capitalize|normal-case|truncate|break|whitespace)-/,
      /^(antialiased|subpixel-antialiased|italic|not-italic|font-)/,
      /^(text-left|text-center|text-right|text-justify)/,
      /^placeholder-/,
      /^selection:/
    ]
  },
  effects: {
    comment: '// Effects',
    patterns: [
      /^(shadow|opacity|mix-blend|bg-blend|filter|backdrop|blur|brightness|contrast|grayscale|hue-rotate|invert|saturate|sepia|drop-shadow)-/,
      /^(transition|duration|ease|delay|animate|transform|scale|rotate|translate|skew|origin)-/,
      /^appearance-/,
      /^cursor-/,
      /^select-/,
      /^resize/
    ]
  },
  states: {
    comment: '// States & Variants',
    patterns: [
      /^(hover|focus|active|visited|disabled|checked|group-hover|focus-within|focus-visible):/,
      /^dark:/,
      /^(first|last|odd|even|group):/,
      /^(sm|md|lg|xl|2xl):/ // Responsive variants
    ]
  },
  others: {
    comment: '// Others',
    patterns: [] // Catch-all for unmatched classes
  }
};

function categorizeClass(className) {
  for (const [category, config] of Object.entries(CLASS_GROUPS)) {
    if (category === 'others') continue;
    
    for (const pattern of config.patterns) {
      if (pattern.test(className)) {
        return category;
      }
    }
  }
  
  return 'others';
}

function groupTailwindClasses(classString) {
  const classes = classString.split(/\s+/).filter(Boolean);
  const grouped = {};
  
  // Initialize groups
  Object.keys(CLASS_GROUPS).forEach(key => {
    grouped[key] = [];
  });
  
  // Categorize each class
  classes.forEach(className => {
    const category = categorizeClass(className);
    grouped[category].push(className);
  });
  
  // Remove empty groups
  Object.keys(grouped).forEach(key => {
    if (grouped[key].length === 0) {
      delete grouped[key];
    }
  });
  
  return grouped;
}

function shouldGroupClasses(classString, options = {}) {
  const classes = classString.split(/\s+/).filter(Boolean);
  const minClasses = options.tailwindGroupMinClasses || 4;
  
  // Don't group if too few classes
  if (classes.length < minClasses) return false;
  
  // Check if already grouped (has newlines)
  if (classString.includes('\n')) return false;
  
  return true;
}

function formatGroupedClasses(grouped, indent = '    ') {
  const entries = Object.entries(grouped);
  const lines = [];
  
  entries.forEach(([category, classes], index) => {
    if (classes.length === 0) return;
    
    // Add comment
    lines.push(`${indent}${CLASS_GROUPS[category].comment}`);
    
    // Add classes as a string
    const classString = `${indent}"${classes.join(' ')}"`;
    const isLast = index === entries.length - 1;
    lines.push(classString + (isLast ? '' : ','));
  });
  
  return lines.join('\n');
}

// AST visitor to transform className attributes
const visitor = {
  JSXAttribute(path) {
    const { node } = path;
    
    // Check if this is a className attribute
    if (!node.name || node.name.name !== 'className') return;
    
    // Handle string literal className
    if (node.value && node.value.type === 'StringLiteral') {
      const classString = node.value.value;
      
      if (!shouldGroupClasses(classString, this.options)) return;
      
      const grouped = groupTailwindClasses(classString);
      const groupCount = Object.keys(grouped).length;
      
      if (groupCount > 1) {
        // Convert to clsx expression
        const formatted = formatGroupedClasses(grouped);
        
        node.value = {
          type: 'JSXExpressionContainer',
          expression: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'clsx' },
            arguments: Object.entries(grouped).map(([category, classes], index) => ({
              type: 'StringLiteral',
              value: classes.join(' '),
              leadingComments: [{
                type: 'CommentLine',
                value: ` ${CLASS_GROUPS[category].comment.replace('//', '')}`,
              }]
            }))
          }
        };
      }
    }
    
    // Handle clsx() calls
    if (node.value && node.value.type === 'JSXExpressionContainer') {
      const expression = node.value.expression;
      
      if (
        expression.type === 'CallExpression' &&
        expression.callee.name === 'clsx' &&
        expression.arguments.length === 1 &&
        expression.arguments[0].type === 'StringLiteral'
      ) {
        const classString = expression.arguments[0].value;
        
        if (!shouldGroupClasses(classString, this.options)) return;
        
        const grouped = groupTailwindClasses(classString);
        const groupCount = Object.keys(grouped).length;
        
        if (groupCount > 1) {
          // Replace with grouped arguments
          expression.arguments = Object.entries(grouped).map(([category, classes]) => ({
            type: 'StringLiteral',
            value: classes.join(' '),
            leadingComments: [{
              type: 'CommentLine',
              value: ` ${CLASS_GROUPS[category].comment.replace('//', '')}`,
            }]
          }));
        }
      }
    }
  }
};

// Prettier plugin exports
module.exports = {
  parsers: {
    typescript: {
      ...typescriptParsers.typescript,
      preprocess(text, options) {
        // Only process if the option is enabled
        if (!options.tailwindGroup) {
          return text;
        }
        return text;
      }
    },
    babel: {
      ...babelParsers.babel,
      preprocess(text, options) {
        // Only process if the option is enabled
        if (!options.tailwindGroup) {
          return text;
        }
        return text;
      }
    }
  },
  options: {
    tailwindGroup: {
      type: 'boolean',
      category: 'Format',
      default: false,
      description: 'Group Tailwind CSS classes by category',
    },
    tailwindGroupMinClasses: {
      type: 'int',
      category: 'Format',
      default: 4,
      description: 'Minimum number of classes before grouping',
    }
  },
  printers: {
    estree: {
      print(path, options, print) {
        const node = path.getValue();
        
        // Handle JSXAttribute for className
        if (node.type === 'JSXAttribute' && node.name && node.name.name === 'className') {
          if (options.tailwindGroup && node.value) {
            // Process className value
            if (node.value.type === 'StringLiteral') {
              const classString = node.value.value;
              
              if (shouldGroupClasses(classString, options)) {
                const grouped = groupTailwindClasses(classString);
                const groupCount = Object.keys(grouped).length;
                
                if (groupCount > 1) {
                  // Format as clsx with groups
                  const formatted = formatGroupedClasses(grouped);
                  return `className={clsx(\n${formatted}\n  )}`;
                }
              }
            }
          }
        }
        
        // Default printing for other nodes
        return null;
      }
    }
  }
};
