<template>
  <v-tabs color="primary" dark slider-color="warning">
    <v-tab>
      Formularz
    </v-tab>
    <v-tab>
      Faktura
    </v-tab>

    <v-tabs-items>
      <v-tab-item>
        <v-card>
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

                  <v-flex xs12 sm4>
                    <v-text-field type="date" label="Data sprzedaży" v-model="invoiceDate" />
                  </v-flex>
                  <v-flex xs12 sm4>
                    <v-text-field type="date" label="Data wystawienia faktury" v-model="issueDate" />
                  </v-flex>
                  <v-flex xs12 sm4>
                    <v-text-field type="number" label="Nr porządkowy faktury" v-model="invoiceNo" />
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
                    v-clipboard:copy="B7.toFixed(2)"
                    v-clipboard:success="() => valueForMeCopied = true"
                  >
                    {{ format(B7) }}
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

      </v-tab-item>
      <v-tab-item>
        <invoice :company="company" :net="valueNet" :seller="seller" :invoice-date="invoiceDate" :issue-date="issueDate" :invoice-no="invoiceNo"></invoice>
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>

</template>

<script>
import Invoice from '@/components/Invoice/Invoice.vue';

export default {
  name: 'bill-form',

  components: {
    Invoice,
  },

  props: {
    taxId: String,
  },

  data: () => ({
    workingHours: null,
    valueForMeCopied: false,
    valueNetCopied: false,
    invoiceNo: 1,
    invoiceDate: new Date().toISOString().substr(0, 10),
    issueDate: new Date().toISOString().substr(0, 10),
  }),

  computed: {
    company() {
      return this.$store.state.__global__.companies[this.taxId];
    },
    taxSettings() {
      return this.$store.state.__global__.settings.tax;
    },
    seller() {
      return this.$store.state.__global__.seller;
    },
    ubezpieczenieSpoleczne: {
      get() {
        return this.taxSettings.ubezpieczenieSpoleczne;
      },
      set(v) {
        this.$store.commit('__global__/MUTATE_TAX_SETTINGS', Object.assign({}, this.taxSettings, {
          ubezpieczenieSpoleczne: parseFloat(v),
        }));
      },
    },
    ubezpieczenieZdrowotne: {
      get() {
        return this.taxSettings.ubezpieczenieZdrowotne;
      },
      set(v) {
        this.$store.commit('__global__/MUTATE_TAX_SETTINGS', Object.assign({}, this.taxSettings, {
          ubezpieczenieZdrowotne: parseFloat(v),
        }));
      },
    },
    stawkaVat: {
      get() {
        return this.taxSettings.stawkaVat;
      },
      set(v) {
        this.$store.commit('__global__/MUTATE_TAX_SETTINGS', Object.assign({}, this.taxSettings, {
          stawkaVat: parseFloat(v),
        }));
      },
    },
    E3() {
      return this.company.zus ? this.ubezpieczenieSpoleczne : 0;
    },
    F3() {
      return this.company.zus ? this.ubezpieczenieZdrowotne : 0;
    },
    E6() {
      return this.stawkaVat;
    },
    B2() {
      return Math.ceil(this.B11);
    },
    B3() {
      return this.B2 - this.E3;
    },
    B4() {
      return Math.round(this.B3 * this.E6 / 100 - this.F3);
    },
    B5() {
      return this.B2 - this.B4;
    },
    B7() {
      return Math.max(0, this.B5 - this.E3 - this.F3);
    },
    B10() {
      return this.valueForMe;
    },
    B11() {
      return (((this.B10 + ((100 - this.E6) * this.E3) / 100) * 100) / (100 - this.E6));
    },
    valueForMe() {
      let hours = parseFloat((this.workingHours || '').replace(',', '.'));
      if (isNaN(hours) || hours < 0) {
        hours = 0;
      }
      return this.company.workingHourRate * hours;
    },
    valueNet() {
      return this.valueForMe > 0 ? this.B11 : 0;
    },
  },

  watch: {
    valueForMe() {
      this.valueForMeCopied = false;
    },
    valueNet() {
      this.valueNetCopied = false;
    },
  },

  methods: {
    format(value) {
      return Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
      }).format(value);
    },
  },
};
</script>

<style scoped>
.copy-to-clipboard {
  cursor: pointer
}
</style>
