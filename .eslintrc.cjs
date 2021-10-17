
module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: [],
  ignorePatterns: [],
  rules: {
    indent: ['error', 2, { SwitchCase: 1, 'ignoredNodes': ['ConditionalExpression'] }],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'always'],
    'no-unused-vars': [
      'error',
      { args: 'all', argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
  },
};
