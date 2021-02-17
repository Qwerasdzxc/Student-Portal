<template>
  <div id="app">
    <router-view />
    <hr style="margin-top: 60px; margin-left: 60px; margin-right: 60px" />
    <div id="nav" style="margin-bottom: 20px">
      <router-link to="/" v-if="loggedIn" style="margin-right: 20px"
        >Home</router-link
      >
      <a href="/api/logout" v-if="loggedIn" @click="logout">Logout</a>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "App",
  computed: {
    ...mapState(["user", "loggedIn"]),
  },
  methods: {
    ...mapActions(["set_user", "get_user", "check_logged_in", "set_logged_in"]),
    logout: function (e) {
      e.preventDefault();
      
      this.set_user(null);
      this.set_logged_in(false);
      window.location.href = '/api/logout';
    },
  },
  mounted: function () {
    this.check_logged_in();
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
