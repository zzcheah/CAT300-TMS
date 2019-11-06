import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

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
  firebase.initializeApp(firebaseConfig)
  firebase.firestore().settings({timestampsInSnapshots: true})

  export default firebase;