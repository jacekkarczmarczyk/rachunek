module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    'max-len': 'off',
    'no-param-reassign': 'off',
    'no-prototype-builtins': 'off',
    'no-underscore-dangle': 'off',
    'no-alert': 'off',
    'no-restricted-globals': 'off',
  },
  parserOptions: {
    parser: 'typescript-eslint-parser',
  },
};
