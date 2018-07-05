import * as actions from './actions'
import * as mutations from './mutations'

export default {
  namespaced: true,
  sync: ['settings'],
  state: {
    settings: {
      tax: {
        ubezpieczenieSpoleczne: 0,
        ubezpieczenieZdrowotne: 0,
        stawkaPodatkuLiniowego: 19.0,
      },
    },
    companies: [],
  },
  actions,
  mutations,
}
