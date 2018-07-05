import Vue from 'vue'

export const MUTATE_TAX_SETTINGS = (state, settings) => {
  Object.keys(state.settings.tax).forEach(setting => {
    if (setting in settings) {
      state.settings.tax[setting] = settings[setting]
    }
  })
}

export const MUTATE_ADD_COMPANY = (state, company) => {
  Vue.set(state.companies, company.nip, company)
}

export const MUTATE_REMOVE_COMPANY = (state, nip) => {
  Vue.delete(state.companies, nip)
}
