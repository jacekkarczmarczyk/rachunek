<template>
    <v-container grid-list-xl>
        <v-layout row wrap>
            <v-flex xs12>
                <v-text-field autofocus hide-details v-model="value.taxId" label="NIP" append-outer-icon="mdi-download" @click:append-outer="fetchCompanyData" />
            </v-flex>
            <v-flex xs12>
                <v-text-field hide-details v-model="value.company" label="Firma" />
            </v-flex>
            <v-flex xs12 sm6>
                <v-text-field hide-details v-model="value.country" label="Panstwo" />
            </v-flex>
            <v-flex xs12 sm6>
                <v-text-field hide-details v-model="value.city" label="Miasto" />
            </v-flex>
            <v-flex xs12 sm6>
                <v-text-field hide-details v-model="value.postalCode" label="Kod pocztowy" />
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field hide-details v-model="value.street" label="Ulica" />
            </v-flex>
            <v-flex xs12 sm6>
                <v-text-field hide-details v-model="value.house" label="Numer domu" />
            </v-flex>
            <v-flex xs12 sm6>
                <v-text-field hide-details v-model="value.flat" label="Numer lokalu" />
            </v-flex>
            <v-flex xs12>
                <v-text-field hide-details v-model="value.name" label="Imię i nazwisko" />
            </v-flex>
            <v-flex xs12>
                <v-text-field hide-details v-model="value.bankName" label="Nazwa banku" />
            </v-flex>
            <v-flex xs12>
                <v-text-field hide-details v-model="value.bankAccount" label="Numer konta" />
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'company-fields',

  props: {
    value: {
      type: Object,
      required: true,
    },
  },

  data: vm => ({
    internalValue: Object.assign({}, vm.value),
  }),

  watch: {
    value: {
      deep: true,
      handler (v) {
        // this.$emit('input', Object.assign({}, v))
      },
    },
  },

  methods: {
    refresh () {
      this.internalValue = Object.assign({}, this.value)
    },
    async fetchCompanyData () {
      const taxId = this.value.taxId.replace(/[^0-9]/, '')
      const data = await axios.get(`https://api-v3.mojepanstwo.pl/dane/krs_podmioty.json?conditions[krs_podmioty.nip]=${taxId}`)
      if (!data || !data.data || !data.data.Dataobject || !data.data.Dataobject.length) {
        alert('Nie znaleziono firmy')
        return
      }
      const item = data.data.Dataobject[0].data
      const newData = Object.assign({}, this.internalValue, {
        taxId,
        company: item['krs_podmioty.nazwa'],
        country: item['krs_podmioty.adres_kraj'],
        city: item['krs_podmioty.adres_miejscowosc'],
        postalCode: item['krs_podmioty.adres_kod_pocztowy'],
        street: item['krs_podmioty.adres_ulica'],
        house: item['krs_podmioty.adres_numer'],
        flat: item['krs_podmioty.adres_lokal'],
      })
      this.$emit('input', newData)
    },
  },
}
</script>





