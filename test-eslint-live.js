/**
 * Live ESLint Plugin Test
 * Shows what the plugin actually outputs
 */

const { Linter } = require('eslint');
const plugin = require('./index.js');

const linter = new Linter();

// Register the plugin
linter.defineRule('group-tailwind-classes', plugin.rules['group-tailwind-classes']);

console.log('='.repeat(80));
console.log('ESLINT PLUGIN - LIVE AUTO-FIX TEST');
console.log('='.repeat(80));

const testCases = [
  {
    name: 'Button with multiple classes',
    code: '<button className="mt-4 flex items-center px-6 py-3 bg-white border rounded-lg shadow-sm" />'
  },
  {
    name: 'Card with many classes',
    code: '<div className="w-full h-64 p-4 bg-white dark:bg-gray-900 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl flex flex-col" />'
  },
  {
    name: 'Form input',
    code: '<input className="block w-full rounded-md border-gray-300 px-3 py-2 bg-white text-sm focus:ring-2" />'
  },
  {
    name: 'Too few classes (should not change)',
    code: '<div className="flex items-center gap-2" />'
  },
  {
    name: 'clsx call with single string',
    code: '<button className={clsx("mt-4 flex items-center px-6 py-3 bg-white border rounded-lg shadow-sm")} />'
  }
];

testCases.forEach((test, index) => {
  console.log(`\n\n📝 Test ${index + 1}: ${test.name}`);
  console.log('-'.repeat(80));
  console.log('\n📥 BEFORE:');
  console.log(test.code);

  const messages = linter.verifyAndFix(test.code, {
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true
      }
    },
    rules: {
      'group-tailwind-classes': ['warn', { formatInline: false, useClsx: true }]
    }
  });

  console.log('\n📤 AFTER:');
  console.log(messages.output || test.code);

  if (messages.fixed) {
    console.log('\n✅ Auto-fixed!');
  } else {
    console.log('\n⚪ No changes (as expected)');
  }

  if (messages.messages.length > 0) {
    console.log('\n📋 Messages:');
    messages.messages.forEach(msg => {
      console.log(`  ${msg.severity === 2 ? '❌' : '⚠️'}  Line ${msg.line}: ${msg.message}`);
    });
  }
});

console.log('\n\n' + '='.repeat(80));
console.log('✅ Live test completed!');
console.log('='.repeat(80) + '\n');
