import Alert from "react-s-alert";

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
        Alert.success("Organizer Added");
        dispatch({ type: "CREATE_ORGANIZER", organizer });
      })
      .catch(err => {
        Alert.error(err.message);
        dispatch({ type: "CREATE_ORGANIZER_ERROR", err });
      });
  };
};
