module.exports = {
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    quotes: ['error', 'single'],
    'jsx-quotes': ['error', 'prefer-single'],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}
