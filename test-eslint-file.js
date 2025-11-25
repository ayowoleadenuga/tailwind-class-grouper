#!/usr/bin/env node
/**
 * Test ESLint plugin on a real file
 */

const { Linter } = require('eslint');
const fs = require('fs');
const plugin = require('./index.js');

const linter = new Linter();

// Register the plugin rule
linter.defineRule('group-tailwind-classes', plugin.rules['group-tailwind-classes']);

async function testFile(filePath) {
  console.log('='.repeat(80));
  console.log(`TESTING ESLINT PLUGIN ON: ${filePath}`);
  console.log('='.repeat(80));

  // Read original file
  const originalCode = fs.readFileSync(filePath, 'utf8');
  console.log('\n📥 ORIGINAL FILE:');
  console.log('-'.repeat(80));
  console.log(originalCode);

  // Lint and fix
  const result = linter.verifyAndFix(originalCode, {
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

  console.log('\n\n📤 FIXED FILE:');
  console.log('-'.repeat(80));
  console.log(result.output);

  // Write back to file
  fs.writeFileSync(filePath, result.output, 'utf8');

  console.log('\n\n📊 RESULTS:');
  console.log('-'.repeat(80));
  console.log(`Fixed: ${result.fixed ? '✅ Yes' : '⚪ No changes needed'}`);
  console.log(`Messages: ${result.messages.length}`);

  if (result.messages.length > 0) {
    console.log('\n📋 Messages:');
    result.messages.forEach(msg => {
      const icon = msg.severity === 2 ? '❌' : '⚠️';
      console.log(`  ${icon} Line ${msg.line}:${msg.column} - ${msg.message}`);
    });
  }

  console.log('\n' + '='.repeat(80));
  console.log('✅ File has been updated with auto-fixes!');
  console.log('='.repeat(80) + '\n');
}

// Get file from command line or use default
const testFilePath = process.argv[2] || 'test-component.jsx';

if (!fs.existsSync(testFilePath)) {
  console.error(`❌ File not found: ${testFilePath}`);
  process.exit(1);
}

testFile(testFilePath).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
