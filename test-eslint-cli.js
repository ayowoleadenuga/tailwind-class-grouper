#!/usr/bin/env node
/**
 * CLI tool to test ESLint plugin on actual files
 */

const { ESLint } = require('eslint');
const fs = require('fs');
const path = require('path');
const plugin = require('./index.js');

async function testFile(filePath) {
  console.log('='.repeat(80));
  console.log(`TESTING ESLINT PLUGIN ON: ${filePath}`);
  console.log('='.repeat(80));

  // Read original file
  const originalCode = fs.readFileSync(filePath, 'utf8');
  console.log('\n📥 ORIGINAL FILE:');
  console.log('-'.repeat(80));
  console.log(originalCode);

  // Create ESLint instance
  const eslint = new ESLint({
    useEslintrc: false,
    baseConfig: {
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      plugins: {
        'tailwind-group': plugin
      },
      rules: {
        'tailwind-group/group-tailwind-classes': [
          'warn',
          {
            formatInline: false,
            useClsx: true
          }
        ]
      }
    },
    fix: true
  });

  // Lint and fix
  const results = await eslint.lintFiles([filePath]);

  // Apply fixes
  await ESLint.outputFixes(results);

  // Read fixed file
  const fixedCode = fs.readFileSync(filePath, 'utf8');

  console.log('\n\n📤 FIXED FILE:');
  console.log('-'.repeat(80));
  console.log(fixedCode);

  // Show results
  const result = results[0];
  console.log('\n\n📊 RESULTS:');
  console.log('-'.repeat(80));
  console.log(`Fixed: ${result.output ? '✅ Yes' : '⚪ No changes needed'}`);
  console.log(`Warnings: ${result.warningCount}`);
  console.log(`Errors: ${result.errorCount}`);

  if (result.messages.length > 0) {
    console.log('\n📋 Messages:');
    result.messages.forEach(msg => {
      const icon = msg.severity === 2 ? '❌' : '⚠️';
      console.log(`  ${icon} Line ${msg.line}:${msg.column} - ${msg.message}`);
    });
  }

  console.log('\n' + '='.repeat(80));
  console.log('✅ Test completed!');
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
