<template>
  <div id="warper">
    <div class="bars">
      <ul class="ul">
        <li :class="{ end: steper > 1, active: steper === 1 }">
          {{ $t("globalString.personal.title") }}
        </li>
        <li :class="{ end: steper > 2, active: steper === 2 }">
          {{ $t("globalString.address.title") }}
        </li>
        <li
          :class="{
            end: dialog === true,
            active: steper === 3 && dialog === false,
          }"
        >
          {{ $t("globalString.contactability.title") }}
        </li>
      </ul>
    </div>
    <transition-group name="next">
      <div id="step-1" v-if="steper === 1" key="1">
        <form>
          <fieldset>
            <legend>{{ $t("globalString.personal.text") }}</legend>
            <div class="grid">
              <div>
                <label for="firstName">{{
                  $t("form.personal.firstName")
                }}</label>
              </div>
              <div>
                <input
                  type="text"
                  id="firstName"
                  v-model="personal.firstName"
                  required
                  class="input"
                />
                <br />
                <small class="err">{{ emptyRules(personal.firstName) }}</small>
              </div>
              <div>
                <label for="lastName">{{ $t("form.personal.lastName") }}</label>
              </div>
              <div>
                <input
                  type="text"
                  id="lastName"
                  v-model="personal.lastName"
                  required
                  class="input"
                />
                <br />
                <small class="err">{{ emptyRules(personal.lastName) }}</small>
              </div>
              <div>
                <label for="title">{{ $t("form.personal.title") }}</label>
              </div>
              <div>
                <input id="title" v-model="personal.title" class="input" />
              </div>
            </div>
          </fieldset>
        </form>
        <div class="grid-button">
          <button class="button" disabled type="button">
            {{ $t("button.back") }}
          </button>
          <button
            type="button"
            class="button"
            :disabled="
              emptyRules(personal.firstName) || emptyRules(personal.lastName)
            "
            @click="steper++"
          >
            {{ $t("button.next") }}
          </button>
        </div>
      </div>
      <div id="step-2" v-else-if="steper === 2" key="2">
        <form>
          <fieldset>
            <legend>{{ $t("globalString.address.text") }}</legend>
            <div class="grid">
              <div>
                <label for="country">{{ $t("form.address.country") }}</label>
              </div>
              <div>
                <select
                  id="country"
                  v-model="address.country"
                  required
                  class="select"
                  @change="loadCitis"
                >
                  <option
                    v-for="item in listCountries"
                    :key="item"
                    v-text="item"
                    :value="item"
                  />
                </select>
                <br />
                <small class="err">{{ emptyRules(address.country) }}</small>
              </div>
              <div>
                <label for="city">{{ $t("form.address.city") }}</label>
              </div>
              <div>
                <select v-model="address.city" class="select">
                  <template v-if="listCitis != null">
                    <option
                      v-for="item in listCitis.data"
                      :key="item"
                      v-text="item.city"
                      :value="item"
                    />
                  </template>
                  <template v-else>
                    <option disabled>pleaz select country before city</option>
                  </template>
                </select>
              </div>
              <div>
                <label for="street">{{ $t("form.address.street") }}</label>
              </div>

              <div>
                <input id="street" v-model="address.street" class="input" />
              </div>
            </div>
          </fieldset>
          <div class="grid-button">
            <button class="button" @click="steper--" type="button">
              {{ $t("button.back") }}
            </button>
            <button
              type="button"
              class="button"
              :disabled="emptyRules(address.country)"
              @click="steper = 3"
            >
              {{ $t("button.next") }}
            </button>
          </div>
        </form>
      </div>
      <div id="step-3" v-else-if="steper === 3" key="3">
        <form>
          <fieldset>
            <legend>{{ $t("globalString.contactability.text") }}</legend>
            <div class="grid">
              <div>
                <label for="email">{{ $t("form.contactability.email") }}</label>
              </div>
              <div>
                <input
                  id="email"
                  v-model="contactability.email"
                  class="input"
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  required
                  type="email"
                /><br />
                <small class="err">{{
                  emptyRules(contactability.email)
                }}</small>
                <small
                  class="err"
                  v-show="
                    contactability.email &&
                    emailRules(contactability.email) != true
                  "
                  >{{ emailRules(contactability.email) }}</small
                >
              </div>
              <div>
                <label for="phone">{{ $t("form.contactability.phone") }}</label>
              </div>
              <div>
                <input
                  id="phone"
                  v-model="contactability.phone"
                  class="input"
                  pattern="^05\d([-]{0,1})\d{7}$"
                />
                <br />
                <small
                  class="err"
                  v-show="
                    contactability.phone &&
                    phoneRules(contactability.phone) != true
                  "
                  >{{ phoneRules(contactability.phone) }}</small
                >
              </div>
              <div>
                <label for="optin">{{ $t("form.contactability.optin") }}</label>
              </div>
              <div>
                <input
                  id="optin"
                  type="checkbox"
                  v-model="contactability.optin"
                  required
                />
                <small class="err">{{
                  emptyRules(contactability.optin)
                }}</small>
              </div>
            </div>
          </fieldset>
          <div class="grid-button">
            <button class="button" @click="steper--" type="button">
              {{ $t("button.back") }}
            </button>
            <button
              type="button"
              class="button"
              :disabled="
                emailRules(contactability.email) != true ||
                (contactability.phone &&
                  phoneRules(contactability.phone) != true) ||
                !contactability.optin
              "
              @click="submit"
            >
              {{ $t("button.next") }}
            </button>
          </div>
        </form>
      </div>
    </transition-group>
    <transition name="fade">
      <div class="modal" v-if="dialog">
        <h1>{{ $t("alert.success.title") }}</h1>
        <p class="modal-contant">
          {{ $t("alert.success.text") }}
        </p>
        <button
          class="button"
          style="width: 150px; margin: auto"
          @click="dialog = false"
        >
          {{ $t("button.close") }}
        </button>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  //load list countries from node.js
  async asyncData({ $axios }) {
    const listCountries = await $axios.$get("http://localhost:8080/api");
    return { listCountries };
  },
  data: () => ({
    dialog: false,
    listCitis: null,
    steper: 1,
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
      optin: false,
    },
  }),
  methods: {
    // submit form
    async submit() {
      try {
        const resultAxios = await this.$axios.$post("", {
          personal: this.personal,
          address: this.address,
          contactability: this.contactability,
        });
        this.dialog = true;
      } catch (error) {
        console.log(error);
      }
    },

    /*
      this func call after select country/
      this func load list cities by country (exmple: israel: jerusalem, ashadod)
    */
    async loadCitis() {
      this.listCitis = await this.$axios.$post(
        "https://countriesnow.space/api/v0.1/countries/population/cities/filter",
        { country: this.address.country, order: "asc", orderBy: "name" }
      );
    },
  },
  computed: {
    /*
      check the value is not empty
    */
    emptyRules() {
      return (v) => (!!v ? null : this.$t("form.rules.empty"));
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
      check the value is good number phone
      return true // translite messege
    */
    phoneRules() {
      return (v) =>
        /^05\d([-]{0,1})\d{7}$/.test(v) || this.$t("form.rules.phone");
    },
  },
};
</script>
<style lang="scss" scoped>
@keyframes next-div {
  from {
    margin-left: 100vw;
  }
  to {
    margin-left: none;
  }
}
@keyframes animaionBorder {
  0% {
    border-top-color: rgb(76, 199, 221);
  }
  33% {
    border-left-color: rgb(76, 199, 221);
  }
  66% {
    border-bottom-color: rgb(76, 199, 221);
  }
  100% {
    border-right-color: rgb(76, 199, 221);
  }
}
.next-enter-active {
  animation: next-div 0.5s;
}
.fade-enter-active {
  transition: opacity 0.7s;
}
.fade-leave-active {
  transition: opacity 0.7s;
}
.fade-enter {
  opacity: 0;
}
.fade-leave-to {
  opacity: 0;
}

.ul {
  display: grid;
  justify-content: space-between;
  grid-template-columns: auto auto auto;
  counter-reset: step;
  > li {
    list-style-type: none;
    &:before {
      content: counter(step);
      counter-increment: step;
      width: 50px;
      height: 50px;
      border: 2px solid #bebebe;
      display: block;
      margin: 0 auto 10px auto;
      border-radius: 50%;
      line-height: 50px;
      background: white;
      text-align: center;
      font-weight: bold;
    }
    &:after{
      content: '';
      height: 30px;
      width: 100vw;
    }
  }
  > li.active {
    &::before {
      animation: animaionBorder 2s infinite;
      background-color: rgb(12, 67, 184);
      color: rgb(235, 243, 240);
    }
  }
  > li.end {
    &::before {
      border: 3px solid rgb(36, 18, 196);
      background: blue;
      content: "✌️";
    }
  }
}
fieldset {
  background-color: #f4ffff;
  > legend {
    background-color: rgb(12, 67, 184);
    color: rgb(235, 243, 240);
    padding: 5px 10px;
    border-radius: 15px;
    margin: 0 25px;
  }
}
.modal {
  > .modal-contant {
    text-align: center;
    margin-top: 47px;
    font-size: 5vw;
  }
  position: fixed;
  background: rgb(228, 236, 188);
  height: 50%;
  width: 80%;
  z-index: 1000;
  top: 20%;
  border: 2px solid rgb(159, 209, 159);
  text-align: center;
  color: rgb(54, 88, 54);
}
#warper {
  width: 100%;
}
.err {
  color: red;
}
.grid-button {
  display: grid;
  justify-content: space-between;
  grid-template-columns: auto auto;
  margin-top: 15px;
}
.grid {
  display: grid;
  grid-gap: 50px;
  grid-template-columns: auto auto;
  padding: 10px;
}
.input {
  border: 1px solid #ccc;
  border-radius: 10px;
  transition: 1s;
  width: 300px !important;
  height: 37px;
  padding: 0 15px;
  &:focus {
    border: 1px solid blue;
  }
  &:required {
    &::before {
      content: "*";
    }
  }
  &:invalid {
    border: 1px solid red;
  }
}
.select {
  border: 1px solid #ccc;
  border-radius: 10px;
  transition: 1s;
  width: 300px !important;
  height: 37px;
  padding: 0 15px;
  > option {
    padding: 0 15px;
    border: 1px solid #ccc;
    border-radius: 10px;
    transition: 1s;
    width: 300px !important;
  }
}
.button {
  background-color: green;
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  transition: 1s;
  &:disabled {
    background-color: grey;
    transition: 1s;
  }
}
</style>