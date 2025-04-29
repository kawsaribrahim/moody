<template>
  <SignInView
    @onLogIn="logIn"
    @onSetEmail="setEmail"
    @onSetPassword="setPassword"
  />
</template>

<script>
import SignInView from "../views/SignInView.vue";
import { SignIn } from "@/firebaseModel";

export default {
  components: { SignInView },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    logIn() {
      SignIn(this.email, this.password);
    },
    setEmail(email) {
      this.email = email;
    },
    setPassword(password) {
      this.password = password;
    },
  },
  computed: {},
};
</script>

<style scoped></style>
