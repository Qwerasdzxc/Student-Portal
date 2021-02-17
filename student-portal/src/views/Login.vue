<template>
  <div>
    <Header
      header="Student portal - Login"
      subtitle="Portal for students of the School of Computing"
      description="Portal is meant for the students to share information and news about
        subjects they attend"
    />
    <b-container class="bv-example-row">
      <form ref="form_login" @submit.stop.prevent="handleSubmit">
        <b-form-group
          :state="emailState"
          label="Email"
          label-for="email-input"
          invalid-feedback="Email is required"
        >
          <b-form-input
            id="email-input"
            v-model="email"
            :state="emailState"
            type="email"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          :state="passwordState"
          label="Password"
          label-for="password-input"
          invalid-feedback="Password is required"
        >
          <b-form-input
            id="password-input"
            v-model="password"
            :state="passwordState"
            type="password"
            required
          ></b-form-input>
        </b-form-group>
        <b-button variant="primary" style="margin-top: 20px" @click="loginClick()">
          Login
        </b-button>
      </form>
    </b-container>
  </div>
</template>

<script>
import Header from "@/components/Header";
import { mapActions } from 'vuex';

export default {
  name: "login",
  computed: {},
  components: {
    Header,
  },
  data() {
    return {
      email: "",
      password: "",
      emailState: null,
      passwordState: null,
    };
  },
  methods: {
    ...mapActions(["login"]),
    checkFormValidity() {
      const valid = this.$refs.form_login.checkValidity();
      this.emailState = valid;
      this.passwordState = valid;
      return valid;
    },
    loginClick: function () {
      if (!this.checkFormValidity()) return;

      const data = JSON.stringify({
        email: this.email,
        password: this.password,
      });

      this.login(data);
    },
  },
};
</script>
