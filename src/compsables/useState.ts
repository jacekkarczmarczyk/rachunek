import type { InjectionKey } from '@vue/composition-api';
import { reactive } from '@vue/composition-api';
import Vue from 'vue';

export type Company = {
  taxId: string;
  company: string;
  country: string;
  city: string;
  postalCode: string;
  street: string;
  house: string;
  flat: string;
  name: string;
  bankName: string;
  bankAccount: string;
  zus: boolean;
  workingHourRate: number;
  serviceTitle: string;
}

export function useState () {
  const state = reactive({
    settings: {
      tax: {
        ubezpieczenieSpoleczne: 0,
        ubezpieczenieZdrowotne: 0,
        stawkaVat: 19.0,
      },
    },
    companies: {} as { [taxId in string]?: Company },
    seller: createCompany(),
    currentTaxId: '',

  });
  const MUTATE_TAX_SETTINGS = (settings: typeof state.settings.tax) => {
    (Object.keys(state.settings.tax) as (keyof typeof state.settings.tax)[]).forEach(setting => {
      if (setting in settings) {
        state.settings.tax[setting] = settings[setting];
      }
    });
  };
  const MUTATE_ADD_COMPANY = (company: Company) => Vue.set(state.companies, company.taxId, { ...company });
  const MUTATE_SET_CURRENT_TAX_ID = (taxId: string) => (state.currentTaxId = taxId);
  const MUTATE_REMOVE_COMPANY = (taxId: string) => Vue.delete(state.companies, taxId);
  const MUTATE_SET_SELLER = (seller: Company) => (state.seller = { ...seller });

  return {
    state,
    MUTATE_TAX_SETTINGS,
    MUTATE_ADD_COMPANY,
    MUTATE_SET_CURRENT_TAX_ID,
    MUTATE_REMOVE_COMPANY,
    MUTATE_SET_SELLER,
  };
}

export const useStateInjectionKey: InjectionKey<ReturnType<typeof useState>> = Symbol('useState');

export function createCompany (): Company {
  return {
    company: '',
    taxId: '',
    country: 'Polska',
    city: '',
    postalCode: '',
    street: '',
    house: '',
    flat: '',
    workingHourRate: 0,
    zus: true,
    bankAccount: '',
    bankName: '',
    name: '',
    serviceTitle: '',
  };
}
