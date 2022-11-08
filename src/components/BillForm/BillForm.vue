<template>
  <div>
    <v-tabs v-model="tab">
      <v-tab value="tab-1">Formularz</v-tab>
      <v-tab value="tab-2">Faktura</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item value="tab-1">
        <v-card>
          <v-card-text>
            <form @submit.prevent>
              <v-container>
                <v-row wrap>
                  <v-col
                    cols="12"
                    sm="4"
                  >
                    <v-select
                      v-model="stawkaVat"
                      disabled
                      :items="[{ title: 'Liniowa - 19%', value: 19.0}, { title: 'Ryczałt (polski wał) - 12%', value: 12.0}]"
                      label="Stawka VAT"
                      type="number"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    sm="4"
                  >
                    <v-text-field
                      v-model="ubezpieczenieSpoleczne"
                      disabled
                      label="Ubezpieczenie społeczne"
                      placeholder="1211,29 zł"
                      type="number"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    sm="4"
                  >
                    <v-text-field
                      v-model="ubezpieczenieZdrowotne"
                      disabled
                      label="Ubezpieczenie zdrowotne"
                      placeholder="511 zł"
                      type="number"
                    />
                  </v-col>

                  <v-col
                    cols="12"
                    sm="4"
                  >
                    <v-text-field
                      v-model="invoiceDate"
                      label="Data sprzedaży"
                      type="date"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    sm="4"
                  >
                    <v-text-field
                      v-model="issueDate"
                      label="Data wystawienia faktury"
                      type="date"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    sm="4"
                  >
                    <v-text-field
                      v-model="invoiceNo"
                      label="Nr porządkowy faktury"
                      type="number"
                    />
                  </v-col>

                  <v-col cols="8">
                    <v-text-field
                      v-model="workingHours"
                      autofocus
                      label="Godziny robocze"
                      min="0"
                      type="number"
                      variant="filled"
                    />
                  </v-col>
                  <v-col cols="4">
                    <v-text-field
                      disabled
                      label="Stawka godzinowa"
                      :model-value="company.workingHourRate"
                      type="number"
                    />
                  </v-col>
                </v-row>
              </v-container>

              <v-container>
                <v-row align="center">
                  <v-col
                    class="text-h5 text-right"
                    cols="4"
                  >
                    Kwota na rękę:
                  </v-col>
                  <v-col
                    class="copy-to-clipboard text-h3"
                    :class="valueForMeCopied ? 'text-success' : ''"
                    cols="8"
                    @click="copyValueForMe(valueForMe.toFixed(2))"
                  >
                    {{ format(valueForMe) }}
                  </v-col>
                  <v-col
                    class="text-h5 text-right"
                    cols="4"
                  >
                    Kwota na fakturze netto:
                  </v-col>
                  <v-col
                    class="copy-to-clipboard text-h3"
                    :class="invoiceValueCopied ? 'text-success' : ''"
                    cols="8"
                    @click="copyInvoiceValue(invoiceValue.toFixed(2))"
                  >
                    {{ format(invoiceValue) }}
                  </v-col>
                </v-row>
              </v-container>
            </form>
          </v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item value="tab-2">
        <invoice-preview
          :company="company"
          :invoice-date="invoiceDate"
          :invoice-no="invoiceNo"
          :issue-date="issueDate"
          :net="invoiceValue"
          :seller="seller"
        />
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
import InvoicePreview from '@/components/Invoice/InvoicePreview.vue';
import { createCompany, useStateInjectionKey } from '@/compsables/useState';
import { useClipboard } from '@vueuse/core';
import { computed, inject, ref } from 'vue';

const props = defineProps<{
  taxId?: string;
}>();
const { MUTATE_TAX_SETTINGS, state } = inject(useStateInjectionKey)!;
const tab = ref('');
const workingHours = ref(null);
const invoiceNo = ref(1);
const invoiceDate = ref(new Date().toISOString().substr(0, 10));
const issueDate = ref(new Date().toISOString().substr(0, 10));
const company = computed(() => state.value.companies[props.taxId ?? ''] ?? createCompany());
const taxSettings = computed(() => state.value.settings.tax);
const seller = computed(() => state.value.seller);
const ubezpieczenieSpoleczne = computed({
  get (): number {
    return 1211.29; // taxSettings.value.ubezpieczenieSpoleczne;
  },
  set (v: number) {
    updateTaxSettings({
      ubezpieczenieSpoleczne: parseFloat(String(v)),
    });
  },
});
const ubezpieczenieZdrowotne = computed({
  get (): number {
    return 511; // taxSettings.value.ubezpieczenieZdrowotne;
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
const zusScale = computed(() => (company.value?.zus ? 2 : 1) / 2);
const HOURS_IN_MONTH = 168;
const ubezpieczenieSpoleczneScaled = computed(() => ubezpieczenieSpoleczne.value * hours.value / HOURS_IN_MONTH);
const ubezpieczenieZdrowotneScaled = computed(() => ubezpieczenieZdrowotne.value * zusScale.value * hours.value / HOURS_IN_MONTH);
const vatRate = computed(() => stawkaVat.value / 100);
const invoiceValue = computed(() => (valueForMe.value + ubezpieczenieSpoleczneScaled.value * (1 - vatRate.value) + ubezpieczenieZdrowotneScaled.value) / (1 - vatRate.value));

function format (value: number) {
  return Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(value);
}

function updateTaxSettings (settings: any) {
  MUTATE_TAX_SETTINGS(Object.assign({}, taxSettings.value, settings));
}

const { copied: valueForMeCopied, copy: copyValueForMe } = useClipboard();
const { copied: invoiceValueCopied, copy: copyInvoiceValue } = useClipboard();

</script>

<style scoped>
.copy-to-clipboard {
  cursor: pointer
}
</style>
