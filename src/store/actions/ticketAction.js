import firebase from "../../config/fbConfig.js";

export const purchaseTicket = ticket => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    //make asyn call to database
    const firestore = getFirestore();
    //   const profile = getState().firebase.profile;
    //   const authorId = getState().firebase.auth.uid;
    // firestore
    //   .collection("users")
    //   .doc(ticket.userId)
    //   .update({
    //     trainings: firebase.firestore.FieldValue.arrayUnion(ticket.trainingId),
    //     organizers: firebase.firestore.FieldValue.arrayUnion(ticket.organizer)
    //   })
    //   .then(() => {
    //     dispatch({ type: "PURCHASE_TICKET", ticket });
    //   })
    //   .catch(err => {
    //     dispatch({ type: "PURCHASE_TICKET_ERROR", err });
    //   });

    // Get a new write batch
    var batch = firestore.batch();

    // Update 'users'
    var usersRef = firestore.collection("users").doc(ticket.userId);
    batch.update(usersRef, {
      trainings: firebase.firestore.FieldValue.arrayUnion(ticket.trainingId),
      organizers: firebase.firestore.FieldValue.arrayUnion(ticket.organizer)
    });

    // Update 'training'
    var trainingRef = firestore.collection("trainings").doc(ticket.trainingId);
    batch.update(trainingRef, {
      attendees: firebase.firestore.FieldValue.arrayUnion(ticket.userId)
    });

    // Commit the batch
    batch
      .commit()
      .then(() => {
        dispatch({ type: "PURCHASE_TICKET", ticket });
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: "PURCHASE_TICKET_ERROR", err });
      });
  };
};

// // Get a new write batch
// var batch = firestore.batch();

// // Update 'users'
// var usersRef = firestore.collection("users").doc(ticket.userId);
// batch.update({
//   trainings: firebase.firestore.FieldValue.arrayUnion(ticket.trainingId),
//   organizers: firebase.firestore.FieldValue.arrayUnion(ticket.organizer)
// })

// // Update 'training'
// var trainingRef = firestore.collection("training").doc(ticket.trainingId);
// batch.update({
//   attendees: firebase.firestore.FieldValue.arrayUnion(ticket.userId)
// })

// // Commit the batch
// batch.commit().then(() => {
//   dispatch({ type: "PURCHASE_TICKET", ticket });
// })
// .catch(err => {
//   dispatch({ type: "PURCHASE_TICKET_ERROR", err });
// });
