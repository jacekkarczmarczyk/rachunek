module.exports = {
  extends: ['jkarczm/vuetify'],
  // parserOptions: {
  //   project: 'tsconfig.json',
  // },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: {
      ts: '@typescript-eslint/parser',
      js: '@typescript-eslint/parser',
      '<template>': 'espree',
    },
  },
  // TODO remove
  rules: {
    'vue/no-mutating-props': 'off',
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
  },
};
