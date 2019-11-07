import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware, compose} from 'redux'
import rootReducer from './store/reducers/rootReducer';
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import { createFirestoreInstance, reduxFirestore, firestoreReducer,getFirestore } from 'redux-firestore'
import { ReactReduxFirebaseProvider, reactReduxFirebase, firebaseReducer,getFirebase} from 'react-redux-firebase'
import firebase from './config/fbConfig'



//react-redux-firebase config
const rrfConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
  }

 const initialState = { }
// const store = createStore(rootReducer, initialState)
const store = createStore(rootReducer, 
    compose(
        applyMiddleware(thunk.withExtraArgument({getFirebase, getFirestore})),
));

const rrfProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance // <- needed if using firestore
  }




// const composeEnhancers = 
//         process.env.NODE_ENV === 'development'
//         ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
//         : compose;







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