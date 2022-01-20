<template>
  <v-app>
    <v-main>
      <v-navigation-drawer
        app
        disable-route-watcher
        permanent
      >
        <v-subheader>
          Sprzedawca
        </v-subheader>
        <v-list two-line>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                {{ seller.company || 'Nie podano firmy' }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ seller.taxId || 'Nie podano nru NIP' }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                color="primary"
                icon
                text
                @click.stop="editSeller"
              ><v-icon>mdi-pencil</v-icon></v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-divider />
        <v-subheader>
          Klienci
        </v-subheader>
        <v-list two-line>
          <v-list-item
            v-for="company in companies"
            :key="company.taxId"
            :class="{'grey lighten-2': company.taxId === state.currentTaxId}"
            @click="setCurrentCompanyTaxId(company.taxId)"
          >
            <v-list-item-content>
              <v-list-item-title>
                {{ company.company }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ company.taxId }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn
                color="warning"
                icon
                text
                @click.stop="deleteCompany(company)"
              ><v-icon>mdi-delete</v-icon></v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <v-btn
                color="primary"
                icon
                text
                @click.stop="editCompany(company)"
              ><v-icon>mdi-pencil</v-icon></v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <div class="text-right">
          <v-btn
            class="ma-4"
            color="primary"
            @click="addCompany"
          ><v-icon left>mdi-plus</v-icon>Dodaj firmę</v-btn>
        </div>
      </v-navigation-drawer>
      <v-container>
        <router-view ref="routerView" />
      </v-container>
    </v-main>
    <v-footer
      app
      style="background: rgba(0, 0, 0, 0.7)"
    >
      <div class="grey--text">(C) {{ (new Date).getFullYear() }} Jacek Karczmarczyk</div>
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
              text
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
              text
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
import { computed, provide, ref } from '@vue/composition-api';

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
