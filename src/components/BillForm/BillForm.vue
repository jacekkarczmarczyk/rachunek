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
const { state } = inject(useStateInjectionKey)!;
const tab = ref('');
const workingHours = ref(null);
const invoiceNo = ref(1);
const invoiceDate = ref(new Date().toISOString().substring(0, 10));
const issueDate = ref(new Date().toISOString().substring(0, 10));
const company = computed(() => state.value.companies[props.taxId ?? ''] ?? createCompany());
const seller = computed(() => state.value.seller);
const hours = computed(() => {
  const val = parseFloat((workingHours.value || '').replace(',', '.'));

  return (isNaN(val) || val < 0) ? 0 : val;
});
const valueForMe = computed(() => (company.value?.workingHourRate ?? 0) * hours.value);
const invoiceValue = computed(() => (company.value?.invoiceHourRate ?? 0) * hours.value);

function format (value: number) {
  return Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(value);
}

const { copied: valueForMeCopied, copy: copyValueForMe } = useClipboard();
const { copied: invoiceValueCopied, copy: copyInvoiceValue } = useClipboard();

</script>

<style scoped>
.copy-to-clipboard {
  cursor: pointer
}
</style>
