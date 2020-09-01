module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true
  },
  parserOptions: {
    sourceType: 'module',
    parser: '@typescript-eslint/parser'
  },
  extends: [
    'standard',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/recommended',
    '@vue/typescript/recommended'
  ],
  plugins: [
    'vue'
  ]
}
