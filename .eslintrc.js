const path = require('path');

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    // Load the local plugin
    path.resolve(__dirname, 'index.js')
  ],
  rules: {
    'group-tailwind-classes': [
      'warn',
      {
        formatInline: false,
        useClsx: true,
      },
    ],
  },
};
