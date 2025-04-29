import firebaseConfig from "/src/firebaseConfig.js";
import { initializeApp } from "firebase/app";
import {
  get,
  child,
  off,
  set,
  ref as fireRef,
  getDatabase,
  onValue,
} from "firebase/database";
import {
  AuthErrorCodes,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

const app = initializeApp(firebaseConfig);
const dataBase = getDatabase(app);

function SignUp(email, password) {
  createUserWithEmailAndPassword(getAuth(), email, password)
    .then(() => {
      alert("You've signed up successfully!");
      location.replace("/");
    })
    .catch((error) => {
      if (error.message.includes(AuthErrorCodes.INVALID_EMAIL)) {
        alert("This email is invalid, try another one");
      } else if (error.message.includes(AuthErrorCodes.EMAIL_EXISTS)) {
        alert("This email already exists, try another one!");
      } else {
        alert(error.message);
      }
    });
}
function SignIn(email, password) {
  signInWithEmailAndPassword(getAuth(), email, password)
    .then(() => {
      alert("Successfully logged in!");
      location.replace("/");
    })
    .catch((error) => {
      if (error.message.includes(AuthErrorCodes.INVALID_EMAIL)) {
        alert("This email is invalid, try again!");
      } else if (error.message.includes(AuthErrorCodes.INVALID_PASSWORD)) {
        alert("Wrong password, try again!");
      } else {
        alert(error.message);
      }
    });
}

function SignOut() {
  const signOutUserRef = fireRef(
    dataBase,
    "users/" + getAuth().currentUser.uid
  );
  off(signOutUserRef, onValueChange);
  signOut(getAuth()).then(() => {
    location.replace("/");
  });
}

function SaveVisitorData(state) {
  set(fireRef(dataBase, "mood/"), {
    moodType: state.chosenMoodType,
    mood: state.moodType,
  });

  set(fireRef(dataBase, "art/"), {
    artId: state.currentArtId,
  });

  set(fireRef(dataBase, "music/"), {
    musicId: state.currentPlaylistId,
  });
}

function SaveUserData(state) {
  if (
    getAuth().currentUser !== null &&
    state.moodType &&
    state.chosenMoodType &&
    state.musicString &&
    state.currentArtId &&
    state.currentPlaylistId
  ) {
    set(fireRef(dataBase, "users/" + getAuth().currentUser.uid), {
      mood: state.moodType,
      moodType: state.chosenMoodType,
      musicString: state.musicString,
      artId: state.currentArtId,
      musicId: state.currentPlaylistId,
      saved_art: state.artIdList,
      saved_playlist: state.playlistIdList,
    });
  }
}

const onValueChange = (firebaseData, store) => {
  if (firebaseData.val()) {
    let payload = {
      mood: firebaseData.val()["mood"],
      moodType: firebaseData.val()["moodType"],
      musicString: firebaseData.val()["musicString"],
      currentArtId: firebaseData.val()["artId"],
      currentPlaylistId: firebaseData.val()["musicId"],
    };
    store.dispatch("setUserData", payload);
    if ("saved_art" in firebaseData.val()) {
      store.dispatch("setFavArt", firebaseData.val()["saved_art"]);
    }
    if ("saved_playlist" in firebaseData.val()) {
      store.dispatch("setFavPlaylist", firebaseData.val()["saved_playlist"]);
    }
  }
};

function LoadUserData(store) {
  const REF = fireRef(dataBase, "users/" + getAuth().currentUser.uid);
  onValue(REF, (firebaseData) => onValueChange(firebaseData, store));
}

function firebasePromise(store, user) {
  let musicRef;
  if (user) {
    musicRef = fireRef(dataBase, "users/" + getAuth().currentUser.uid);
  } else {
    musicRef = fireRef(dataBase, "music/");
  }
  get(child(musicRef, "musicId"))
    .then((firebaseData) => {
      //resolve promise
      store.dispatch("retrievePlaylist", firebaseData.val());
    })
    .catch((error) => {
      console.error(error);
    });

  let artRef;
  if (user) {
    artRef = fireRef(dataBase, "users/" + getAuth().currentUser.uid);
  } else {
    artRef = fireRef(dataBase, "art/");
  }
  get(child(artRef, "artId"))
    .then((firebaseData) => {
      //resolve promise
      store.dispatch("retrieveArtwork", firebaseData.val());
    })
    .catch((error) => {
      console.error(error);
    });
}

export {
  SignUp,
  SignIn,
  SignOut,
  LoadUserData,
  SaveUserData,
  SaveVisitorData,
  firebasePromise,
};
