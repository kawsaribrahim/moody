<template>
  <SignUpView
    @onRegister="register"
    @onSetEmail="setEmail"
    @onSetPassword="setPassword"
  />
</template>

<script>
import SignUpView from "../views/SignUpView.vue";
import { SignUp } from "@/firebaseModel";

export default {
  components: { SignUpView },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    register() {
      SignUp(this.email, this.password);
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
