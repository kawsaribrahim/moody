<template>
  <NavBarView :user="user" @onLogOut="logOut" />
</template>

<script>
import NavBarView from "@/views/NavBarView";
import { mapGetters } from "vuex";
import { SignOut } from "@/firebaseModel";
export default {
  name: "NavBarPresenter",
  components: { NavBarView },
  computed: {
    ...mapGetters({
      user: "user",
    }),
  },
  methods: {
    logOut() {
      SignOut();
    },
  },
};
</script>

<style scoped></style>
