import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

//Installing firebase
const firebaseConfig = {
  apiKey: "AIzaSyAilZzQRjFt8L78O9dIuXWFgG4ocZjRH-Y",
  authDomain: "training-management-syst-79d28.firebaseapp.com",
  databaseURL: "https://training-management-syst-79d28.firebaseio.com",
  projectId: "training-management-syst-79d28",
  storageBucket: "training-management-syst-79d28.appspot.com",
  messagingSenderId: "769527801306",
  appId: "1:769527801306:web:2610e3354ea5a84d114ce3",
  measurementId: "G-EZNNZYZLYS"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//Init firestore instance
firebase.firestore();
const storage = firebase.storage();

export default firebase;
export { storage };
// export { storage, firebase as default };
