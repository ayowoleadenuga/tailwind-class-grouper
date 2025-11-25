/**
 * Test script for the Tailwind Class Formatter
 */

const { formatTailwindClasses, groupTailwindClasses } = require('./tailwind-class-formatter.js');

console.log('='.repeat(80));
console.log('TAILWIND CLASS FORMATTER - TEST SUITE');
console.log('='.repeat(80));

// Test 1: Simple button classes
console.log('\n\n📝 Test 1: Button with multiple classes');
console.log('-'.repeat(80));
const buttonClasses = "mt-4 flex items-center justify-between px-6 py-3 bg-white border rounded-lg shadow-sm hover:shadow-md dark:bg-gray-800 text-sm font-medium";
console.log('\n📥 INPUT:');
console.log(buttonClasses);
console.log('\n📤 OUTPUT:');
console.log(formatTailwindClasses(buttonClasses));

// Test 2: Form input with many classes
console.log('\n\n📝 Test 2: Form input with complex classes');
console.log('-'.repeat(80));
const inputClasses = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 disabled:cursor-not-allowed disabled:bg-gray-50";
console.log('\n📥 INPUT:');
console.log(inputClasses);
console.log('\n📤 OUTPUT:');
console.log(formatTailwindClasses(inputClasses));

// Test 3: Card with transitions
console.log('\n\n📝 Test 3: Card with transitions and responsive classes');
console.log('-'.repeat(80));
const cardClasses = "w-full h-64 p-4 mx-auto max-w-md bg-white dark:bg-gray-900 border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-start justify-between text-gray-900 dark:text-white";
console.log('\n📥 INPUT:');
console.log(cardClasses);
console.log('\n📤 OUTPUT:');
console.log(formatTailwindClasses(cardClasses));

// Test 4: Too few classes (should not format)
console.log('\n\n📝 Test 4: Too few classes (should stay inline)');
console.log('-'.repeat(80));
const fewClasses = "flex items-center gap-2";
console.log('\n📥 INPUT:');
console.log(fewClasses);
console.log('\n📤 OUTPUT:');
console.log(formatTailwindClasses(fewClasses));

// Test 5: Test grouping functionality
console.log('\n\n📝 Test 5: Class grouping breakdown');
console.log('-'.repeat(80));
const testClasses = "w-full h-10 flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors";
console.log('\n📥 INPUT:');
console.log(testClasses);
console.log('\n📊 GROUPED BY CATEGORY:');
const grouped = groupTailwindClasses(testClasses);
Object.entries(grouped).forEach(([category, classes]) => {
  console.log(`\n  ${category.toUpperCase()}:`);
  console.log(`    ${classes.join(', ')}`);
});

// Test 6: Different output formats
console.log('\n\n📝 Test 6: Different output formats');
console.log('-'.repeat(80));
const multiClasses = "w-full h-32 p-4 bg-blue-500 text-white rounded-lg shadow-md hover:shadow-lg";
console.log('\n📥 INPUT:');
console.log(multiClasses);

console.log('\n📤 clsx FORMAT:');
console.log(formatTailwindClasses(multiClasses, { format: 'clsx' }));

console.log('\n📤 ARRAY FORMAT:');
console.log(formatTailwindClasses(multiClasses, { format: 'array' }));

console.log('\n📤 TEMPLATE LITERAL FORMAT:');
console.log(formatTailwindClasses(multiClasses, { format: 'template' }));

console.log('\n\n' + '='.repeat(80));
console.log('✅ All tests completed!');
console.log('='.repeat(80) + '\n');
