<template>
    <v-app>
        <v-content>
            <v-navigation-drawer app disable-route-watcher permanent>
                <v-subheader>
                    Firmy
                </v-subheader>
                <v-list>
                    <v-list-tile v-for="company in companies" :key="company.taxId" @click="setCurrentCompanyTaxId(company.taxId)" :class="{'grey lighten-4': company.taxId === $store.state.__global__.currentTaxId}">
                        <v-list-tile-content>
                            <v-list-tile-title>
                                {{ company.company }}
                            </v-list-tile-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <v-btn icon color="warning" flat @click="deleteCompany(company)"><v-icon>mdi-delete</v-icon></v-btn>
                        </v-list-tile-action>
                        <v-list-tile-action>
                            <v-btn icon color="primary" flat @click="editCompany(company)"><v-icon>mdi-pencil</v-icon></v-btn>
                        </v-list-tile-action>
                    </v-list-tile>
                </v-list>
                <div>
                    <v-btn slot="activator" color="primary" @click="addCompany()"><v-icon>add</v-icon>Dodaj firmę</v-btn>
                </div>
            </v-navigation-drawer>
            <v-container>
                <router-view ref="routerView"></router-view>
            </v-container>
        </v-content>
        <v-footer app fixed style="background: rgba(0, 0, 0, 0.7)">
            <div class="grey--text">(C) 2017 Jacek Karczmarczyk</div>
        </v-footer>

        <v-dialog max-width="800" v-model="companyDialog" @keydown.esc="companyDialog = false">
            <v-form v-if="companyFormData" @submit.prevent="saveCompany">
                <v-card>
                    <v-toolbar color="primary" dark><v-toolbar-title>Nowa firma</v-toolbar-title></v-toolbar>
                    <v-card-text>
                        <company-fields ref="companyFields" v-model="companyFormData" />
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn flat @click="companyDialog = false">Anuluj</v-btn>
                        <v-btn color="primary" type="submit">Zapisz</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
    </v-app>
</template>

<script>
import CompanyFields from './components/CompanyFields/CompanyFields'

export default {
  name: 'app',

  components: {
    CompanyFields,
  },

  data: () => ({
    companyDialog: false,
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
    companyFormData: null,
  }),

  computed: {
    companies () {
      return this.$store.state.__global__.companies
    },
  },

  methods: {
    addCompany () {
      this.companyFormData = Object.assign({}, this.defaultCompanyFormData)
      this.companyDialog = true
      this.$refs.companyFields.refresh()
    },
    editCompany (company) {
      this.companyFormData = Object.assign({}, company)
      this.companyDialog = true
      this.$refs.companyFields.refresh()
    },
    deleteCompany (company) {
      if (confirm(`Usunąć firmę "${company.company}"?`)) {
        this.$store.commit('__global__/MUTATE_REMOVE_COMPANY', company.taxId)
      }
    },
    saveCompany () {
      if (!this.companyFormData.taxId || !this.companyFormData.company) {
        alert('Proszę podać NIP i nazwę firmy')
        return
      }
      this.$store.commit('__global__/MUTATE_ADD_COMPANY', this.companyFormData)
      this.companyDialog = false
    },
    setCurrentCompanyTaxId (taxId) {
      this.$store.commit('__global__/MUTATE_SET_CURRENT_TAX_ID', taxId)
    },
  },
}
</script>
