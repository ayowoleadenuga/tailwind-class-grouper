/**
 * Test the Prettier plugin
 */

const prettier = require('prettier');
const fs = require('fs');
const path = require('path');

// Import the plugin
const plugin = require('./mnt/user-data/outputs/prettier-plugin-tailwind-group/index.js');

console.log('='.repeat(80));
console.log('PRETTIER PLUGIN TEST');
console.log('='.repeat(80));

const testCases = [
  {
    name: 'Button with multiple classes',
    code: `
export const Button = () => {
  return (
    <button className="mt-4 flex items-center justify-between px-6 py-3 bg-white border rounded-lg shadow-sm hover:shadow-md dark:bg-gray-800 text-sm font-medium">
      Click Me
    </button>
  );
};
`
  },
  {
    name: 'Card component',
    code: `
const Card = () => (
  <div className="w-full h-64 p-4 mx-auto max-w-md bg-white dark:bg-gray-900 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-start justify-between">
    <h2>Title</h2>
    <p>Content</p>
  </div>
);
`
  },
  {
    name: 'Form input',
    code: `
<input className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 px-3 py-2 bg-white text-sm" />
`
  },
  {
    name: 'Too few classes (should not change)',
    code: `
<div className="flex items-center gap-2">Content</div>
`
  }
];

async function run() {
  for (const [index, test] of testCases.entries()) {
    console.log(`\n\n📝 Test ${index + 1}: ${test.name}`);
    console.log('-'.repeat(80));
    console.log('\n📥 BEFORE:');
    console.log(test.code.trim());

    try {
      const formatted = await prettier.format(test.code, {
        parser: 'babel',
        plugins: [plugin],
        tailwindGroup: true,
        tailwindGroupMinClasses: 4,
      });

      console.log('\n📤 AFTER:');
      console.log(formatted.trim());

      if (formatted.trim() !== test.code.trim()) {
        console.log('\n✅ Formatted!');
      } else {
        console.log('\n⚪ No changes (as expected)');
      }
    } catch (error) {
      console.log('\n❌ Error:', error.message);
    }
  }
}

run().catch(err => {
  console.error('\n❌ Unexpected error running tests:', err);
  process.exitCode = 1;
});

console.log('\n\n' + '='.repeat(80));
console.log('NOTE: Prettier plugin formats via AST transform (Prettier v3).');
console.log('Enable `tailwindGroup` in your config and ensure `clsx` is available.');
console.log('='.repeat(80) + '\n');
