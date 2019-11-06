import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createStore, applyMiddleware, compose} from 'redux'
import rootReducer from './store/reducers/rootReducer';
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import { reduxFirestore, getFirestore } from 'redux-firestore'
import { reactReduxFirebase, getFirebase} from 'react-redux-firebase'
import firebase from './config/fbConfig'

const rrfConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true,
}

const composeEnhancers = 
        process.env.NODE_ENV === 'development'
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
        : compose;

const store = createStore(
    rootReducer, 
    // composeEnhancers(
    //     reactReduxFirebase(firebase, rrfConfig),
    //     reduxFirestore(firebase),
    //     applyMiddleware(thunk.withExtraArgument({getFirebase,getFirestore})),

    // )
   );



ReactDOM.render(<Provider store={store}><App /> </Provider>, document.getElementById('root'));

 







// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
