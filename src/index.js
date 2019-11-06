import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware, compose} from 'redux'
import rootReducer from './store/reducers/rootReducer';
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import { createFirestoreInstance, reduxFirestore, firestoreReducer } from 'redux-firestore'
import { ReactReduxFirebaseProvider, reactReduxFirebase, firebaseReducer} from 'react-redux-firebase'
import firebase from './config/fbConfig'



//react-redux-firebase config
const rrfConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
  }

const initialState = { }
const store = createStore(rootReducer, initialState)

const rrfProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance // <- needed if using firestore
  }




ReactDOM.render(
<Provider store={store}>
    <ReactReduxFirebaseProvider{...rrfProps}>
        <App /> 
    </ReactReduxFirebaseProvider>
</Provider>, 
document.getElementById('root')
);



// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();




















// import firebase from 'firebase/app'
// import 'firebase/firestore'
// import 'firebase/auth'
// //Installing firebase
// const firebaseConfig = {
//     apiKey: "AIzaSyAilZzQRjFt8L78O9dIuXWFgG4ocZjRH-Y",
//     authDomain: "training-management-syst-79d28.firebaseapp.com",
//     databaseURL: "https://training-management-syst-79d28.firebaseio.com",
//     projectId: "training-management-syst-79d28",
//     storageBucket: "training-management-syst-79d28.appspot.com",
//     messagingSenderId: "769527801306",
//     appId: "1:769527801306:web:2610e3354ea5a84d114ce3",
//     measurementId: "G-EZNNZYZLYS"
//   };
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);
//   //Init firestore instance
//   firebase.firestore().settings({timestampsInSnapshots: true})


// const createStoreWithFirebase = compose(
//     reactReduxFirebase(firebase,rrfConfig),
//     reduxFirestore(firebase)
// )(createStore)

// const store = createStoreWithFirebase(
//     rootReducer, 
//     initiateState,
//     compose(
//         reactReduxFirebase(firebase),
//         window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()

//     )
//    );

// const composeEnhancers = 
//         process.env.NODE_ENV === 'development'
//         ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
//         : compose;

// const store = createStore(
//     rootReducer, 
//     composeEnhancers(
//         reactReduxFirebase(firebase, rrfConfig),
//         reduxFirestore(firebase),
//         applyMiddleware(thunk.withExtraArgument({getFirebase,getFirestore})),

//     )
//    );