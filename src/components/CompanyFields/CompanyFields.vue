<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="modelValue.taxId"
          append-icon="mdi-download"
          autofocus
          hide-details
          label="NIP"
          @click:append="fetchCompanyData"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="modelValue.company"
          hide-details
          label="Firma"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <v-text-field
          v-model="modelValue.country"
          hide-details
          label="Państwo"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <v-text-field
          v-model="modelValue.city"
          hide-details
          label="Miasto"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <v-text-field
          v-model="modelValue.postalCode"
          hide-details
          label="Kod pocztowy"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >

        <v-text-field
          v-model="modelValue.street"
          hide-details
          label="Ulica"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <v-text-field
          v-model="modelValue.house"
          hide-details
          label="Numer domu"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <v-text-field
          v-model="modelValue.flat"
          hide-details
          label="Numer lokalu"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <v-text-field
          v-model="modelValue.workingHourRate"
          hide-details
          label="Stawka godzinowa"
          suffix="PLN"
          type="number"
          variant="filled"
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
      >
        <v-text-field
          v-model="modelValue.invoiceHourRate"
          hide-details
          label="Stawka na fakturze"
          suffix="PLN"
          type="number"
          variant="filled"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="modelValue.serviceTitle"
          hide-details
          label="Nazwa usługi"
          variant="filled"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import type { Company } from '@/compsables/useState';
import { ref } from 'vue';
import axios from 'axios';

const props = defineProps<{
  modelValue: Company;
}>();
const emit = defineEmits<{
  (name: 'input', value: Company): void;
}>();
const internalValue = ref({ ...props.modelValue }); // eslint-disable-line vue/no-setup-props-destructure

async function fetchCompanyData () {
  const taxId = props.modelValue.taxId.replace(/[^0-9]/, '');
  const data = await axios.get(`https://api-v3.mojepanstwo.pl/dane/krs_podmioty.json?conditions[krs_podmioty.nip]=${taxId}`);
  const item = data?.data?.Dataobject?.[0]?.data ?? null;

  if (!item) {
    alert('Nie znaleziono firmy');
  } else {
    const newData = Object.assign({}, internalValue.value, {
      taxId,
      company: item['krs_podmioty.nazwa'],
      country: item['krs_podmioty.adres_kraj'],
      city: item['krs_podmioty.adres_miejscowosc'],
      postalCode: item['krs_podmioty.adres_kod_pocztowy'],
      street: item['krs_podmioty.adres_ulica'],
      house: item['krs_podmioty.adres_numer'],
      flat: item['krs_podmioty.adres_lokal'],
    });

    emit('input', newData);
  }
}
</script>
