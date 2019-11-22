export const createOrganizer = organizer => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    //make asyn call to database
    const firestore = getFirestore();
    //   const profile = getState().firebase.profile;
    //   const authorId = getState().firebase.auth.uid;
    firestore
      .collection("organizers")
      .add({
        ...organizer
      })
      .then(() => {
        dispatch({ type: "CREATE_ORGANIZER", organizer });
      })
      .catch(err => {
        dispatch({ type: "CREATE_ORGANIZER_ERROR", err });
      });
  };
};
