import Vue from 'vue'
import Vuex from 'vuex'
import __global__ from './__global__'
import initPersistentState from './storagePlugin'
import { name as storageKey } from '../../package.json'

Vue.use(Vuex)

const store = new Vuex.Store(initPersistentState({
  store: {
    modules: {
      __global__,
    },
  },
  storageKey,
  storage: localStorage,
}))

export default store
