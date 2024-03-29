<template>
  <v-card>
    <v-card-text class="pa-4">
      <div class="text-right"><small>{{ seller.city }}, {{ intlDate.format(new Date(issueDate)) }}</small></div>
      <div class="text-right"><small>Data sprzedaży, {{ intlDate.format(new Date(invoiceDate)) }}</small></div>
      <div
        class="mb-12 text-center"
        style="margin-top: -2rem"
      >
        <div>Rachunek</div>
        <div class="text-h5">{{ new Date(invoiceDate).getFullYear() }}/{{ (1 + new Date(invoiceDate).getMonth()).toString().padStart(2, '0') }}/{{ invoiceNo.toString().padStart(2, '0') }}</div>
        <div class="subheading">Oryginał</div>
      </div>

      <v-table class="mb-12">
        <thead>
          <tr>
            <th
              class="text-left"
              style="width: 50%"
            >Sprzedawca</th>
            <th
              class="text-left"
              colspan="2"
            >Nabywca</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="vertical-align: top">
              <div><strong>{{ seller.company }}</strong></div>
              <div>{{ seller.street }} {{ seller.house }} {{ seller.flat }}</div>
              <div>{{ seller.postalCode }} {{ seller.city }}</div>
              <div>{{ seller.country }}</div>
              <div>NIP: {{ seller.taxId }}</div>
            </td>
            <td
              colspan="2"
              style="vertical-align: top"
            >
              <div><strong>{{ company.company }}</strong></div>
              <div>{{ company.street }} {{ company.house }} {{ company.flat }}</div>
              <div>{{ company.postalCode }} {{ company.city }}</div>
              <div>{{ company.country }}</div>
              <div>NIP: {{ company.taxId }}</div>
            </td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th class="text-left">Rachunek bankowy</th>
            <th class="text-left">Sposób zapłaty</th>
            <th class="text-left">Termin płatności</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div>{{ seller.bankName }}</div>
              <div>{{ seller.bankAccount }}</div>
            </td>
            <td>Przelew</td>
            <td>14 dni</td>
          </tr>
        </tbody>
      </v-table>

      <v-table class="mb-12">
        <thead>
          <tr>
            <th>Nazwa towaru / usługi</th>
            <th>J.M.</th>
            <th>Ilość</th>
            <th>Cena jednostkowa</th>
            <th>Wartość</th>
          </tr>
        </thead>
        <tbody>

          <tr>
            <td style="vertical-align: middle">{{ company.serviceTitle }}</td>
            <td style="vertical-align: middle">szt.</td>
            <td style="vertical-align: middle">1</td>
            <td style="vertical-align: middle">{{ format(netInt) }}</td>
            <td style="vertical-align: middle">{{ format(netInt) }}</td>
          </tr>

        </tbody>
        <tbody>
          <tr>
            <th />
            <th />
            <th
              class="text-right"
              scope="row"
              style="vertical-align: middle"
            >Razem</th>
            <td style="vertical-align: middle">{{ format(netInt) }}</td>
            <td style="vertical-align: middle">{{ format(netInt) }}</td>
          </tr>
        </tbody>
      </v-table>

      <v-table class="mb-12">
        <tbody>
          <tr>
            <th
              scope="row"
              style="text-align: right"
            >Do zapłaty:</th>
            <td class="currency">{{ format(netInt) }}</td>
          </tr>
          <tr>
            <th
              scope="row"
              style="text-align: right"
            >Słownie:</th>
            <td>{{ number2words(netInt) }}</td>
          </tr>
        </tbody>
      </v-table>

      <div
        class="pt-12"
        style="display: flex; text-align: center; font-size: 0.8rem; justify-content: space-around"
      >
        <div
          class="px-4"
          style="width: 30%; border-top: 1px dotted #888"
        >
          <div>Podpis osoby upoważnionej do wystawienia faktury</div>
          <div class="text-body-2">{{ seller.name }}</div>
        </div>
        <div
          class="px-4"
          style="width: 30%; border-top: 1px dotted #888"
        >Podpis osoby upoważnionej do odbioru faktury</div>
      </div>

    </v-card-text>
    <v-card-actions class="justify-center pa-6">
      <v-btn
        class="print-button"
        color="primary"
        variant="tonal"
        @click="printInvoice"
      >
        <v-icon class="mr-4">mdi-printer</v-icon>Drukuj
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { Company } from '@/compsables/useState';
import { computed } from 'vue';
// @ts-expect-error missing types
import { Slownie } from 'slownie';

const props = defineProps<{
  seller: Company;
  company: Company;
  net: number;
  issueDate: string;
  invoiceDate: string;
  invoiceNo: number;
}>();
const intlDate = Intl.DateTimeFormat('pl-PL', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
const intlCurrency = Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
});
const netInt = computed(() => Math.round(100 * props.net));

function format (value: number) {
  return intlCurrency.format(value / 100);
}

function number2words (value: number) {
  if (!value) {
    return '-';
  }

  const slownie = new Slownie();
  const zl = `${slownie.get(Math.floor(value / 100))} zł`;
  const gr = (value % 100) ? (`, ${slownie.get(value % 100)} gr`) : '';

  return `${zl}${gr}`;
}

function printInvoice () {
  document.body.classList.add('print-invoice');
  setTimeout(() => {
    window.print();
    document.body.classList.remove('print-invoice');
  });
}
</script>

<style scoped>
thead th {
  background: rgba(0, 0, 0, 0.03);
  border-bottom: 1px solid #ccc;
  white-space: normal;
}
td, th {
  padding: 0.3rem 1rem !important;
  text-align: left;
  height: 40px;
}
tr:hover {
  background: none !important;
}
</style>

<style>
.print-invoice .application {
  background: none;
}

.print-invoice aside,
.print-invoice .v-tabs,
.print-invoice .print-button,
.print-invoice .v-navigation-drawer,
.print-invoice .v-footer {
  display: none !important;
}

.print-invoice .container,
.print-invoice .v-main {
  padding: 0 !important;
  max-width: none;
}

.print-invoice div {
  border: none;
  box-shadow: none;
}
</style>
