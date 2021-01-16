<template>
  <v-app>
    <v-navigation-drawer
    app
    v-model="drawer"
      :right="$vuetify.rtl"
      expand-on-hover
      >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="localePath(item.to)"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="$i18n.locale === 'il'" :to="switchLocalePath('en')" nuxt>
          <v-list-item-action>
            <v-icon>mdi-flag-triangle</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
                english
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item v-else :to="switchLocalePath('il')" nuxt>
          <v-list-item-action>
            <v-icon>mdi-flag-triangle</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
                עברית
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer
    inset
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  created() {
    this.$vuetify.rtl = this.$i18n.locale === 'il';
  },
  data:()=>({
    drawer: null,
    items: 
    [
      {
        to: "/",
        icon: "mdi-language-css3",
        title: "width normal css"
      },
      {
        to: "/vuetify",
        icon: "mdi-vuetify",
        title: "with vuetify"
      }
    ]
  })
}
</script>
