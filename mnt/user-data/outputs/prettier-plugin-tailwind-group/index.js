/**
 * Prettier Plugin: Tailwind Class Grouper
 * Automatically organizes Tailwind CSS classes into logical groups
 */

const babelPlugin = require('prettier/plugins/babel');
const typescriptPlugin = require('prettier/plugins/typescript');
const estreePrinter = require('prettier/plugins/estree').printers.estree;
const { builders } = require('prettier/doc');
const traverse = require('@babel/traverse').default;
const { hardline } = builders;

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
    patterns: [/^(m|mx|my|mt|mr|mb|ml|p|px|py|pt|pr|pb|pl|space)-/]
  },
  border: {
    comment: '// Border',
    patterns: [/^(border|divide|ring|rounded|outline)/, /^(border|divide|ring|outline)-(t|r|b|l|x|y)?-?/]
  },
  background: {
    comment: '// Background',
    patterns: [/^bg-/, /^(from|via|to)-/, /^gradient-to-/, /^backdrop-/]
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

  // Initialize groups to preserve order
  Object.keys(CLASS_GROUPS).forEach(key => {
    grouped[key] = [];
  });

  classes.forEach(className => {
    const category = categorizeClass(className);
    grouped[category].push(className);
  });

  Object.keys(grouped).forEach(key => {
    if (grouped[key].length === 0) {
      delete grouped[key];
    }
  });

  return grouped;
}

function shouldGroupClasses(classString, options = {}) {
  const classes = classString.split(/\s+/).filter(Boolean);
  const minClasses = options.tailwindGroupMinClasses ?? 4;

  if (classes.length < minClasses) return false;
  if (classString.includes('\n')) return false;

  return true;
}

function commentValue(comment) {
  return ` ${comment.replace('//', '').trim()}`;
}

function buildStringLiteral(value, category) {
  const literal = {
    type: 'StringLiteral',
    value,
    extra: {
      rawValue: value,
      raw: JSON.stringify(value)
    }
  };

  literal.__twCategoryComment = CLASS_GROUPS[category].comment.replace('//', '').trim();

  return literal;
}

function buildClsxExpression(grouped) {
  return {
    type: 'JSXExpressionContainer',
    expression: {
      type: 'CallExpression',
      callee: { type: 'Identifier', name: 'clsx' },
      arguments: Object.entries(grouped).map(([category, classes]) =>
        buildStringLiteral(classes.join(' '), category)
      )
    }
  };
}

function applyTailwindGrouping(ast, options) {
  traverse(ast, {
    JSXAttribute(path) {
      const { node } = path;
      if (!node.name || node.name.name !== 'className') return;
      if (!node.value) return;

      if (node.value.type === 'StringLiteral') {
        const classString = node.value.value;

        if (!shouldGroupClasses(classString, options)) return;

        const grouped = groupTailwindClasses(classString);
        if (Object.keys(grouped).length <= 1) return;

        node.value = buildClsxExpression(grouped);
      }

      if (node.value.type === 'JSXExpressionContainer') {
        const expression = node.value.expression;

        if (
          expression &&
          expression.type === 'CallExpression' &&
          expression.callee.type === 'Identifier' &&
          expression.callee.name === 'clsx' &&
          expression.arguments.length === 1 &&
          expression.arguments[0].type === 'StringLiteral'
        ) {
          const classString = expression.arguments[0].value;

          if (!shouldGroupClasses(classString, options)) return;

          const grouped = groupTailwindClasses(classString);
          if (Object.keys(grouped).length <= 1) return;

          expression.arguments = Object.entries(grouped).map(([category, classes]) =>
            buildStringLiteral(classes.join(' '), category)
          );
        }
      }
    }
  });
}

function wrapParserWithTransformer(baseParser) {
  return {
    ...baseParser,
    parse(text, options) {
      const ast = baseParser.parse(text, options);
      if (options.tailwindGroup) {
        applyTailwindGrouping(ast, options);
      }
      return ast;
    }
  };
}

module.exports = {
  options: {
    tailwindGroup: {
      type: 'boolean',
      category: 'Format',
      default: false,
      description: 'Group Tailwind CSS classes by category'
    },
    tailwindGroupMinClasses: {
      type: 'int',
      category: 'Format',
      default: 4,
      description: 'Minimum number of classes before grouping'
    },
    tailwindGroupIncludeComments: {
      type: 'boolean',
      category: 'Format',
      default: true,
      description: 'Include category comments above grouped Tailwind class segments'
    }
  },
  parsers: {
    babel: wrapParserWithTransformer(babelPlugin.parsers.babel),
    'babel-ts': wrapParserWithTransformer(babelPlugin.parsers['babel-ts']),
    typescript: wrapParserWithTransformer(typescriptPlugin.parsers.typescript)
  },
  printers: {
    estree: {
      ...estreePrinter,
      print(path, options, print) {
        const node = path.getValue();

        if (
          node &&
          node.type === 'StringLiteral' &&
          node.__twCategoryComment &&
          options.tailwindGroupIncludeComments !== false
        ) {
          const baseDoc = estreePrinter.print(path, options, print);
          return ['// ', node.__twCategoryComment, hardline, baseDoc];
        }

        return estreePrinter.print(path, options, print);
      }
    }
  }
};
