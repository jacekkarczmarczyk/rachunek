import Vue from 'vue';

export const MUTATE_TAX_SETTINGS = (state, settings) => {
  Object.keys(state.settings.tax).forEach(setting => {
    if (setting in settings) {
      state.settings.tax[setting] = settings[setting];
    }
  });
};
export const MUTATE_ADD_COMPANY = (state, company) => {
  Vue.set(state.companies, company.taxId, Object.assign({}, company));
};
export const MUTATE_SET_CURRENT_TAX_ID = (state, taxId) => {
  state.currentTaxId = taxId;
};
export const MUTATE_REMOVE_COMPANY = (state, taxId) => {
  Vue.delete(state.companies, taxId);
};
export const MUTATE_SET_SELLER = (state, seller) => {
  state.seller = Object.assign({}, seller);
};
// # sourceMappingURL=mutations.js.map
