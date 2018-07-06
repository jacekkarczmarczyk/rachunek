<template>
<v-card>
    <v-card-text class="pa-4">
        <div class="mb-5">
            <div class="headline">Faktura nr XXX</div>
            <div>Warszawa, {{ (new Date).toISOString().substr(0, 10) }}</div>
        </div>


    <table class="v-table mb-5">
        <thead>
        <tr>
            <th class="text-xs-left" style="width: 50%">Sprzedawca</th>
            <th class="text-xs-left" colspan="2">Nabywca</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td><strong>{{ company.company }}, {{ company.taxId }}</strong><br>{{ company.street }} {{ company.house }} {{ company.flat }}<br>{{ company.postalCode }} {{ company.city }}<br>{{ company.country }}</td>
            <td colspan="2">
                <strong>Jacek Karczmarczyk, NIP</strong>
            </td>
        </tr>
        </tbody>
        <thead>
        <tr>
            <th class="text-xs-left">Rachunek bankowy</th>
            <th class="text-xs-left">Sposób zapłaty</th>
            <th class="text-xs-left">Termin płatności</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td class="ws-pre-line"></td>
            <td>Przelew</td>
            <td>14 dni</td>
        </tr>
        </tbody>
    </table>


    <table class="v-table mb-5">
        <thead>
        <tr>
            <th>Nazwa artykułu</th>
            <th>J.M.</th>
            <th>Ilość</th>
            <th>Cena jedn. netto</th>
            <th>Wartość netto</th>
            <th>Podatek (%)</th>
            <th>Podatek (kwota)</th>
            <th>Wartość z&nbsp;podatkiem</th>
        </tr>
        </thead>
        <tbody>

            <tr>
                <td>Usługa informatyczna</td>
                <td>szt.</td>
                <td>1</td>
                <td>{{ format(net) }}</td>
                <td>{{ format(net) }}</td>
                <td>23%</td>
                <td>{{ format(net * 0.23) }}</td>
                <td>{{ format(net * 1.23) }}</td>
            </tr>

        </tbody>
        <tbody>
        <tr>
            <th class="text-xs-right" style="vertical-align: top" scope="row" colspan="4">Razem</th>
            <td>{{ format(net) }}</td>
            <td></td>
            <td>{{ format(net * 0.23) }}</td>
            <td>{{ format(net * 1.23) }}</td>
        </tr>
        </tbody>
    </table>


    <table class="value">
        <tbody>
        <tr>
            <th scope="row" style="text-align: right">Do zapłaty:</th>
            <td class="currency">{{ format(net * 1.23) }}</td>
        </tr>
        <tr>
            <th scope="row" style="text-align: right">Słownie:</th>
            <td>{{ number2words(net * 1.23) }}</td>
        </tr>
        </tbody>
    </table>


    <div class="signature" style="margin: 4em 1em">
        <p style="font-style: italic">Dokument został wygenerowany automatycznie</p>
    </div>

    </v-card-text>
    <v-card-actions class="justify-center pa-4">
        <v-btn class="print-button" color="primary" @click="print"><v-icon class="mr-3">mdi-printer</v-icon>Drukuj</v-btn>
    </v-card-actions>
</v-card>
</template>

<script>
import { Slownie } from 'slownie'

export default {
  props: {
    company: null,
    net: null,
  },

  methods: {
    format (value) {
      return Intl.NumberFormat('pl-PL', {
        style: 'currency',
        currency: 'PLN',
      }).format(value)
    },

    number2words (value) {
      if (!value) {
        return ''
      }

      const [integer, fraction] = value.toString().split('.')
      const slownie = new Slownie()
      const fractionNormalized = Math.round(100 * ('0.' + ((fraction || 0) >> 0)))
      return slownie.get(Math.floor(integer)) + ' zł' + (fractionNormalized ? (', ' + slownie.get(fractionNormalized) + ' gr') : '')
    },

    print () {
      document.body.classList.add('print-invoice')
      print()
      document.body.classList.remove('print-invoice')
    },
  },
}
</script>

<style scoped>
thead th {
    background: rgba(0, 0, 0, 0.03);
    border-bottom: 1px solid #ccc;
}
td {
    vertical-align: top;
}
table.v-table thead th {
    vertical-align: bottom;
    white-space: normal;
}
td, th {
    padding: 0.3rem 1rem !important;
    text-align: left;
}
tr:hover {
    background: none !important;
}
</style>

<style>
@media print {
  .print-invoice .application {
    background: none;
  }

  .print-invoice aside,
  .print-invoice .v-tabs__bar,
  .print-invoice .print-button,
  .print-invoice .v-footer {
    display: none;
  }

  .print-invoice .container,
  .print-invoice .v-content {
    padding: 0 !important;
    max-width: none;
  }
}
</style>
