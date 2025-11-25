# Contributing to Tailwind Class Grouper

Thanks for your interest in contributing! This project ships two plugins:
- ESLint plugin: `eslint-plugin-tailwind-group`
- Prettier plugin: `prettier-plugin-tailwind-group`

## Getting Started
1. **Node version**: Use Node 18+ (Node 22 recommended).  
2. **Install deps**: `npm install`
3. **Tests**:
   - Standalone formatter: `node test-formatter.js`
   - ESLint plugin demo: `node test-eslint-live.js` (needs `eslint` installed via `npm install`)
   - Prettier plugin: `node test-prettier.js`
4. **Coding style**: Prettier/ESLint; keep changes minimal and focused.

## Pull Requests
- Create a feature/bugfix branch off `main`.
- Include tests or update existing ones when changing behavior.
- Ensure `npm test` (or the relevant scripts above) passes.
- Fill out the PR template: what changed, why, and how it was tested.
- Keep commits scoped; avoid unrelated formatting.

## Reporting Issues
- Provide repro steps, expected vs actual behavior, and environment (Node version, OS).
- For formatter/plugin bugs, include a minimal code sample and config (`.eslintrc`, `.prettierrc`).

## Release / Publish (maintainers)
- Bump versions in the plugin `package.json` files.
- Run the pack helper: `bash create-npm-package.sh`
- Publish from `dist-packages/`: `npm publish <tarball> --access public`
- Tag the release (e.g., `v1.0.x`) and update changelog if maintained.

## Code of Conduct
Please follow the CODE_OF_CONDUCT.md.
