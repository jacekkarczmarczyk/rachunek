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
            <v-flex xs12 sm6>
                <v-text-field box type="number" suffix="PLN" hide-details v-model="value.workingHourRate" label="Stawka godzinowa" />
            </v-flex>
            <v-flex xs12 sm6>
                <v-checkbox hide-details v-model="value.zus" label="Opłacanie ZUS" />
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
export default {
  name: 'company-fields',

  props: {
    value: {
      type: Object,
      required: true,
      validator: v => ['company', 'taxId', 'country', 'city', 'postalCode', 'street', 'house', 'flat', 'workingHourRate', 'zus'].every(key => (key in v)),
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
    fetchCompanyData () {
      alert('Not implemented yet')
    },

  },
}
</script>





