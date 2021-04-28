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

<script>
import Invoice from '@/components/Invoice/Invoice.vue';

export default {
  name: 'BillForm',

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
    company () {
      return this.$store.state.__global__.companies[this.taxId];
    },
    taxSettings () {
      return this.$store.state.__global__.settings.tax;
    },
    seller () {
      return this.$store.state.__global__.seller;
    },
    ubezpieczenieSpoleczne: {
      get () {
        return this.taxSettings.ubezpieczenieSpoleczne;
      },
      set (v) {
        this.updateTaxSettings({
          ubezpieczenieSpoleczne: parseFloat(v),
        });
      },
    },
    ubezpieczenieZdrowotne: {
      get () {
        return this.taxSettings.ubezpieczenieZdrowotne;
      },
      set (v) {
        this.updateTaxSettings({
          ubezpieczenieZdrowotne: parseFloat(v),
        });
      },
    },
    stawkaVat: {
      get () {
        return this.taxSettings.stawkaVat;
      },
      set (v) {
        this.updateTaxSettings({
          stawkaVat: parseFloat(v),
        });
      },
    },
    E3 () {
      return this.company.zus ? this.ubezpieczenieSpoleczne : 0;
    },
    F3 () {
      return this.company.zus ? this.ubezpieczenieZdrowotne : 0;
    },
    E6 () {
      return this.stawkaVat;
    },
    B2 () {
      return Math.ceil(this.B11);
    },
    B3 () {
      return this.B2 - this.E3;
    },
    B4 () {
      return Math.round(this.B3 * this.E6 / 100 - this.F3);
    },
    B5 () {
      return this.B2 - this.B4;
    },
    B7 () {
      return Math.max(0, this.B5 - this.E3 - this.F3);
    },
    B10 () {
      return this.valueForMe;
    },
    B11 () {
      return (((this.B10 + ((100 - this.E6) * this.E3) / 100) * 100) / (100 - this.E6));
    },
    valueForMe () {
      let hours = parseFloat((this.workingHours || '').replace(',', '.'));

      if (isNaN(hours) || hours < 0) {
        hours = 0;
      }

      return this.company.workingHourRate * hours;
    },
    valueNet () {
      return this.valueForMe > 0 ? this.B11 : 0;
    },
  },

  watch: {
    valueForMe () {
      this.valueForMeCopied = false;
    },
    valueNet () {
      this.valueNetCopied = false;
    },
  },

  methods: {
    format (value) {
      return Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
      }).format(value);
    },
    updateTaxSettings (settings) {
      this.$store.commit('__global__/MUTATE_TAX_SETTINGS', Object.assign({}, this.taxSettings, settings));
    },
  },
};
</script>

<style scoped>
.copy-to-clipboard {
  cursor: pointer
}
</style>
