<template>
  <v-app>
    <v-content>
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
                @click.stop="editSeller()"
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
            :class="{'grey lighten-2': company.taxId === $store.state.__global__.currentTaxId}"
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
                icon
                color="warning"
                text
                @click.stop="deleteCompany(company)"
              ><v-icon>mdi-delete</v-icon></v-btn>
            </v-list-item-action>
            <v-list-item-action>
              <v-btn
                icon
                color="primary"
                text
                @click.stop="editCompany(company)"
              ><v-icon>mdi-pencil</v-icon></v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <div class="text-xs-right">
          <v-btn
            color="primary"
            class="ma-3"
            @click="addCompany()"
          ><v-icon left>mdi-plus</v-icon>Dodaj firmę</v-btn>
        </div>
      </v-navigation-drawer>
      <v-container>
        <router-view ref="routerView" />
      </v-container>
    </v-content>
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
          <v-card-actions class="pa-3">
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
          <v-card-actions class="pa-3">
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

<script>
import CompanyFields from '@/components/CompanyFields/CompanyFields.vue';
import SellerFields from '@/components/SellerFields/SellerFields.vue';

export default {
  name: 'App',

  components: {
    CompanyFields,
    SellerFields,
  },

  data: () => ({
    companyDialog: false,
    sellerDialog: false,
    defaultCompanyFormData: {
      company: '',
      taxId: '',
      country: 'Polska',
      city: '',
      postalCode: '',
      street: '',
      house: '',
      flat: '',
      workingHourRate: '',
      zus: '',
    },
    defaultSellerFormData: {
      company: '',
      taxId: '',
      country: 'Polska',
      city: '',
      postalCode: '',
      street: '',
      house: '',
      flat: '',
      name: '',
      bankName: '',
      bankAccount: '',
    },
    companyFormData: null,
    sellerFormData: null,
  }),

  computed: {
    companies () {
      return this.$store.state.__global__.companies;
    },
    seller () {
      return this.$store.state.__global__.seller;
    },
  },

  methods: {
    addCompany () {
      this.companyFormData = Object.assign({}, this.defaultCompanyFormData);
      this.companyDialog = true;
      this.$nextTick(() => this.$refs.companyFields.refresh());
    },
    editCompany (company) {
      this.companyFormData = Object.assign({}, company);
      this.companyDialog = true;
      this.$nextTick(() => this.$refs.companyFields.refresh());
    },
    editSeller () {
      this.sellerFormData = Object.assign({}, this.seller);
      this.sellerDialog = true;
      this.$nextTick(() => this.$refs.sellerFields.refresh());
    },
    deleteCompany (company) {
      if (confirm(`Usunąć firmę "${company.company}"?`)) {
        this.$store.commit('__global__/MUTATE_REMOVE_COMPANY', company.taxId);
      }
    },
    saveCompany () {
      if (!this.companyFormData.taxId || !this.companyFormData.company) {
        alert('Proszę podać NIP i nazwę firmy');
        return;
      }
      this.$store.commit('__global__/MUTATE_ADD_COMPANY', this.companyFormData);
      this.companyDialog = false;
    },
    saveSeller () {
      if (!this.sellerFormData.taxId || !this.sellerFormData.company) {
        alert('Proszę podać NIP i nazwę firmy');
        return;
      }
      this.$store.commit('__global__/MUTATE_SET_SELLER', this.sellerFormData);
      this.sellerDialog = false;
    },
    setCurrentCompanyTaxId (taxId) {
      this.$store.commit('__global__/MUTATE_SET_CURRENT_TAX_ID', taxId);
    },
  },
};
</script>
