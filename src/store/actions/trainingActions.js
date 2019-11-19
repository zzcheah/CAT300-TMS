import firebase from "../../config/fbConfig";

export const createTraining = training => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    //make asyn call to database
    const firestore = getFirestore();
    const profile = getState().firebase.profile;
    const authorId = getState().firebase.auth.uid;
    firestore
      .collection("trainings")
      .add({
        ...training,
        createdAt: new Date()
        // authorFirstName: profile.firstName,
        // authorLastName: profile.lastName,
        // authorId: authorId,
      })
      .then(() => {
        dispatch({ type: "CREATE_TRAINING", training });
      })
      .catch(err => {
        dispatch({ type: "CREATE_TRAINING_ERROR", err });
      });
  };
};

export const fetchOrganizers = () => {
  return dispatch => {
    firebase
      .firestore()
      .collection("organizers")
      .get()
      .then(snapshot => {
        var organizers = [];
        if (snapshot.docs.empty != false) {
          snapshot.docs.forEach(doc => {
            organizers.push(doc.data().name);
          });
          dispatch(setOrganizers(organizers));
        }
      });
  };
};

export const setOrganizers = organizers => {
  return {
    type: "SET_ORGANIZERS",
    payload: organizers
  };
};

export const fetchTags = () => {
  return dispatch => {
    firebase
      .firestore()
      .collection("tags")
      .get()
      .then(snapshot => {
        var tags = [];
        if (snapshot.docs.empty != false) {
          snapshot.docs.forEach(doc => {
            tags.push(doc.data().type);
          });
          dispatch(setTags(tags));
        }
      });
  };
};

export const setTags = tags => {
  return {
    type: "SET_TAGS",
    payload: tags
  };
};
