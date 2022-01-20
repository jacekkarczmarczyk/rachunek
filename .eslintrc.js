module.exports = {
  extends: ['jkarczm/vuetify'],
  parserOptions: {
    project: 'tsconfig.json',
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
