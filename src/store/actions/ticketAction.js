import firebase from "../../config/fbConfig.js";

export const purchaseTicket = ticket => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    //make asyn call to database
    const firestore = getFirestore();

    // Get a new write batch
    var batch = firestore.batch();

    // Update 'users'
    var usersRef = firestore.collection("users").doc(ticket.userId);
    batch.update(usersRef, {
      trainings: firebase.firestore.FieldValue.arrayUnion(ticket.trainingId),
      organizers: firebase.firestore.FieldValue.arrayUnion(ticket.organizer)
      // tags: firebase.firestore.FieldValue.arrayUnion(ticket.trainingTags)
    });

    if (ticket.trainingTags) {
      ticket.trainingTags.map(tag => {
        batch.update(usersRef, {
          tags: firebase.firestore.FieldValue.arrayUnion(tag)
        });
      });
    }

    // Update 'training'
    var trainingRef = firestore.collection("trainings").doc(ticket.trainingId);
    batch.update(trainingRef, {
      attendees: firebase.firestore.FieldValue.arrayUnion(ticket.userId),
      seat: ticket.seat - 1
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
