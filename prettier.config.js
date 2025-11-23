// prettier.config.js
module.exports = {
  // Standard Prettier options
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  
  // Tailwind class grouping plugin
  plugins: [
    'prettier-plugin-tailwindcss',     // Official Tailwind sorting (optional)
    'prettier-plugin-tailwind-group',  // Our grouping plugin
  ],
  
  // Plugin-specific options
  tailwindGroup: true,           // Enable class grouping
  tailwindGroupMinClasses: 4,    // Minimum classes before grouping
  
  // Tailwind CSS plugin options (if using official plugin)
  tailwindConfig: './tailwind.config.js',
};