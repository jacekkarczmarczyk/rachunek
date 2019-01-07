<template>
  <bill-form :tax-id="taxId"></bill-form>
</template>

<script>
import BillForm from '@/components/BillForm/BillForm.vue';

export default {
  name: 'BillFormView',

  components: {
    BillForm,
  },

  data: () => ({
  }),

  computed: {
    taxId() {
      return this.$store.state.__global__.currentTaxId;
    },
  },
};
</script>
