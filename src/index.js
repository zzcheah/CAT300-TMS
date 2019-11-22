import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./store/reducers/rootReducer";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import {
  createFirestoreInstance,
  reduxFirestore,
  firestoreReducer,
  getFirestore
} from "redux-firestore";
import {
  ReactReduxFirebaseProvider,
  reactReduxFirebase,
  firebaseReducer,
  getFirebase,
  authIsReady
} from "react-redux-firebase";
import firebase, { storage } from "./config/fbConfig";

//react-redux-firebase config
const rrfConfig = {
  userProfile: "users",
  attachAuthIsReady: true, // attaches auth is ready promise to store,
  firebaseStateName: "firebase", // should match the reducer name ('firebase' is default)
  useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
};

// const createStore = (initialState = {}) => {
//   // Initialize Firebase instance
//   firebase.initializeApp(fbConfig)

//   // Add redux Firebase to compose
//   const createStoreWithFirebase = createStore(
//     rootReducer,
//     initialState,
//     compose(
//       reactReduxFirebase(firebase, config),
//       applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore }))
//     )
//   )

//   // Create store with reducers and initial state
//   const store = createStoreWithFirebase(rootReducer, initialState)

const store = createStore(
  rootReducer,
  compose(
    //    reactReduxFirebase(firebase),
    reduxFirestore(firebase),
    applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore }))
  )
);

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance // <- needed if using firestore
};

// const composeEnhancers =
//         process.env.NODE_ENV === 'development'
//         ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
//         : compose;

// store.firebaseAuthIsReady.then(() => {
//   ReactDOM.render(
//     <Provider store={store}>
//       <ReactReduxFirebaseProvider {...rrfProps}>
//         <App />
//       </ReactReduxFirebaseProvider>
//     </Provider>,
//     document.getElementById("root")
//   );
// });

ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <App />
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

/*
ReactDOM.render(
<Provider store={store}>
    <ReactReduxFirebaseProvider{...rrfProps}>
        <App /> 
    </ReactReduxFirebaseProvider>
</Provider>, 
document.getElementById('root')
);
*/
