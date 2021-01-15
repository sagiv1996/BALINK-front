<template>
  <v-stepper v-model="steper">
    <v-stepper-header>
      <template v-for="(step, index, number) in $t('globalString')">
        <v-stepper-step
          :key="index"
          :step="number + 1"
          :complete="number < steper"
        >
          {{ step.title }}
          <small>
            {{ step.text }}
          </small>
        </v-stepper-step>
        <v-divider :key="index" v-if="number !== 2" />
      </template>
    </v-stepper-header>
    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card>
          <v-card-text>
            <v-form ref="formPersonal">
              <v-text-field
                :label="$t('form.personal.firstName')"
                v-model="personal.firstName"
                :rules="[emptyRules]"
                clearable
                counter
              ></v-text-field>
              <v-text-field
                :label="$t('form.personal.lastName')"
                v-model="personal.lastName"
                :rules="[emptyRules]"
                clearable
                counter
              ></v-text-field>
              <v-text-field
                :label="$t('form.personal.title')"
                v-model="personal.title"
                clearable
                counter
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn outlined disabled>
              {{ $t("button.back") }}
            </v-btn>
            <v-spacer />
            <v-btn
              color="primary"
              :disabled="
                emptyRules(personal.firstName) != true ||
                emptyRules(personal.lastName) != true
              "
              @click="next($refs.formPersonal)"
              outlined
            >
              {{ $t("button.next") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card>
          <v-card-text>
            <v-form ref="formAddres">
              <v-autocomplete
                :label="$t('form.address.country')"
                v-model="address.country"
                :rules="[emptyRules]"
                clearable
                counter
                :items="listCountries"
                menu-props="auto"
                @input="loadCitis"
              >
              </v-autocomplete>
              <v-autocomplete
                :disabled="!address.country"
                :label="$t('form.address.city')"
                v-model="address.city"
                clearable
                counter
                :loading="!listCitis[0] === null"
                :items="listCitis.data"
                item-text="city"
                menu-props="auto"
              ></v-autocomplete>

              <v-text-field
                :disabled="!address.city"
                :label="$t('form.address.street')"
                v-model="address.strret"
                clearable
                counter
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn outlined @click="steper--">
              {{ $t("button.back") }}
            </v-btn>

            <v-spacer />
            <v-btn
              color="primary"
              :disabled="emptyRules(address.country) != true"
              @click="next($refs.formAddres)"
              right
              outlined
            >
              {{ $t("button.next") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-stepper-content>
      <v-stepper-content step="3">
        <v-card>
          <v-card-text>
            <v-form ref="formContactability">
              <v-text-field
                :label="$t('form.contactability.email')"
                clearable
                counter
                v-model="contactability.email"
                :rules="[emptyRules, emailRules]"
              ></v-text-field>
              <v-text-field
                :label="$t('form.contactability.phone')"
                clearable
                counter
                v-model="contactability.phone"
                :rules="[emptyRules, phoneRules]"
              >
              </v-text-field>
              <v-checkbox
                v-model="contactability.optin"
                :label="$t('form.contactability.optin')"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn outlined @click="steper--">
              {{ $t("button.back") }}
            </v-btn>
            <v-spacer />
            <v-btn
              color="primary"
              @click="submit"
              right
              outlined
              :disabled="
                !contactability.optin ||
                (emptyRules(contactability.email) != true &&
                  emailRules(contactability.email) != true) ||
                (contactability.phone &&
                  phoneRules(contactability.phone) != true)
              "
            >
              {{ $t("button.next") }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>
<script>
export default {
  /*
    load the list countries from the back 
  */
  async asyncData({ $axios }) {
    const listCountries = await $axios.$get();
    return { listCountries };
  },
  data: () => ({
    listCitis: [],
    personal: {
      firstName: null,
      lastName: null,
      title: null,
    },
    address: {
      country: null,
      city: null,
      street: null,
    },
    contactability: {
      email: null,
      phone: null,
      optin: null,
    },
    steper: 1,
  }),
  methods: {
    /*
      this function get from and if him validate so stper go to next step
    */
    next(form) {
      if (form.validate()) this.steper++;
    },
    /*
      this func call after select country
      this func load list cities by country (exmple: israel: jerusalem, ashadod)
    */
    async loadCitis() {
      this.listCitis = await this.$axios.$post(
        "https://countriesnow.space/api/v0.1/countries/population/cities/filter",
        { country: this.address.country, order: "asc", orderBy: "name" }
      );
    },

    // show success messege
    async submit() {
      try {
        const resultAxios = await this.$axios.$post("", {
          personal: this.personal,
          address: this.address,
          contactability: this.contactability,
        });
        this.$swal(
          this.$t("alert.success.title"),
          this.$t("alert.success.text"),
          "success"
        );
      } catch (error) {
        this.$swal(
          this.$t("alert.error.title"),
          this.$t("alert.error.text"),
          "error"
        );
      }
    },
  },
  computed: {
    /*
      check the value is not empty
      return true // translite messege
    */
    emptyRules() {
      return (v) => !!v || this.$t("form.rules.empty");
    },

    /*
      check the value is good email
      return true // translite messege
    */
    emailRules() {
      return (v) =>
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
        this.$t("form.rules.email");
    },

    /*
      check the value is good phone
      return true // translite messege
    */
    phoneRules() {
      return (v) =>
        /^05\d([-]{0,1})\d{7}$/.test(v) || this.$t("form.rules.phone");
    },
  },
};
</script>