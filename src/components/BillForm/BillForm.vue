<template>
  <v-tabs>
    <v-tab>Formularz</v-tab>
    <v-tab>Faktura</v-tab>

    <v-tab-item>
      <v-card>
        <v-card-text>
          <form @submit.prevent>
            <v-container grid-list-xl>
              <v-layout wrap>
                <v-flex
                  sm4
                  xs12
                >
                  <v-select
                    v-model="stawkaVat"
                    :items="[{ text: 'Liniowa - 19%', value: 19.0}, { text: 'Ryczałt (polski wał) - 12%', value: 12.0}]"
                    label="Stawka VAT"
                    type="number"
                  />
                </v-flex>
                <v-flex
                  sm4
                  xs12
                >
                  <v-text-field
                    v-if="company.zus"
                    v-model="ubezpieczenieSpoleczne"
                    label="Ubezpieczenie społeczne"
                    placeholder="227,69 zł"
                    type="number"
                  />
                </v-flex>
                <v-flex
                  sm4
                  xs12
                >
                  <v-text-field
                    v-if="company.zus"
                    v-model="ubezpieczenieZdrowotne"
                    label="Ubezpieczenie zdrowotne"
                    placeholder="362,34 zł"
                    type="number"
                  />
                </v-flex>

                <v-flex
                  sm4
                  xs12
                >
                  <v-text-field
                    v-model="invoiceDate"
                    label="Data sprzedaży"
                    type="date"
                  />
                </v-flex>
                <v-flex
                  sm4
                  xs12
                >
                  <v-text-field
                    v-model="issueDate"
                    label="Data wystawienia faktury"
                    type="date"
                  />
                </v-flex>
                <v-flex
                  sm4
                  xs12
                >
                  <v-text-field
                    v-model="invoiceNo"
                    label="Nr porządkowy faktury"
                    type="number"
                  />
                </v-flex>

                <v-flex xs8>
                  <v-text-field
                    v-model="workingHours"
                    autofocusbox
                    filled
                    label="Godziny robocze"
                    min="0"
                    type="number"
                  />
                </v-flex>
                <v-flex xs4>
                  <v-text-field
                    autofocusbox
                    disabled
                    label="Stawka godzinowa"
                    type="number"
                    :value="company.workingHourRate"
                  />
                </v-flex>
              </v-layout>
            </v-container>

            <v-container grid-list-xl>
              <v-layout
                align-center
                wrap
              >
                <v-flex
                  class="text-h5 text-right"
                  xs4
                >
                  Kwota na rękę:
                </v-flex>
                <v-flex
                  v-clipboard:copy="valueForMe.toFixed(2)"
                  v-clipboard:success="() => valueForMeCopied = true"
                  class="copy-to-clipboard text-h3"
                  :class="valueForMeCopied ? 'success--text' : ''"
                  xs8
                >
                  {{ format(valueForMe) }}
                </v-flex>
                <v-flex
                  class="text-h5 text-right"
                  xs4
                >
                  Kwota na fakturze netto:
                </v-flex>
                <v-flex
                  v-clipboard:copy="valueNet.toFixed(2)"
                  v-clipboard:success="() => valueNetCopied = true"
                  class="copy-to-clipboard text-h3"
                  :class="valueNetCopied ? 'success--text' : ''"
                  xs8
                >
                  {{ format(valueNet) }}
                </v-flex>
              </v-layout>
            </v-container>
          </form>
        </v-card-text>
      </v-card>

    </v-tab-item>
    <v-tab-item>
      <invoice
        :company="company"
        :invoice-date="invoiceDate"
        :invoice-no="invoiceNo"
        :issue-date="issueDate"
        :net="valueNet"
        :seller="seller"
      />
    </v-tab-item>
  </v-tabs>

</template>

<script setup lang="ts">
/* global defineProps */
import Invoice from '@/components/Invoice/Invoice.vue';
import { createCompany, useStateInjectionKey } from '@/compsables/useState';
import { computed, inject, ref, watch } from '@vue/composition-api';

const props = defineProps<{
  taxId?: string;
}>();
const { MUTATE_TAX_SETTINGS, state } = inject(useStateInjectionKey)!;
const workingHours = ref(null);
const valueForMeCopied = ref(false);
const valueNetCopied = ref(false);
const invoiceNo = ref(1);
const invoiceDate = ref(new Date().toISOString().substr(0, 10));
const issueDate = ref(new Date().toISOString().substr(0, 10));
const company = computed(() => state.companies[props.taxId ?? ''] ?? createCompany());
const taxSettings = computed(() => state.settings.tax);
const seller = computed(() => state.seller);
const ubezpieczenieSpoleczne = computed({
  get (): number {
    return taxSettings.value.ubezpieczenieSpoleczne;
  },
  set (v: number) {
    updateTaxSettings({
      ubezpieczenieSpoleczne: parseFloat(String(v)),
    });
  },
});
const ubezpieczenieZdrowotne = computed({
  get (): number {
    return taxSettings.value.ubezpieczenieZdrowotne;
  },
  set (v: number) {
    updateTaxSettings({
      ubezpieczenieZdrowotne: parseFloat(String(v)),
    });
  },
});
const stawkaVat = computed({
  get (): number {
    return taxSettings.value.stawkaVat;
  },
  set (v: number) {
    updateTaxSettings({
      stawkaVat: parseFloat(String(v)),
    });
  },
});
const hours = computed(() => {
  const val = parseFloat((workingHours.value || '').replace(',', '.'));

  return (isNaN(val) || val < 0) ? 0 : val;
});
const valueForMe = computed(() => (company.value?.workingHourRate ?? 0) * hours.value);
const valueNet = computed(() => (valueForMe.value + (ubezpieczenieSpoleczne.value + ubezpieczenieZdrowotne.value) * hours.value / 160) / 0.88);

watch(valueForMe, () => (valueForMeCopied.value = false));
watch(valueNet, () => (valueNetCopied.value = false));

function format (value: number) {
  return Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(value);
}

function updateTaxSettings (settings: any) {
  MUTATE_TAX_SETTINGS(Object.assign({}, taxSettings.value, settings));
}
</script>

<style scoped>
.copy-to-clipboard {
  cursor: pointer
}
</style>
