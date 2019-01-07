import Vue from 'vue';

export const MUTATE_TAX_SETTINGS = (state: any, settings: any) => {
  Object.keys(state.settings.tax).forEach((setting) => {
    if (setting in settings) {
      state.settings.tax[setting] = settings[setting];
    }
  });
};

export const MUTATE_ADD_COMPANY = (state: any, company: any) => {
  Vue.set(state.companies, company.taxId, Object.assign({}, company));
};

export const MUTATE_SET_CURRENT_TAX_ID = (state: any, taxId: any) => {
  state.currentTaxId = taxId;
};

export const MUTATE_REMOVE_COMPANY = (state: any, taxId: any) => {
  Vue.delete(state.companies, taxId);
};

export const MUTATE_SET_SELLER = (state: any, seller: any) => {
  state.seller = Object.assign({}, seller);
};
