import firebase from "../../config/fbConfig.js";
import Alert from "react-s-alert";

export const createFeedback = (feedback, notificationId, title) => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    //make asyn call to database
    const firestore = getFirestore();
    console.log(getState(), "getState");
    const profile = getState().firebase.profile;
    const userId = getState().firebase.auth.uid;

    // Get a new write batch
    var batch = firestore.batch();

    // create 'feedback'
    var feedbackRef = firestore.collection("feedbacks").doc();
    batch.set(feedbackRef, {
      ...feedback,
      trainingTitle: title,
      userId: userId,
      initials: profile.initials,
      username: profile.firstName + " " + profile.lastName,
      createdAt: new Date()
    });

    // update 'user' notif
    var usersRef = firestore.collection("users").doc(userId);
    batch.update(usersRef, {
      notif: profile.notif - 1
    });

    // Update 'notifications'
    var notificationRef = firestore
      .collection("notifications")
      .doc(notificationId);
    batch.update(notificationRef, {
      targets: firebase.firestore.FieldValue.arrayRemove(userId)
    });

    // firestore
    //   .collection("feedbacks")
    //   .add({
    //     ...feedback,
    //     userId: userId,
    //     initials: profile.initials,
    //     username: profile.firstName + " " + profile.lastName,
    //     createdAt: new Date()
    //   })
    // Commit the batch
    batch
      .commit()
      .then(() => {
        Alert.success("Feedback Posted");
        dispatch({ type: "CREATE_FEEDBACK", feedback });
      })
      .catch(err => {
        Alert.error(err.message);
        dispatch({ type: "CREATE_FEEDBACK_ERROR", err });
      });
  };
};
