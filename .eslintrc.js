module.exports = {
  root: true,
  env: {
    browser: true,
    webextensions: true,
    es2021: true,
  },
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    ecmaVersion: 12,
    sourceType: 'module',
  },
  ignorePatterns: ['dist/'],
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'import/prefer-default-export': 0,
    '@typescript-eslint/ban-ts-comment': "warn",
    'class-methods-use-this': "warn"
  },
};
