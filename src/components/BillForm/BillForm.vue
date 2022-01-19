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
                    :items="[{ text: 'Liniowa - 19%', value: 19.0}]"
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
                  v-clipboard:copy="B7.toFixed(2)"
                  v-clipboard:success="() => valueForMeCopied = true"
                  class="copy-to-clipboard text-h3"
                  :class="valueForMeCopied ? 'success--text' : ''"
                  xs8
                >
                  {{ format(B7) }}
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
import { useStateInjectionKey } from '@/compsables/useState';
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
const company = computed(() => state.companies[props.taxId]);
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
const E3 = computed(() => company.value?.zus ? ubezpieczenieSpoleczne.value : 0);
const F3 = computed(() => company.value?.zus ? ubezpieczenieZdrowotne.value : 0);
const E6 = computed(() => stawkaVat.value);
const B2 = computed(() => Math.ceil(B11.value));
const B3 = computed(() => B2.value - E3.value);
const B4 = computed(() => Math.round(B3.value * E6.value / 100 - F3.value));
const B5 = computed(() => B2.value - B4.value);
const B7 = computed(() => Math.max(0, B5.value - E3.value - F3.value));
const B10 = computed(() => valueForMe.value);
const B11 = computed(() => (((B10.value + ((100 - E6.value) * E3.value) / 100) * 100) / (100 - E6.value)));
const valueForMe = computed(() => {
  let hours = parseFloat((workingHours.value || '').replace(',', '.'));

  if (isNaN(hours) || hours < 0) {
    hours = 0;
  }

  return (company.value?.workingHourRate ?? 0) * hours;
});
const valueNet = computed(() => valueForMe.value > 0 ? B11.value : 0);

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
