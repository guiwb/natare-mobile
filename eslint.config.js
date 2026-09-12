// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    rules: {
      'import/no-named-as-default': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      // new in eslint-config-expo 57: the data-loading effects across the app
      // still set state synchronously; downgraded until they are refactored
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
    },
  },
  {
    files: ['scripts/**/*.js'],
    languageOptions: {
      globals: { __dirname: 'readonly', process: 'readonly' },
    },
  },
]);
