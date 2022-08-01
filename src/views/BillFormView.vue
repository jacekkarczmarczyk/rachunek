<template>
  <bill-form :tax-id="state.currentTaxId" />
</template>

<script setup lang="ts">
import BillForm from '@/components/BillForm/BillForm.vue';
import { useStateInjectionKey } from '@/compsables/useState';
import { inject } from 'vue';

const { state } = inject(useStateInjectionKey)!;

</script>
