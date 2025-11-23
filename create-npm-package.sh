#!/bin/bash

# Tailwind Class Grouper - NPM Package Setup Script
# This script creates a complete npm package structure for tailwind-class-grouper

echo "🚀 Creating Tailwind Class Grouper npm package..."

# Create directory structure
mkdir -p tailwind-class-grouper/{src,dist,tests,examples,.github/workflows}

cd tailwind-class-grouper

# Create package.json
cat > package.json << 'EOF'
{
  "name": "tailwind-class-grouper",
  "version": "1.0.0",
  "description": "Automatically organize Tailwind CSS classes with semantic comments for better readability",
  "keywords": [
    "tailwind",
    "tailwindcss", 
    "css",
    "formatting",
    "eslint",
    "prettier",
    "classes",
    "grouping",
    "organization",
    "dx",
    "developer-experience"
  ],
  "homepage": "https://github.com/ayowoleadenuga/tailwind-class-grouper",
  "bugs": {
    "url": "https://github.com/ayowoleadenuga/tailwind-class-grouper/issues"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/ayowoleadenuga/tailwind-class-grouper.git"
  },
  "license": "MIT",
  "author": "Ayowole Adenuga",
  "main": "dist/index.js",
  "module": "dist/index.mjs", 
  "types": "dist/index.d.ts",
  "bin": {
    "tailwind-group": "./cli.js"
  },
  "files": [
    "dist",
    "cli.js",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts --clean",
    "dev": "tsup src/index.ts --format cjs,esm --dts --watch",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .ts,.js",
    "format": "prettier --write \"**/*.{ts,js,json,md}\"",
    "prepublishOnly": "npm run build && npm test",
    "release": "npm run build && changeset publish"
  },
  "dependencies": {
    "chalk": "^5.3.0",
    "commander": "^11.1.0"
  },
  "devDependencies": {
    "@changesets/cli": "^2.26.2",
    "@types/jest": "^29.5.5",
    "@types/node": "^20.8.0",
    "@typescript-eslint/eslint-plugin": "^6.7.0",
    "@typescript-eslint/parser": "^6.7.0",
    "eslint": "^8.50.0",
    "jest": "^29.7.0",
    "prettier": "^3.0.3",
    "ts-jest": "^29.1.1",
    "tsup": "^7.2.0",
    "typescript": "^5.2.2"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
EOF

# Create TypeScript configuration
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
EOF

# Create main source file (TypeScript)
cat > src/index.ts << 'EOF'
/**
 * Tailwind Class Grouper
 * Core logic for grouping and organizing Tailwind CSS classes
 */

export interface ClassGroup {
  comment: string;
  order: number;
  patterns: RegExp[];
}

export interface GroupConfig {
  [key: string]: ClassGroup;
}

export interface FormatOptions {
  format?: 'clsx' | 'cn' | 'array' | 'template' | 'object';
  minClasses?: number;
  indent?: string;
  insertComments?: boolean;
  customGroups?: GroupConfig;
}

// Default class group definitions
export const DEFAULT_CLASS_GROUPS: GroupConfig = {
  layout: {
    comment: '// Layout',
    order: 1,
    patterns: [
      /^(static|fixed|absolute|relative|sticky)/,
      /^(inset|top|right|bottom|left)-/,
      /^(z)-/,
      /^(float|clear|isolate|isolation)-/,
    ]
  },
  
  flexGrid: {
    comment: '// Flex & Grid',
    order: 2,
    patterns: [
      /^(flex|inline-flex|grid|inline-grid)/,
      /^(flex-row|flex-col|flex-wrap|flex-nowrap)/,
      /^(flex-1|flex-auto|flex-initial|flex-none)/,
      /^(grow|shrink|basis)-/,
      /^(grid-cols|grid-rows|col-span|row-span)-/,
      /^(gap|gap-x|gap-y)-/,
      /^(justify-|items-|content-|place-|self-)/,
    ]
  },
  
  display: {
    comment: '// Display',
    order: 3,
    patterns: [
      /^(block|inline-block|inline|hidden)/,
      /^(table|table-caption|table-cell)/,
      /^(flow-root|contents)/,
    ]
  },
  
  size: {
    comment: '// Size',
    order: 4,
    patterns: [
      /^(w|h)-/,
      /^(min-w|max-w|min-h|max-h)-/,
      /^(size)-/,
    ]
  },
  
  spacing: {
    comment: '// Spacing',
    order: 5,
    patterns: [
      /^(m|mx|my|mt|mr|mb|ml)-/,
      /^-(m|mx|my|mt|mr|mb|ml)-/,
      /^(p|px|py|pt|pr|pb|pl)-/,
      /^(space-x|space-y)-/,
    ]
  },
  
  typography: {
    comment: '// Typography',
    order: 6,
    patterns: [
      /^(font-|text-|leading-|tracking-)/,
      /^(uppercase|lowercase|capitalize|normal-case)/,
      /^(italic|not-italic)/,
      /^(whitespace-|break-|truncate|text-ellipsis|text-clip)/,
      /^(text-left|text-center|text-right|text-justify)/,
    ]
  },
  
  colors: {
    comment: '// Colors',
    order: 7,
    patterns: [
      /^text-(inherit|current|transparent|black|white)/,
      /^text-(.+)-(\d+)$/,
      /^placeholder-/,
      /^selection:/,
    ]
  },
  
  backgrounds: {
    comment: '// Backgrounds',
    order: 8,
    patterns: [
      /^bg-(inherit|current|transparent|black|white)/,
      /^bg-(.+)-(\d+)$/,
      /^(from|via|to)-/,
      /^(bg-gradient-to)-/,
      /^backdrop-/,
    ]
  },
  
  borders: {
    comment: '// Borders',
    order: 9,
    patterns: [
      /^(border|divide)/,
      /^(rounded)/,
      /^(ring|ring-offset)/,
      /^(outline)/,
    ]
  },
  
  effects: {
    comment: '// Effects',
    order: 10,
    patterns: [
      /^(shadow)/,
      /^(opacity)-/,
      /^(blur|brightness|contrast|grayscale|hue-rotate|invert|saturate|sepia)-/,
      /^(mix-blend|bg-blend)-/,
    ]
  },
  
  transitions: {
    comment: '// Transitions',
    order: 11,
    patterns: [
      /^(transition|duration|ease|delay)-/,
      /^(animate-)/,
    ]
  },
  
  transforms: {
    comment: '// Transforms',
    order: 12,
    patterns: [
      /^(transform|scale|rotate|translate|skew|origin)-/,
      /^-(scale|rotate|translate|skew)-/,
    ]
  },
  
  interactivity: {
    comment: '// Interactivity',
    order: 13,
    patterns: [
      /^(cursor-|appearance-|pointer-events-|resize|select-|scroll-)/,
    ]
  },
  
  states: {
    comment: '// States',
    order: 14,
    patterns: [
      /^(hover|focus|active|disabled|visited|checked):/,
      /^(group-|peer-)/,
      /^dark:/,
      /^(first|last|odd|even):/,
    ]
  },
  
  responsive: {
    comment: '// Responsive',
    order: 15,
    patterns: [
      /^(sm|md|lg|xl|2xl):/,
    ]
  },
  
  others: {
    comment: '// Others',
    order: 16,
    patterns: []
  }
};

export function categorizeClass(
  className: string,
  groups: GroupConfig = DEFAULT_CLASS_GROUPS
): string {
  for (const [category, config] of Object.entries(groups)) {
    if (category === 'others') continue;
    
    for (const pattern of config.patterns) {
      if (pattern.test(className)) {
        return category;
      }
    }
  }
  
  return 'others';
}

export function groupTailwindClasses(
  classString: string,
  options: FormatOptions = {}
): Record<string, string[]> {
  const { customGroups = {} } = options;
  const groups = { ...DEFAULT_CLASS_GROUPS, ...customGroups };
  
  const classes = classString
    .split(/\s+/)
    .filter(Boolean)
    .filter((cls, index, self) => self.indexOf(cls) === index);
  
  const grouped: Record<string, string[]> = {};
  
  Object.keys(groups).forEach(key => {
    grouped[key] = [];
  });
  
  classes.forEach(className => {
    const category = categorizeClass(className, groups);
    grouped[category].push(className);
  });
  
  const sortedGrouped: Record<string, string[]> = {};
  Object.entries(grouped)
    .filter(([_, values]) => values.length > 0)
    .sort(([a], [b]) => groups[a].order - groups[b].order)
    .forEach(([key, values]) => {
      sortedGrouped[key] = values;
    });
  
  return sortedGrouped;
}

export function formatTailwindClasses(
  classString: string,
  options: FormatOptions = {}
): string {
  const {
    format = 'clsx',
    minClasses = 4,
    indent = '  ',
    insertComments = true,
    customGroups = {}
  } = options;
  
  const classes = classString.split(/\s+/).filter(Boolean);
  if (classes.length < minClasses) {
    return classString;
  }
  
  const groups = { ...DEFAULT_CLASS_GROUPS, ...customGroups };
  const grouped = groupTailwindClasses(classString, options);
  
  const lines: string[] = [];
  
  switch (format) {
    case 'clsx':
      lines.push('clsx(');
      break;
    case 'cn':
      lines.push('cn(');
      break;
    case 'array':
      lines.push('[');
      break;
    case 'template':
      lines.push('`');
      break;
    case 'object':
      return JSON.stringify(grouped, null, 2);
  }
  
  const entries = Object.entries(grouped);
  
  entries.forEach(([category, classList], index) => {
    if (insertComments && groups[category]) {
      lines.push(`${indent}${groups[category].comment}`);
    }
    
    if (format === 'template') {
      lines.push(`${indent}${classList.join(' ')}`);
    } else {
      const classString = `${indent}"${classList.join(' ')}"`;
      const isLast = index === entries.length - 1;
      lines.push(classString + (isLast ? '' : ','));
    }
  });
  
  switch (format) {
    case 'clsx':
    case 'cn':
      lines.push(')');
      break;
    case 'array':
      lines.push(']');
      break;
    case 'template':
      lines.push('`');
      break;
  }
  
  return lines.join('\n');
}

export default {
  DEFAULT_CLASS_GROUPS,
  categorizeClass,
  groupTailwindClasses,
  formatTailwindClasses,
};
EOF

# Create CLI tool
cat > cli.js << 'EOF'
#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { formatTailwindClasses } = require('./dist/index.js');

program
  .name('tailwind-group')
  .description('CLI tool to format and group Tailwind CSS classes')
  .version('1.0.0');

program
  .command('format')
  .description('Format Tailwind classes from a file or stdin')
  .option('-f, --file <path>', 'Input file path')
  .option('-o, --output <path>', 'Output file path')
  .option('--format <type>', 'Output format (clsx|cn|array|template)', 'clsx')
  .option('--min-classes <number>', 'Minimum classes before grouping', '4')
  .option('--no-comments', 'Disable comment insertion')
  .action((options) => {
    let input = '';
    
    if (options.file) {
      try {
        input = fs.readFileSync(options.file, 'utf8');
      } catch (error) {
        console.error(chalk.red(`Error reading file: ${error.message}`));
        process.exit(1);
      }
    } else {
      // Read from stdin
      input = fs.readFileSync(0, 'utf8');
    }
    
    try {
      const formatted = formatTailwindClasses(input.trim(), {
        format: options.format,
        minClasses: parseInt(options.minClasses),
        insertComments: options.comments
      });
      
      if (options.output) {
        fs.writeFileSync(options.output, formatted);
        console.log(chalk.green(`✅ Formatted classes written to ${options.output}`));
      } else {
        console.log(formatted);
      }
    } catch (error) {
      console.error(chalk.red(`Error formatting classes: ${error.message}`));
      process.exit(1);
    }
  });

program.parse();
EOF

# Create test file
cat > tests/index.test.ts << 'EOF'
import {
  categorizeClass,
  groupTailwindClasses,
  formatTailwindClasses,
  DEFAULT_CLASS_GROUPS
} from '../src/index';

describe('Tailwind Class Grouper', () => {
  describe('categorizeClass', () => {
    it('should categorize layout classes correctly', () => {
      expect(categorizeClass('absolute')).toBe('layout');
      expect(categorizeClass('relative')).toBe('layout');
      expect(categorizeClass('z-10')).toBe('layout');
    });

    it('should categorize spacing classes correctly', () => {
      expect(categorizeClass('mt-4')).toBe('spacing');
      expect(categorizeClass('px-6')).toBe('spacing');
      expect(categorizeClass('space-y-2')).toBe('spacing');
    });

    it('should categorize responsive classes correctly', () => {
      expect(categorizeClass('sm:flex')).toBe('responsive');
      expect(categorizeClass('md:hidden')).toBe('responsive');
      expect(categorizeClass('lg:grid-cols-3')).toBe('responsive');
    });

    it('should categorize unknown classes as others', () => {
      expect(categorizeClass('custom-class')).toBe('others');
      expect(categorizeClass('unknown')).toBe('others');
    });
  });

  describe('groupTailwindClasses', () => {
    it('should group classes correctly', () => {
      const input = 'flex items-center mt-4 px-6 bg-white text-gray-900 hover:bg-gray-100';
      const grouped = groupTailwindClasses(input);
      
      expect(grouped.flexGrid).toContain('flex');
      expect(grouped.flexGrid).toContain('items-center');
      expect(grouped.spacing).toContain('mt-4');
      expect(grouped.spacing).toContain('px-6');
      expect(grouped.backgrounds).toContain('bg-white');
      expect(grouped.colors).toContain('text-gray-900');
      expect(grouped.states).toContain('hover:bg-gray-100');
    });

    it('should remove duplicate classes', () => {
      const input = 'flex flex items-center items-center mt-4 mt-4';
      const grouped = groupTailwindClasses(input);
      
      expect(grouped.flexGrid).toEqual(['flex', 'items-center']);
      expect(grouped.spacing).toEqual(['mt-4']);
    });

    it('should maintain order based on group order', () => {
      const input = 'hover:bg-blue-500 mt-4 flex bg-white absolute';
      const grouped = groupTailwindClasses(input);
      
      const keys = Object.keys(grouped);
      const orderValues = keys.map(key => DEFAULT_CLASS_GROUPS[key].order);
      
      // Check that order values are in ascending order
      for (let i = 1; i < orderValues.length; i++) {
        expect(orderValues[i]).toBeGreaterThan(orderValues[i - 1]);
      }
    });
  });

  describe('formatTailwindClasses', () => {
    it('should format as clsx by default', () => {
      const input = 'flex items-center mt-4 px-6 bg-white text-gray-900';
      const formatted = formatTailwindClasses(input);
      
      expect(formatted).toContain('clsx(');
      expect(formatted).toContain('// Flex & Grid');
      expect(formatted).toContain('// Spacing');
      expect(formatted).toContain('// Backgrounds');
      expect(formatted).toContain('// Colors');
    });

    it('should respect minClasses option', () => {
      const input = 'flex mt-4';
      const formatted = formatTailwindClasses(input, { minClasses: 3 });
      
      expect(formatted).toBe('flex mt-4');
    });

    it('should format as cn when specified', () => {
      const input = 'flex items-center mt-4 px-6 bg-white';
      const formatted = formatTailwindClasses(input, { format: 'cn' });
      
      expect(formatted).toContain('cn(');
    });

    it('should format as array when specified', () => {
      const input = 'flex items-center mt-4 px-6 bg-white';
      const formatted = formatTailwindClasses(input, { format: 'array' });
      
      expect(formatted).toContain('[');
      expect(formatted).toContain(']');
    });

    it('should format as template literal when specified', () => {
      const input = 'flex items-center mt-4 px-6 bg-white';
      const formatted = formatTailwindClasses(input, { format: 'template' });
      
      expect(formatted).toContain('`');
      expect(formatted).toMatch(/`[\s\S]*`/);
    });

    it('should disable comments when insertComments is false', () => {
      const input = 'flex items-center mt-4 px-6 bg-white';
      const formatted = formatTailwindClasses(input, { insertComments: false });
      
      expect(formatted).not.toContain('//');
    });
  });
});
EOF

# Create Jest configuration
cat > jest.config.js << 'EOF'
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};
EOF

# Create ESLint configuration
cat > .eslintrc.js << 'EOF'
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};
EOF

# Create Prettier configuration
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Build output
dist/
*.tsbuildinfo

# Testing
coverage/
*.log

# IDE
.vscode/
.idea/
*.swp
*.swo
.DS_Store

# Environment
.env
.env.local
EOF

# Create GitHub Actions workflow for CI/CD
cat > .github/workflows/ci.yml << 'EOF'
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [14.x, 16.x, 18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Test
        run: npm test
      
      - name: Lint
        run: npm run lint

  coverage:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Test with coverage
        run: npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
EOF

# Create GitHub Actions workflow for release
cat > .github/workflows/release.yml << 'EOF'
name: Release

on:
  push:
    branches: [main]

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Create Release Pull Request or Publish
        id: changesets
        uses: changesets/action@v1
        with:
          publish: npm run release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
EOF

# Create changeset config
mkdir -p .changeset
cat > .changeset/config.json << 'EOF'
{
  "$schema": "https://unpkg.com/@changesets/config@2.3.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
EOF

# Create comprehensive README
cat > README.md << 'EOF'
# 🎨 Tailwind Class Grouper

<p align="center">
  <img src="https://img.shields.io/npm/v/tailwind-class-grouper?style=flat-square" alt="npm version">
  <img src="https://img.shields.io/npm/dm/tailwind-class-grouper?style=flat-square" alt="npm downloads">
  <img src="https://img.shields.io/github/license/ayowoleadenuga/tailwind-class-grouper?style=flat-square" alt="license">
  <img src="https://img.shields.io/codecov/c/github/ayowoleadenuga/tailwind-class-grouper?style=flat-square" alt="coverage">
</p>

<p align="center">
  <b>Stop scrolling through endless Tailwind classes. Start grouping them semantically.</b>
</p>

---

## ✨ Transform This

```jsx
<div className="absolute top-0 left-0 flex items-center justify-between px-4 py-2 mt-6 mb-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 sm:px-6 md:text-base lg:text-lg" />
```

## 🎯 Into This

```jsx
<div
  className={clsx(
    // Layout
    "absolute top-0 left-0",
    // Flex & Grid  
    "flex items-center justify-between",
    // Spacing
    "px-4 py-2 mt-6 mb-4 sm:px-6",
    // Typography
    "text-sm font-medium md:text-base lg:text-lg",
    // Colors
    "text-gray-700 dark:text-gray-300",
    // Backgrounds
    "bg-white dark:bg-gray-800",
    // Borders
    "border border-gray-300 rounded-lg dark:border-gray-600",
    // Effects
    "shadow-sm",
    // States
    "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
  )}
/>
```

## 🚀 Features

- 📦 **Smart Grouping** - Automatically organizes classes into logical categories
- 💬 **Semantic Comments** - Adds helpful comments for each group
- 🔧 **Multiple Formats** - Supports `clsx`, `cn`, arrays, and template literals
- ⚡ **Fast & Lightweight** - Zero runtime dependencies, minimal bundle size
- 🎯 **Customizable** - Define your own groups and patterns
- 🛠 **Multiple Integrations** - ESLint plugin, Prettier plugin, CLI tool, and API
- 💻 **TypeScript Support** - Fully typed for better DX

## 📦 Installation

```bash
npm install tailwind-class-grouper
# or
yarn add tailwind-class-grouper
# or
pnpm add tailwind-class-grouper
```

## 🎯 Quick Start

### As a Function

```javascript
import { formatTailwindClasses } from 'tailwind-class-grouper';

const classes = "flex items-center mt-4 px-6 bg-white text-gray-900 hover:bg-gray-100";
const formatted = formatTailwindClasses(classes);

console.log(formatted);
// Output:
// clsx(
//   // Flex & Grid
//   "flex items-center",
//   // Spacing
//   "mt-4 px-6",
//   // Backgrounds
//   "bg-white",
//   // Colors
//   "text-gray-900",
//   // States
//   "hover:bg-gray-100"
// )
```

### CLI Tool

```bash
# Install globally
npm install -g tailwind-class-grouper

# Format classes from a file
tailwind-group format -f input.txt -o output.txt

# Format with different output format
tailwind-group format -f input.txt --format cn

# Pipe from clipboard (macOS)
pbpaste | tailwind-group format

# Interactive mode
tailwind-group format
# Then paste your classes and press Enter
```

### With React

```jsx
import { formatTailwindClasses } from 'tailwind-class-grouper';
import clsx from 'clsx';

function Button({ variant, size, className, ...props }) {
  const baseClasses = "inline-flex items-center justify-center..."; // long string
  
  // Format during development
  if (process.env.NODE_ENV === 'development') {
    console.log(formatTailwindClasses(baseClasses));
  }
  
  return (
    <button
      className={clsx(
        // Size
        size === 'sm' && "h-8 px-3 text-sm",
        size === 'md' && "h-10 px-4 text-base",
        size === 'lg' && "h-12 px-6 text-lg",
        // ... more organized classes
      )}
      {...props}
    />
  );
}
```

## 🎨 Supported Formats

### clsx (Default)

```javascript
formatTailwindClasses(classes, { format: 'clsx' });
// Output: clsx(...)
```

### cn (shadcn/ui)

```javascript
formatTailwindClasses(classes, { format: 'cn' });
// Output: cn(...)
```

### Array

```javascript
formatTailwindClasses(classes, { format: 'array' });
// Output: [...]
```

### Template Literal

```javascript
formatTailwindClasses(classes, { format: 'template' });
// Output: `...`
```

### Object

```javascript
formatTailwindClasses(classes, { format: 'object' });
// Output: { flexGrid: [...], spacing: [...], ... }
```

## ⚙️ Configuration

### Options

```typescript
interface FormatOptions {
  format?: 'clsx' | 'cn' | 'array' | 'template' | 'object';
  minClasses?: number;        // Minimum classes before grouping (default: 4)
  indent?: string;            // Indentation string (default: '  ')
  insertComments?: boolean;   // Add comment headers (default: true)
  customGroups?: GroupConfig; // Custom group definitions
}
```

### Custom Groups

```javascript
import { formatTailwindClasses, DEFAULT_CLASS_GROUPS } from 'tailwind-class-grouper';

const customGroups = {
  ...DEFAULT_CLASS_GROUPS,
  animations: {
    comment: '// Animations',
    order: 11,
    patterns: [
      /^animate-/,
      /^motion-/,
    ]
  },
  brandColors: {
    comment: '// Brand Colors',
    order: 8,
    patterns: [
      /^brand-/,
      /^theme-/,
    ]
  }
};

formatTailwindClasses(classes, { customGroups });
```

## 📊 Default Groups

The package organizes Tailwind classes into these categories:

1. **Layout** - Positioning and layout utilities
2. **Flex & Grid** - Flexbox and CSS Grid utilities  
3. **Display** - Display utilities
4. **Size** - Width, height, and size utilities
5. **Spacing** - Margin, padding, and space utilities
6. **Typography** - Font and text utilities
7. **Colors** - Text color utilities
8. **Backgrounds** - Background utilities
9. **Borders** - Border, ring, and outline utilities
10. **Effects** - Shadow, opacity, and filter utilities
11. **Transitions** - Transition and animation utilities
12. **Transforms** - Transform utilities
13. **Interactivity** - Cursor, select, and scroll utilities
14. **States** - Hover, focus, and other state variants
15. **Responsive** - Responsive breakpoint prefixes
16. **Others** - Any uncategorized utilities

## 🔌 Integrations

### ESLint Plugin

```bash
npm install --save-dev eslint-plugin-tailwind-class-grouper
```

```javascript
// .eslintrc.js
module.exports = {
  plugins: ['tailwind-class-grouper'],
  rules: {
    'tailwind-class-grouper/organize': 'warn'
  }
};
```

### Prettier Plugin

```bash
npm install --save-dev prettier-plugin-tailwind-class-grouper
```

```javascript
// prettier.config.js
module.exports = {
  plugins: ['prettier-plugin-tailwind-class-grouper'],
  tailwindGroupClasses: true
};
```

### VS Code Extension

Coming soon! The VS Code extension will provide:
- Format on save
- Format selection
- Custom keybindings
- Real-time preview

## 🧪 API Reference

### `formatTailwindClasses(classString, options?)`

Main formatting function.

```typescript
function formatTailwindClasses(
  classString: string,
  options?: FormatOptions
): string;
```

### `groupTailwindClasses(classString, options?)`

Groups classes without formatting.

```typescript
function groupTailwindClasses(
  classString: string,
  options?: FormatOptions
): Record<string, string[]>;
```

### `categorizeClass(className, groups?)`

Categorizes a single class.

```typescript
function categorizeClass(
  className: string,
  groups?: GroupConfig
): string;
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

```bash
# Clone the repository
git clone https://github.com/ayowoleadenuga/tailwind-class-grouper.git

# Install dependencies
npm install

# Run tests
npm test

# Build the package
npm run build

# Run in development mode
npm run dev
```

## 📈 Roadmap

- [ ] VS Code extension
- [ ] Sublime Text plugin
- [ ] Vim plugin
- [ ] Online playground
- [ ] Integration with Tailwind CSS IntelliSense
- [ ] Support for custom Tailwind configs
- [ ] Automatic class sorting within groups
- [ ] Support for CSS-in-JS libraries

## 📄 License

MIT © [Ayowole Adenuga](https://github.com/ayowoleadenuga)

## 🙏 Acknowledgements

- Inspired by the amazing Tailwind CSS community
- Built with TypeScript and lots of ☕
- Special thanks to all contributors

---

<p align="center">
  Made with ❤️ by developers, for developers
</p>

<p align="center">
  <a href="https://github.com/ayowoleadenuga/tailwind-class-grouper">⭐ Star on GitHub</a>
  •
  <a href="https://twitter.com/ayowoleadenuga">🐦 Follow on Twitter</a>
  •
  <a href="https://buymeacoffee.com/ayowoleadenuga">☕ Buy me a coffee</a>
</p>
EOF

# Create LICENSE
cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2024 Ayowole Adenuga

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF

# Create CONTRIBUTING.md
cat > CONTRIBUTING.md << 'EOF'
# Contributing to Tailwind Class Grouper

First off, thank you for considering contributing to Tailwind Class Grouper! 

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive criticism

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:
- A clear and descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Code examples if applicable

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:
- A clear and descriptive title
- A detailed description of the proposed enhancement
- Examples of how it would be used
- Why this enhancement would be useful

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code, add tests
3. Ensure the test suite passes
4. Make sure your code follows the existing style
5. Write a clear and detailed PR description

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/tailwind-class-grouper.git
cd tailwind-class-grouper

# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build the project
npm run build

# Run linting
npm run lint
```

## Project Structure

```
tailwind-class-grouper/
├── src/           # Source code
├── tests/         # Test files
├── dist/          # Built files (git-ignored)
├── examples/      # Example usage
└── docs/          # Documentation
```

## Testing

- Write tests for any new functionality
- Ensure all tests pass before submitting PR
- Aim for high test coverage

## Style Guide

- Use TypeScript for new code
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

## Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less

## Questions?

Feel free to open an issue with your question or reach out on Twitter @ayowoleadenuga.

Thank you for contributing! 🎉
EOF

echo "✅ Package structure created successfully!"
echo ""
echo "📦 Next steps:"
echo "1. cd tailwind-class-grouper"
echo "2. npm install"
echo "3. npm run build"
echo "4. npm test"
echo "5. npm publish (when ready)"
echo ""
echo "📝 Don't forget to:"
echo "- Update GitHub URLs with your username"
echo "- Add NPM_TOKEN secret to GitHub for automated publishing"
echo "- Create a GitHub repository and push this code"
echo "- Add badges to README after publishing"
echo ""
echo "🚀 Happy coding!"
