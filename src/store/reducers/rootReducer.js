import { combineReducers } from "redux";
import authReducer from "./authReducer";
import projectReducer from "./projectReducer";
import recReducer from "./recReducer";
import trainingReducer from "./trainingReducer";
import tagReducer from "./tagReducer";
import organizerReducer from "./organizerReducer";

import { firestoreReducer } from "redux-firestore";
import { firebaseReducer } from "react-redux-firebase";

const rootReducer = combineReducers({
  auth: authReducer,
  project: projectReducer,
  training: trainingReducer,
  tag: tagReducer,
  organizer: organizerReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  rec: recReducer
});

export default rootReducer;
