/**
 * ESLint Rule Tester for tailwind-group plugin
 */

const { RuleTester } = require('eslint');
const plugin = require('./index.js');

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
});

console.log('='.repeat(80));
console.log('ESLINT PLUGIN TEST SUITE');
console.log('='.repeat(80));

try {
  ruleTester.run('group-tailwind-classes', plugin.rules['group-tailwind-classes'], {
    valid: [
      {
        code: '<div className="flex" />',
        options: [{ formatInline: false, useClsx: true }]
      },
      {
        code: '<div className="flex items-center gap-2" />',
        options: [{ formatInline: false, useClsx: true }]
      },
      {
        code: '<div className={clsx("flex items-center")} />',
        options: [{ formatInline: false, useClsx: true }]
      }
    ],
    invalid: [
      {
        code: '<button className="mt-4 flex items-center px-6 py-3 bg-white border rounded-lg shadow-sm" />',
        output: `<button className={clsx(
    // Layout
    "flex items-center",
    // Spacing
    "mt-4 px-6 py-3",
    // Border
    "border rounded-lg",
    // Background
    "bg-white",
    // Effects
    "shadow-sm"
  )} />`,
        errors: [{ message: 'Tailwind classes should be grouped by category' }],
        options: [{ formatInline: false, useClsx: true }]
      },
      {
        code: '<div className="w-full h-64 p-4 bg-white border rounded-xl shadow-lg flex items-start" />',
        output: `<div className={clsx(
    // Size
    "w-full h-64",
    // Layout
    "flex items-start",
    // Spacing
    "p-4",
    // Border
    "border rounded-xl",
    // Background
    "bg-white",
    // Effects
    "shadow-lg"
  )} />`,
        errors: [{ message: 'Tailwind classes should be grouped by category' }],
        options: [{ formatInline: false, useClsx: true }]
      },
      {
        code: '<input className="block w-full rounded-md border-gray-300 px-3 py-2 bg-white text-sm" />',
        output: `<input className={clsx(
    // Size
    "w-full text-sm",
    // Layout
    "block",
    // Spacing
    "px-3 py-2",
    // Border
    "rounded-md border-gray-300",
    // Background
    "bg-white"
  )} />`,
        errors: [{ message: 'Tailwind classes should be grouped by category' }],
        options: [{ formatInline: false, useClsx: true }]
      }
    ]
  });

  console.log('\n✅ All ESLint rule tests passed!\n');
  console.log('The rule correctly:');
  console.log('  ✓ Ignores classes with fewer than 4 items');
  console.log('  ✓ Detects ungrouped Tailwind classes');
  console.log('  ✓ Provides fix suggestions');
  console.log('\n' + '='.repeat(80));

} catch (error) {
  console.error('\n❌ Test failed:', error.message);
  console.error(error);
  process.exit(1);
}
