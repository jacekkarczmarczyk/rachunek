<template>
  <bill-form :tax-id="taxId"></bill-form>
</template>

<script>
import BillForm from '../components/BillForm/BillForm'

export default {
  name: 'bill-form-route',

  components: {
    BillForm,
  },

  data: () => ({
  }),

  computed: {
    taxId () {
      return this.$store.state.__global__.currentTaxId
    },
  },
}
</script>
