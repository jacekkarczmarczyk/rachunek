import * as actions from './actions'
import * as mutations from './mutations'

export default {
  namespaced: true,
  sync: ['settings', 'companies', 'currentTaxId'],
  state: {
    settings: {
      tax: {
        ubezpieczenieSpoleczne: 0,
        ubezpieczenieZdrowotne: 0,
        stawkaVat: 19.0,
      },
    },
    companies: {},
    currentTaxId: '',
  },
  actions,
  mutations,
}
