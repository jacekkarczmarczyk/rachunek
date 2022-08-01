import type { InjectionKey } from 'vue';
import { useLocalStorage } from '@vueuse/core';
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
  const state = useLocalStorage('rachunek', {
    settings: {
      tax: {
        ubezpieczenieSpoleczne: 0,
        ubezpieczenieZdrowotne: 0,
        stawkaVat: 12.0,
      },
    },
    companies: {} as { [taxId in string]?: Company },
    seller: createCompany(),
    currentTaxId: '',
  });
  const MUTATE_TAX_SETTINGS = (settings: typeof state.value.settings.tax) => {
    (Object.keys(state.value.settings.tax) as (keyof typeof state.value.settings.tax)[]).forEach(setting => {
      if (setting in settings) {
        state.value.settings.tax[setting] = settings[setting];
      }
    });
  };
  const MUTATE_ADD_COMPANY = (company: Company) => Vue.set(state.value.companies, company.taxId, { ...company });
  const MUTATE_SET_CURRENT_TAX_ID = (taxId: string) => (state.value.currentTaxId = taxId);
  const MUTATE_REMOVE_COMPANY = (taxId: string) => Vue.delete(state.value.companies, taxId);
  const MUTATE_SET_SELLER = (seller: Company) => (state.value.seller = { ...seller });

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
