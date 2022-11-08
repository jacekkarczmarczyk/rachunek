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
      <v-col cols="12">
        <v-text-field
          v-model="modelValue.name"
          hide-details
          label="Imię i nazwisko"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="modelValue.bankName"
          hide-details
          label="Nazwa banku"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-model="modelValue.bankAccount"
          hide-details
          label="Numer konta"
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
const emit = defineEmits<{ // eslint-disable-line func-call-spacing
  (name: 'update:modelValue', value: Company): void;
}>();
const internalValue = ref({ ...props.modelValue });

async function fetchCompanyData () {
  const taxId = props.modelValue.taxId.replace(/[^0-9]/, '');
  const data = await axios.get(`https://api-v3.mojepanstwo.pl/dane/krs_podmioty.json?conditions[krs_podmioty.nip]=${taxId}`);

  if (!data || !data.data || !data.data.Dataobject || !data.data.Dataobject.length) {
    alert('Nie znaleziono firmy');

    return;
  }

  const item = data.data.Dataobject[0].data;
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

  emit('update:modelValue', newData);
}
</script>
