module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  ignorePatterns: ['webpack.*.js'],
  rules: {
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'class-methods-use-this': 'off',
    'implicit-arrow-linebreak': 'off',
    'object-curly-newline': 'off',
    'max-len': 'off',
    'import/prefer-default-export': 'off',
    'no-param-reassign': 'off',
  },
};
