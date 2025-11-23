# Tailwind Class Grouper Plugins

Automatically organize and group your Tailwind CSS classes for better readability and maintainability. Available as both ESLint and Prettier plugins.

## Before & After

**Before:**
```jsx
<select className="border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 dark:hover:bg-input/50 h-9 w-full min-w-0 appearance-none rounded-md border bg-transparent px-3 py-2 pr-9 text-sm shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed" />
```

**After:**
```jsx
<select
  className={clsx(
    // Size
    "h-9 w-full min-w-0",
    // Layout
    "relative",
    // Spacing
    "px-3 py-2 pr-9",
    // Border
    "border border-input outline-none rounded-md",
    // Background
    "bg-transparent dark:bg-input/30 dark:hover:bg-input/50 selection:bg-primary",
    // Text
    "text-sm selection:text-primary-foreground placeholder:text-muted-foreground",
    // Effects
    "appearance-none shadow-xs transition-[color,box-shadow]",
    // Others
    "disabled:pointer-events-none disabled:cursor-not-allowed"
  )}
/>
```

## Installation

### Option 1: ESLint Plugin

```bash
npm install --save-dev eslint-plugin-tailwind-group
# or
yarn add -D eslint-plugin-tailwind-group
# or
pnpm add -D eslint-plugin-tailwind-group
```

### Option 2: Prettier Plugin

```bash
npm install --save-dev prettier-plugin-tailwind-group
# or
yarn add -D prettier-plugin-tailwind-group
# or
pnpm add -D prettier-plugin-tailwind-group
```

## Configuration

### ESLint Configuration

Add to your `.eslintrc.js` or `.eslintrc.json`:

```js
// .eslintrc.js
module.exports = {
  plugins: ['tailwind-group'],
  rules: {
    'tailwind-group/group-tailwind-classes': [
      'warn',
      {
        formatInline: false, // Set to true to format even small class lists
        useClsx: true       // Set to false if you don't use clsx
      }
    ]
  }
};
```

Or in `.eslintrc.json`:

```json
{
  "plugins": ["tailwind-group"],
  "rules": {
    "tailwind-group/group-tailwind-classes": [
      "warn",
      {
        "formatInline": false,
        "useClsx": true
      }
    ]
  }
}
```

### Prettier Configuration

Add to your `.prettierrc` or `prettier.config.js`:

```js
// prettier.config.js
module.exports = {
  plugins: ['prettier-plugin-tailwind-group'],
  tailwindGroup: true,              // Enable the plugin
  tailwindGroupMinClasses: 4,       // Minimum classes before grouping
};
```

Or in `.prettierrc.json`:

```json
{
  "plugins": ["prettier-plugin-tailwind-group"],
  "tailwindGroup": true,
  "tailwindGroupMinClasses": 4
}
```

## Class Categories

The plugins organize Tailwind classes into these logical groups:

1. **Size** - Width, height, text sizes
   - `w-*`, `h-*`, `min-w-*`, `max-w-*`, `size-*`, `text-xs`, etc.

2. **Layout** - Display, position, flex/grid properties
   - `flex`, `grid`, `absolute`, `relative`, `justify-*`, `items-*`, etc.

3. **Spacing** - Margin, padding, space utilities
   - `m-*`, `p-*`, `mx-*`, `py-*`, `space-*`, etc.

4. **Border** - Border, ring, outline, border-radius
   - `border`, `border-*`, `ring-*`, `rounded-*`, `outline-*`, etc.

5. **Background** - Background colors, gradients, images
   - `bg-*`, `from-*`, `via-*`, `to-*`, `backdrop-*`, etc.

6. **Text** - Font, text color, alignment, decoration
   - `text-*`, `font-*`, `uppercase`, `truncate`, `placeholder-*`, etc.

7. **Effects** - Shadows, opacity, transforms, transitions
   - `shadow-*`, `opacity-*`, `transform`, `transition-*`, `animate-*`, etc.

8. **States & Variants** - Hover, focus, responsive, dark mode
   - `hover:*`, `focus:*`, `dark:*`, `sm:*`, `md:*`, etc.

9. **Others** - Any unmatched utilities

## Usage with VS Code

### Auto-fix on save with ESLint

Add to your VS Code `settings.json`:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Format on save with Prettier

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

## Integration with Existing Projects

### With clsx/classnames

The plugins work seamlessly with utility libraries like `clsx` or `classnames`:

```jsx
// Input
<div className={clsx("mt-4 flex items-center justify-between px-6 py-3 bg-white border rounded-lg shadow-sm hover:shadow-md", someCondition && "opacity-50")} />

// Output (with grouping)
<div
  className={clsx(
    // Layout
    "flex items-center justify-between",
    // Spacing
    "mt-4 px-6 py-3",
    // Border
    "border rounded-lg",
    // Background
    "bg-white",
    // Effects
    "shadow-sm hover:shadow-md",
    someCondition && "opacity-50"
  )}
/>
```

### With Tailwind CSS IntelliSense

The grouped format maintains full compatibility with Tailwind CSS IntelliSense for:
- Autocomplete suggestions
- Hover previews
- Linting

## CLI Usage

### ESLint CLI

```bash
# Check files
npx eslint "src/**/*.{js,jsx,ts,tsx}"

# Auto-fix files
npx eslint "src/**/*.{js,jsx,ts,tsx}" --fix
```

### Prettier CLI

```bash
# Check files
npx prettier --check "src/**/*.{js,jsx,ts,tsx}"

# Format files
npx prettier --write "src/**/*.{js,jsx,ts,tsx}"
```

## Package Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "lint": "eslint 'src/**/*.{js,jsx,ts,tsx}'",
    "lint:fix": "eslint 'src/**/*.{js,jsx,ts,tsx}' --fix",
    "format": "prettier --write 'src/**/*.{js,jsx,ts,tsx}'",
    "format:check": "prettier --check 'src/**/*.{js,jsx,ts,tsx}'"
  }
}
```

## Customization

### Adding Custom Categories

You can extend the plugins to add your own categories. For example, to add a category for your custom utilities:

```js
// In the plugin source
const CLASS_GROUPS = {
  // ... existing groups ...
  custom: {
    comment: '// Custom Utilities',
    patterns: [
      /^brand-/,  // Your custom brand utilities
      /^theme-/,  // Your theme utilities
    ]
  }
};
```

## Troubleshooting

### Classes not being grouped

1. Check that you have at least 4 classes (configurable with `tailwindGroupMinClasses`)
2. Ensure the plugin is properly installed and configured
3. Verify that your file extensions are included in the linting/formatting

### Conflicts with other plugins

If using with `prettier-plugin-tailwindcss` (official Tailwind sorting plugin), configure the order:

```js
module.exports = {
  plugins: [
    'prettier-plugin-tailwindcss',  // Sort first
    'prettier-plugin-tailwind-group' // Then group
  ]
};
```

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT
