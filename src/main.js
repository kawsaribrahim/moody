import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { Quasar } from "quasar";
import quasarUserOptions from "./quasar-user-options";
import "@/firebaseModel.js";
import {
  LoadUserData,
  SaveUserData,
  SaveVisitorData,
  firebasePromise,
} from "@/firebaseModel";
import { getAuth, onAuthStateChanged } from "firebase/auth";

onAuthStateChanged(getAuth(), (user) => {
  store.dispatch("fetchUser", user);
  firebasePromise(store, user);
  //if user exists load data
  if (user) {
    LoadUserData(store);
  }
  store.subscribeAction({
    after: (action, state) => {
      if (action.type && action.type !== "fetchUser") {
        //you get visitor temporary data if you are not signed in
        //you get user data if you are not signed in
        if (user) {
          SaveUserData(state);
        } else {
          SaveVisitorData(state);
        }
      }
    },
  });
});

createApp(App)
  .use(Quasar, quasarUserOptions)
  .use(router)
  .use(store)
  .mount("#app");
