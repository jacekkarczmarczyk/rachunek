<template>
  <v-app>
    <v-main>
      <v-navigation-drawer>
        <v-list lines="two">
          <v-list-subheader>Sprzedawca</v-list-subheader>
          <v-list-item
            :subtitle="seller.taxId || 'Nie podano nru NIP'"
            :title="seller.company || 'Nie podano firmy'"
          >
            <template #append>
              <v-icon
                color="primary"
                @click="editSeller"
              >mdi-pencil</v-icon>
            </template>
          </v-list-item>
        </v-list>
        <v-divider />
        <v-list lines="two">
          <v-list-subheader>Klienci</v-list-subheader>
          <v-list-item
            v-for="company in companies"
            :key="company.taxId"
            :active="company.taxId === state.currentTaxId"
            color="primary"
            link
            :subtitle="company.taxId"
            :title="company.company"
            @click="setCurrentCompanyTaxId(company.taxId)"
          >
            <template #append>
              <v-icon
                color="warning"
                @click="deleteCompany(company)"
              >mdi-delete</v-icon>
              <v-icon
                color="primary"
                @click="editCompany(company)"
              >mdi-pencil</v-icon>
            </template>
          </v-list-item>
        </v-list>
        <div class="text-right">
          <v-btn
            class="ma-4"
            color="primary"
            variant="tonal"
            @click="addCompany"
          >
            <v-icon start>mdi-plus</v-icon>
            Dodaj firmę</v-btn>
        </div>
      </v-navigation-drawer>
      <v-container>
        <router-view />
      </v-container>
    </v-main>

    <v-footer app>
      <div class="text-grey">
        (C) {{ (new Date).getFullYear() }} Jacek Karczmarczyk,
        {{ new Date(Number(VITE_BUILD_TIME)).toLocaleDateString() }}
      </div>
    </v-footer>

    <v-dialog
      v-model="companyDialog"
      max-width="800"
      @keydown.esc="companyDialog = false"
    >
      <v-form
        v-if="companyFormData"
        @submit.prevent="saveCompany"
      >
        <v-card>
          <v-toolbar
            color="primary"
            dark
          ><v-toolbar-title>Nowa firma</v-toolbar-title></v-toolbar>
          <v-card-text>
            <company-fields
              ref="companyFields"
              v-model="companyFormData"
            />
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-spacer />
            <v-btn
              variant="text"
              @click="companyDialog = false"
            >Anuluj</v-btn>
            <v-btn
              color="primary"
              type="submit"
            >Zapisz</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-dialog
      v-model="sellerDialog"
      max-width="800"
      @keydown.esc="sellerDialog = false"
    >
      <v-form
        v-if="sellerFormData"
        @submit.prevent="saveSeller"
      >
        <v-card>
          <v-toolbar
            color="primary"
            dark
          ><v-toolbar-title>Dane sprzedawcy</v-toolbar-title></v-toolbar>
          <v-card-text>
            <seller-fields
              ref="sellerFields"
              v-model="sellerFormData"
            />
          </v-card-text>
          <v-card-actions class="pa-4">
            <v-spacer />
            <v-btn
              variant="text"
              @click="sellerDialog = false"
            >Anuluj</v-btn>
            <v-btn
              color="primary"
              type="submit"
            >Zapisz</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-app>
</template>

<script setup lang="ts">
import CompanyFields from '@/components/CompanyFields/CompanyFields.vue';
import SellerFields from '@/components/SellerFields/SellerFields.vue';
import type { Company } from '@/compsables/useState';
import { createCompany, useState, useStateInjectionKey } from '@/compsables/useState';
import { computed, provide, ref } from 'vue';
import { VITE_BUILD_TIME } from '@/env';

const State = useState();
const { MUTATE_ADD_COMPANY, MUTATE_REMOVE_COMPANY, MUTATE_SET_CURRENT_TAX_ID, MUTATE_SET_SELLER, state } = State;
const companyDialog = ref(false);
const sellerDialog = ref(false);
const companyFormData = ref<Company>();
const sellerFormData = ref<Company>();
const companies = computed(() => state.value.companies as { [taxId: string]: Company });
const seller = computed(() => state.value.seller);

provide(useStateInjectionKey, State);

function addCompany () {
  companyFormData.value = createCompany();
  companyDialog.value = true;
  // this.$nextTick(() => this.$refs.companyFields.refresh());
}

function editCompany (company: Company) {
  companyFormData.value = { ...company };
  companyDialog.value = true;
  // this.$nextTick(() => this.$refs.companyFields.refresh());
}

function editSeller () {
  sellerFormData.value = state.value.seller;
  sellerDialog.value = true;
  // this.$nextTick(() => this.$refs.sellerFields.refresh());
}

function deleteCompany (company: Company) {
  if (confirm(`Usunąć firmę "${company.company}"?`)) {
    MUTATE_REMOVE_COMPANY(company.taxId);
  }
}

function saveCompany () {
  if (!companyFormData.value?.taxId || !companyFormData.value?.company) {
    alert('Proszę podać NIP i nazwę firmy');

    return;
  }
  MUTATE_ADD_COMPANY(companyFormData.value);
  companyDialog.value = false;
}

function saveSeller () {
  if (!sellerFormData.value?.taxId || !sellerFormData.value?.company) {
    alert('Proszę podać NIP i nazwę firmy');

    return;
  }
  MUTATE_SET_SELLER(sellerFormData.value);
  sellerDialog.value = false;
}

function setCurrentCompanyTaxId (taxId: string) {
  MUTATE_SET_CURRENT_TAX_ID(taxId);
}
</script>
