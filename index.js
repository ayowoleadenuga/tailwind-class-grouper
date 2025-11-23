/**
 * ESLint Plugin: Tailwind Class Grouper
 * Automatically organizes Tailwind CSS classes into logical groups with comments
 */

const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;

// Define class categories and their patterns
const CLASS_GROUPS = {
  size: {
    comment: '// Size',
    patterns: [
      /^(w|h|min-w|max-w|min-h|max-h|size)-/,
      /^(text|leading)-[0-9]|xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl/
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
    comment: '// States',
    patterns: [
      /^(hover|focus|active|visited|disabled|checked|group-hover|focus-within|focus-visible):/,
      /^dark:/,
      /^(first|last|odd|even|group):/
    ]
  },
  responsive: {
    comment: '// Responsive',
    patterns: [
      /^(sm|md|lg|xl|2xl):/
    ]
  },
  others: {
    comment: '// Others',
    patterns: [] // Catch-all for unmatched classes
  }
};

function categorizeClass(className) {
  // Check each category in order
  for (const [category, config] of Object.entries(CLASS_GROUPS)) {
    if (category === 'others') continue; // Skip 'others' in the first pass
    
    for (const pattern of config.patterns) {
      if (pattern.test(className)) {
        return category;
      }
    }
  }
  
  // If no match found, categorize as 'others'
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

function formatGroupedClasses(grouped, useClsx = true) {
  const lines = [];
  
  if (useClsx) {
    lines.push('{clsx(');
  } else {
    lines.push('<select');
    lines.push('  className={clsx(');
  }
  
  const entries = Object.entries(grouped);
  entries.forEach(([category, classes], index) => {
    if (classes.length === 0) return;
    
    // Add comment
    lines.push(`    ${CLASS_GROUPS[category].comment}`);
    
    // Add classes as a string
    const classString = `"${classes.join(' ')}"`;
    const isLast = index === entries.length - 1;
    lines.push(`    ${classString}${isLast ? '' : ','}`);
  });
  
  if (useClsx) {
    lines.push(')}');
  } else {
    lines.push('  )}');
    lines.push('/>');
  }
  
  return lines.join('\n');
}

module.exports = {
  rules: {
    'group-tailwind-classes': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Organize Tailwind CSS classes into logical groups',
          category: 'Stylistic Issues',
          recommended: false
        },
        fixable: 'code',
        schema: [
          {
            type: 'object',
            properties: {
              formatInline: {
                type: 'boolean',
                default: false
              },
              useClsx: {
                type: 'boolean',
                default: true
              }
            },
            additionalProperties: false
          }
        ]
      },
      create(context) {
        const options = context.options[0] || {};
        const formatInline = options.formatInline || false;
        const useClsx = options.useClsx !== false;
        
        return {
          JSXAttribute(node) {
            // Check if this is a className attribute
            if (node.name.name !== 'className') return;
            
            // Check if the value is a simple string literal
            if (node.value && node.value.type === 'Literal' && typeof node.value.value === 'string') {
              const classString = node.value.value;
              const classes = classString.split(/\s+/).filter(Boolean);
              
              // Only process if there are multiple classes
              if (classes.length <= 3 && !formatInline) return;
              
              const grouped = groupTailwindClasses(classString);
              
              // Only report if there are multiple groups or formatInline is true
              const groupCount = Object.keys(grouped).length;
              if (groupCount > 1 || formatInline) {
                context.report({
                  node: node.value,
                  message: 'Tailwind classes should be grouped by category',
                  fix(fixer) {
                    const formatted = formatGroupedClasses(grouped, useClsx);
                    
                    // Create the new JSX expression
                    const newValue = `{clsx(\n${Object.entries(grouped).map(([category, classes], index, arr) => {
                      const comment = `    ${CLASS_GROUPS[category].comment}\n`;
                      const classLine = `    "${classes.join(' ')}"${index < arr.length - 1 ? ',' : ''}`;
                      return comment + classLine;
                    }).join('\n')}\n  )}`;
                    
                    return fixer.replaceText(node.value, newValue);
                  }
                });
              }
            }
            
            // Also handle clsx() calls that aren't grouped
            if (node.value && node.value.type === 'JSXExpressionContainer') {
              const expression = node.value.expression;
              
              // Check if it's a clsx call with a single string argument
              if (
                expression.type === 'CallExpression' &&
                expression.callee.name === 'clsx' &&
                expression.arguments.length === 1 &&
                expression.arguments[0].type === 'Literal'
              ) {
                const classString = expression.arguments[0].value;
                const classes = classString.split(/\s+/).filter(Boolean);
                
                if (classes.length <= 3 && !formatInline) return;
                
                const grouped = groupTailwindClasses(classString);
                const groupCount = Object.keys(grouped).length;
                
                if (groupCount > 1 || formatInline) {
                  context.report({
                    node: expression.arguments[0],
                    message: 'Tailwind classes in clsx should be grouped by category',
                    fix(fixer) {
                      const groupedArgs = Object.entries(grouped).map(([category, classes], index, arr) => {
                        const comment = `\n    ${CLASS_GROUPS[category].comment}\n    `;
                        const classString = `"${classes.join(' ')}"`;
                        return comment + classString + (index < arr.length - 1 ? ',' : '');
                      }).join('');
                      
                      return fixer.replaceText(
                        expression,
                        `clsx(${groupedArgs}\n  )`
                      );
                    }
                  });
                }
              }
            }
          }
        };
      }
    }
  }
};
