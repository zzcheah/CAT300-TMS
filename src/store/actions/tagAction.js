export const createTag = tag => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    //make asyn call to database
    const firestore = getFirestore();
    // console.log(tag, "tagAction de tag");
    //   const profile = getState().firebase.profile;
    //   const authorId = getState().firebase.auth.uid;
    firestore
      .collection("tags")
      .add({
        ...tag
      })
      .then(() => {
        dispatch({ type: "CREATE_TAG", tag });
      })
      .catch(err => {
        dispatch({ type: "CREATE_TAG_ERROR", err });
      });
  };
};
