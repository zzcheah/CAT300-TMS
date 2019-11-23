export const purchaseTicket = ticket => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    //make asyn call to database
    const firestore = getFirestore();
    //   const profile = getState().firebase.profile;
    //   const authorId = getState().firebase.auth.uid;
    firestore
      .collection("tickets")
      .add({
        ...ticket
      })
      .then(() => {
        dispatch({ type: "PURCHASE_TICKET", ticket });
      })
      .catch(err => {
        dispatch({ type: "PURCHASE_TICKET_ERROR", err });
      });
  };
};
