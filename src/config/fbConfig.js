import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

//Installing firebase
const firebaseConfig = {
  apiKey: "AIzaSyCHgGgEOMYRQRM5KEvDxBjdJyrjil9jcNM",
  authDomain: "training-management-sys.firebaseapp.com",
  databaseURL: "https://training-management-sys.firebaseio.com",
  projectId: "training-management-sys",
  storageBucket: "training-management-sys.appspot.com",
  messagingSenderId: "1066917653605",
  appId: "1:1066917653605:web:7e4e29e7c3432efe55aa8c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
  //Init firestore instance
  const firestore = firebase.firestore()
//firebase.firestore().settings({timestampsInSnapshots: true})
  export default firebase;