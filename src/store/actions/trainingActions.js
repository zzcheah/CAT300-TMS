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
