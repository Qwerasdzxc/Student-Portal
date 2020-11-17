<template>
  <div id="app">
    <router-view />
    <hr style="margin-top: 60px; margin-left: 60px; margin-right: 60px">
    <div id="nav" style="margin-bottom:20px">
      <router-link to="/">Home</router-link>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "App",
  methods: {
    ...mapActions(["load_subjects"]),
  },
  mounted: function () {
    this.load_subjects();
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
