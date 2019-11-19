import { combineReducers } from "redux";
import authReducer from "./authReducer";
import projectReducer from "./projectReducer";
import trainingReducer from "./trainingReducer";

import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase";

const rootReducer = combineReducers({
  auth: authReducer,
  project: projectReducer,
  training: trainingReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer
});

export default rootReducer;
