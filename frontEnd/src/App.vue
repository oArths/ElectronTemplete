<template>
  <v-app v-if="currentRoutePath !== '/login' && currentRoutePath !== '/register'">
    <!-- App Bar -->
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>My Vuetify App</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text @click="navigateTo('/')">Home</v-btn>
      <v-btn text @click="navigateTo('/about')">About</v-btn>
    </v-app-bar>

    <!-- Sidebar and Content -->
    <v-main>
      <v-container fluid>
        <v-row>
          <v-col cols="3">
            <v-navigation-drawer app permanent>
              <v-list>
                <v-list-item-group>
                  <v-list-item @click="navigateTo('/')" link>
                    <v-list-item-title>Home</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="navigateTo('/about')" link>
                    <v-list-item-title>About</v-list-item-title>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-navigation-drawer>
          </v-col>
          <v-col cols="9">
            <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
  <v-app v-else>
    <router-view></router-view>
  </v-app>
</template>

<script>
export default {
  name: "App",
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    },
  },
  mounted() {
    this.$ipcRequest("get-personas", "get-personas-response", "get-personas-error", null, (response) => {
      console.log("Personas received:", response);
    }, (error) => {
      console.error("Error fetching personas:", error);
    });
  },
  computed: {
    currentRoutePath() {
      return this.$router.currentRoute.value.path;
    },
  }
};
</script>

<style>
/* Add any custom styles here */
</style>