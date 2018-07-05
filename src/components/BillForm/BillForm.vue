<template>
  <v-card>
    <v-toolbar color="primary" flat dark>
      <v-toolbar-title><template v-if="company">{{ company.company }}</template></v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <form @submit.prevent>
        <v-container grid-list-xl>
          <v-layout row wrap>
            <v-flex xs12 sm4>
              <v-select type="number" label="Stawka VAT" :items="[{ text: 'Liniowa - 19%', value: 19.0}]" v-model="stawkaVat" />
            </v-flex>
            <v-flex xs12 sm4>
              <v-text-field v-if="company.zus" type="number" label="Ubezpieczenie społeczne" v-model="ubezpieczenieSpoleczne" />
            </v-flex>
            <v-flex xs12 sm4>
              <v-text-field v-if="company.zus" type="number" label="Ubezpieczenie zdrowotne" v-model="ubezpieczenieZdrowotne" />
            </v-flex>
            <v-flex xs8>
              <v-text-field box min="0" autofocusbox type="number" label="Godziny robocze" v-model="workingHours" />
            </v-flex>
            <v-flex xs4>
              <v-text-field disabled autofocusbox type="number" label="Stawka godzinowa" :value="company.workingHourRate" />
            </v-flex>
          </v-layout>
        </v-container>

        <v-container grid-list-xl>
          <v-layout row wrap align-center>
            <v-flex xs4 class="headline text-xs-right">
              Kwota na rękę:
            </v-flex>
            <v-flex 
              xs8 
              class="display-2 copy-to-clipboard"
              :class="valueForMeCopied ? 'success--text' : ''"
              v-clipboard:copy="B8.toFixed(2)"
              v-clipboard:success="() => valueForMeCopied = true"
            >
              {{ format(B8) }}
            </v-flex>
            <v-flex xs4 class="headline text-xs-right">
              Kwota na fakturze netto:
            </v-flex>
            <v-flex 
              xs8 
              class="display-2 copy-to-clipboard"
              :class="valueNetCopied ? 'success--text' : ''"
              v-clipboard:copy="valueNet.toFixed(2)"
              v-clipboard:success="() => valueNetCopied = true"
            >
              {{ format(valueNet) }}
            </v-flex>
          </v-layout>
        </v-container>
      </form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'bill-form',

  props: {
    taxId: String,
  },

  data: () => ({
    workingHours: null,
    valueForMeCopied: false,
    valueNetCopied: false,
  }),

  computed: {
    company () {
      return this.$store.state.__global__.companies[this.taxId]
    },
    taxSettings () {
      return this.$store.state.__global__.settings.tax
    },
    ubezpieczenieSpoleczne: {
      get () {
        return this.taxSettings.ubezpieczenieSpoleczne
      },
      set (v) {
        this.$store.commit('__global__/MUTATE_TAX_SETTINGS', Object.assign({}, this.taxSettings, {
          ubezpieczenieSpoleczne: parseFloat(v),
        }))
      },
    },
    ubezpieczenieZdrowotne: {
      get () {
        return this.taxSettings.ubezpieczenieZdrowotne
      },
      set (v) {
        this.$store.commit('__global__/MUTATE_TAX_SETTINGS', Object.assign({}, this.taxSettings, {
          ubezpieczenieZdrowotne: parseFloat(v),
        }))
      },
    },
    stawkaVat: {
      get () {
        return this.taxSettings.stawkaVat
      },
      set (v) {
        this.$store.commit('__global__/MUTATE_TAX_SETTINGS', Object.assign({}, this.taxSettings, {
          stawkaVat: parseFloat(v),
        }))
      },
    },
    E4 () {
      return this.company.zus ? this.ubezpieczenieSpoleczne : 0
    },
    F4 () {
      return this.company.zus ? this.ubezpieczenieZdrowotne : 0
    },
    B11 () {
      return this.valueForMe
    },
    E7 () {
      return this.stawkaVat
    },
    B12 () {
      return (((this.B11 + (81 * this.E4) / 100) * 100) / 81)
    },
    B3 () {
      return Math.round(this.B12)
    },
    B4 () {
      return this.B3 - this.E4
    },
    B5 () {
      return Math.round(this.B4 * this.E7 / 100 - this.F4)
    },
    B6 () {
      return this.B3 - this.B5
    },
    B8 () {
      return Math.max(0, this.B6 - this.E4 - this.F4)
    },
    valueForMe () {
      return this.company.workingHourRate * Math.max(0, (this.workingHours >> 0))
    },
    valueNet () {
      return this.valueForMe > 0 ? this.B12 : 0
    },
  },

  watch: {
    valueForMe () {
      this.valueForMeCopied = false
    },
    valueNet () {
      this.valueNetCopied = false
    },
  },

  methods: {
    format (value) {
      return Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
      }).format(value)
    },
  },
}
</script>

<style scoped>
.copy-to-clipboard {
  cursor: pointer
}
</style>