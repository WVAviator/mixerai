// lint-staged.config.js
export default {
  'packages/server/**/*.ts?(x)': () => [
    'tsc -p packages/server/tsconfig.json --noEmit',
    'eslint --fix',
  ],
  'packages/mobile/**/*.ts?(x)': () => [
    'tsc -p packages/mobile/tsconfig.json --noEmit',
    'eslint --fix',
  ],

  '**/*.js?(x)': () => ['eslint --fix'],
};
