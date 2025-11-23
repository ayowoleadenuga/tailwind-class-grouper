/**
 * Standalone Tailwind Class Formatter
 * Use this utility to manually format Tailwind classes in your code
 */

// Define class categories and their patterns
const CLASS_GROUPS = {
  size: {
    comment: '// Size',
    order: 1,
    patterns: [
      /^(w|h|min-w|max-w|min-h|max-h|size)-/,
      /^(text|leading)-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/
    ]
  },
  layout: {
    comment: '// Layout',
    order: 2,
    patterns: [
      /^(flex|grid|inline|block|hidden|table|flow-root)/,
      /^(static|fixed|absolute|relative|sticky)/,
      /^(top|right|bottom|left|inset)-/,
      /^(float|clear|isolation|z)-/,
      /^(flex-|grid-|place-|items-|justify-|content-|self-|auto-)/,
      /^(cols|rows|gap|row|col|flow)-/,
      /^overflow-/
    ]
  },
  spacing: {
    comment: '// Spacing',
    order: 3,
    patterns: [
      /^(m|mx|my|mt|mr|mb|ml|p|px|py|pt|pr|pb|pl|space)-/
    ]
  },
  border: {
    comment: '// Border',
    order: 4,
    patterns: [
      /^(border|divide|ring|rounded|outline)/,
      /^(border|divide|ring|outline)-(t|r|b|l|x|y)?-?/
    ]
  },
  background: {
    comment: '// Background',
    order: 5,
    patterns: [
      /^bg-/,
      /^(from|via|to)-/,
      /^gradient-to-/,
      /^backdrop-/
    ]
  },
  text: {
    comment: '// Text',
    order: 6,
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
    order: 7,
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
    order: 8,
    patterns: [
      /^(hover|focus|active|visited|disabled|checked|group-hover|focus-within|focus-visible):/,
      /^dark:/,
      /^(first|last|odd|even|group):/
    ]
  },
  responsive: {
    comment: '// Responsive',
    order: 9,
    patterns: [
      /^(sm|md|lg|xl|2xl):/
    ]
  },
  others: {
    comment: '// Others',
    order: 10,
    patterns: []
  }
};

/**
 * Categorize a single Tailwind class
 */
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

/**
 * Group Tailwind classes by category
 */
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
  
  // Remove empty groups and sort by order
  const sortedGrouped = {};
  Object.entries(grouped)
    .filter(([_, classes]) => classes.length > 0)
    .sort(([a], [b]) => CLASS_GROUPS[a].order - CLASS_GROUPS[b].order)
    .forEach(([key, classes]) => {
      sortedGrouped[key] = classes;
    });
  
  return sortedGrouped;
}

/**
 * Format grouped classes as a clsx expression
 */
function formatAsClsx(grouped, indent = '  ') {
  const lines = ['clsx('];
  
  Object.entries(grouped).forEach(([category, classes], index, arr) => {
    // Add comment
    lines.push(`${indent}${CLASS_GROUPS[category].comment}`);
    
    // Add classes
    const classString = `${indent}"${classes.join(' ')}"`;
    const isLast = index === arr.length - 1;
    lines.push(classString + (isLast ? '' : ','));
  });
  
  lines.push(')');
  return lines.join('\n');
}

/**
 * Format grouped classes as a template literal
 */
function formatAsTemplateLiteral(grouped, indent = '  ') {
  const lines = ['`'];
  
  Object.entries(grouped).forEach(([category, classes]) => {
    // Add comment
    lines.push(`${indent}${CLASS_GROUPS[category].comment}`);
    
    // Add classes
    lines.push(`${indent}${classes.join(' ')}`);
  });
  
  lines.push('`');
  return lines.join('\n');
}

/**
 * Format grouped classes as an array
 */
function formatAsArray(grouped, indent = '  ') {
  const lines = ['['];
  
  Object.entries(grouped).forEach(([category, classes], index, arr) => {
    // Add comment
    lines.push(`${indent}${CLASS_GROUPS[category].comment}`);
    
    // Add classes
    const classString = `${indent}"${classes.join(' ')}"`;
    const isLast = index === arr.length - 1;
    lines.push(classString + (isLast ? '' : ','));
  });
  
  lines.push(']');
  return lines.join('\n');
}

/**
 * Main formatter function
 */
function formatTailwindClasses(classString, options = {}) {
  const {
    format = 'clsx', // 'clsx', 'template', 'array', 'object'
    minClasses = 4,
    indent = '  '
  } = options;
  
  // Check if we should format
  const classes = classString.split(/\s+/).filter(Boolean);
  if (classes.length < minClasses) {
    return classString;
  }
  
  // Group the classes
  const grouped = groupTailwindClasses(classString);
  
  // Format based on selected format
  switch (format) {
    case 'clsx':
      return formatAsClsx(grouped, indent);
    case 'template':
      return formatAsTemplateLiteral(grouped, indent);
    case 'array':
      return formatAsArray(grouped, indent);
    case 'object':
      return JSON.stringify(grouped, null, 2);
    default:
      return formatAsClsx(grouped, indent);
  }
}

// Export for use in Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    formatTailwindClasses,
    groupTailwindClasses,
    categorizeClass,
    CLASS_GROUPS
  };
}

// CLI Usage
if (require.main === module) {
  const readline = require('readline');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  console.log('Tailwind Class Formatter');
  console.log('========================');
  console.log('Paste your Tailwind classes and press Enter twice:\n');
  
  let input = '';
  let emptyLineCount = 0;
  
  rl.on('line', (line) => {
    if (line === '') {
      emptyLineCount++;
      if (emptyLineCount === 2) {
        // Process the input
        console.log('\nFormatted Output:');
        console.log('----------------');
        console.log(formatTailwindClasses(input.trim()));
        
        // Reset for next input
        input = '';
        emptyLineCount = 0;
        console.log('\n\nPaste more classes or press Ctrl+C to exit:\n');
      }
    } else {
      emptyLineCount = 0;
      input += ' ' + line;
    }
  });
}

// Example usage
if (typeof window !== 'undefined') {
  // Browser usage
  window.formatTailwindClasses = formatTailwindClasses;
  
  // Example
  const example = "mt-4 flex items-center justify-between px-6 py-3 bg-white border rounded-lg shadow-sm hover:shadow-md dark:bg-gray-800 text-sm font-medium";
  console.log('Original:', example);
  console.log('\nFormatted:');
  console.log(formatTailwindClasses(example));
}
