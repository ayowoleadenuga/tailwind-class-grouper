# Testing Guide for Tailwind Class Formatter

## Quick Test Methods

### 1. ✅ Standalone Formatter (Works!)

**Run the test suite:**
```bash
node test-formatter.js
```

This will run 6 comprehensive tests showing:
- Button classes formatting
- Form input classes formatting
- Card with transitions formatting
- Minimum class threshold behavior
- Category breakdown
- Different output formats (clsx, array, template)

**Interactive CLI:**
```bash
node tailwind-class-formatter.js
```
Then paste your classes and press Enter twice.

**One-liner test:**
```bash
node -e "const { formatTailwindClasses } = require('./tailwind-class-formatter.js'); console.log(formatTailwindClasses('mt-4 flex items-center px-6 py-3 bg-white border rounded-lg shadow-sm'));"
```

### 2. 🌐 Browser Interactive Test

**Open the HTML test page:**
```bash
open test.html
# or on Linux: xdg-open test.html
# or on Windows: start test.html
```

Features:
- Live formatting of Tailwind classes
- Example buttons to test common patterns
- Real-time category breakdown
- Visual feedback

### 3. 🔌 ESLint Plugin Test

The ESLint plugin needs to be properly installed to test. Here are the options:

**Option A: Link locally for testing**
```bash
# In this directory
npm link

# Then in a test project
npm link eslint-plugin-tailwind-group
```

**Option B: Test in a separate project**
```bash
# Create test project
mkdir test-project
cd test-project
npm init -y
npm install eslint clsx

# Copy the plugin
cp ../index.js ./eslint-plugin-tailwind-group.js

# Create .eslintrc.js that loads the local plugin
# Then run: npx eslint --fix your-component.jsx
```

**Option C: Create a minimal test**
Create `eslint-test.js`:
```javascript
const plugin = require('./index.js');
const { RuleTester } = require('eslint');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true }
  }
});

ruleTester.run('group-tailwind-classes', plugin.rules['group-tailwind-classes'], {
  valid: [
    // Already formatted
    {
      code: '<div className={clsx("flex items-center")} />'
    }
  ],
  invalid: [
    {
      code: '<button className="mt-4 flex items-center px-6 py-3 bg-white border rounded-lg" />',
      errors: [{ message: 'Tailwind classes should be grouped by category' }]
    }
  ]
});

console.log('✅ ESLint rule tests passed!');
```

Run: `node eslint-test.js`

### 4. 🎨 Prettier Plugin Test

The Prettier plugin is located in `mnt/user-data/outputs/prettier-plugin-tailwind-group/`.

To test it:

```bash
cd mnt/user-data/outputs/prettier-plugin-tailwind-group

# Install dependencies
npm install prettier

# Create test file
echo 'const Button = () => <button className="mt-4 flex items-center px-6 py-3 bg-white border rounded-lg">Click</button>' > test.jsx

# Create prettier config
echo '{"plugins": ["./index.js"], "tailwindGroup": true}' > .prettierrc

# Run prettier
npx prettier test.jsx --write
```

## Test Files Created

1. **[test-formatter.js](test-formatter.js)** - Comprehensive Node.js test suite ✅
2. **[test.html](test.html)** - Interactive browser test ✅
3. **[test-component.jsx](test-component.jsx)** - Sample React components for ESLint testing
4. **[.eslintrc.js](.eslintrc.js)** - ESLint configuration

## Expected Behavior

### Input
```
mt-4 flex items-center justify-between px-6 py-3 bg-white border rounded-lg shadow-sm hover:shadow-md dark:bg-gray-800 text-sm font-medium
```

### Output
```javascript
clsx(
  // Size
  "text-sm",
  // Layout
  "flex items-center justify-between",
  // Spacing
  "mt-4 px-6 py-3",
  // Border
  "border rounded-lg",
  // Background
  "bg-white",
  // Text
  "font-medium",
  // Effects
  "shadow-sm",
  // States & Variants
  "hover:shadow-md dark:bg-gray-800"
)
```

## Class Categories

The formatter organizes classes into these categories (in order):

1. **Size** - `w-*`, `h-*`, `text-sm`, etc.
2. **Layout** - `flex`, `grid`, `absolute`, `items-*`, etc.
3. **Spacing** - `m-*`, `p-*`, `mx-*`, `py-*`, etc.
4. **Border** - `border`, `rounded-*`, `ring-*`, etc.
5. **Background** - `bg-*`, `from-*`, `to-*`, etc.
6. **Text** - `text-*`, `font-*`, `placeholder-*`, etc.
7. **Effects** - `shadow-*`, `opacity-*`, `transition-*`, etc.
8. **States & Variants** - `hover:*`, `focus:*`, `dark:*`, responsive breakpoints
9. **Responsive** - `sm:*`, `md:*`, `lg:*`, etc.
10. **Others** - Unmatched classes

## Configuration Options

### Standalone Formatter
```javascript
formatTailwindClasses(classString, {
  format: 'clsx',      // 'clsx', 'array', 'template', 'object'
  minClasses: 4,       // Minimum classes before formatting
  indent: '  '         // Indentation string
})
```

### ESLint Plugin
```javascript
'tailwind-group/group-tailwind-classes': [
  'warn',
  {
    formatInline: false,  // Format even small class lists
    useClsx: true         // Use clsx() wrapper
  }
]
```

### Prettier Plugin
```javascript
{
  plugins: ['prettier-plugin-tailwind-group'],
  tailwindGroup: true,           // Enable the plugin
  tailwindGroupMinClasses: 4     // Minimum classes before grouping
}
```

## Troubleshooting

### Classes not being grouped
- Check you have at least 4 classes (configurable)
- Ensure classes match Tailwind patterns
- Verify the plugin is enabled in config

### ESLint not finding plugin
- Make sure the plugin is installed: `npm install`
- Check the plugin name matches in `.eslintrc.js`
- Try using absolute path to local plugin file

### Prettier not formatting
- Verify `tailwindGroup: true` in prettier config
- Check that the plugin is in the `plugins` array
- Ensure you're using `--write` flag

## Next Steps

1. ✅ Run `node test-formatter.js` to verify the core formatter works
2. ✅ Open `test.html` in a browser for interactive testing
3. 🔄 Set up proper ESLint plugin testing with `npm link`
4. 🔄 Test Prettier plugin in a sample React project
5. 📦 Publish to npm when ready!

## Quick Verification

Run this to verify everything is working:
```bash
node test-formatter.js && echo "\n✅ All tests passed! Open test.html in a browser to test interactively."
```
