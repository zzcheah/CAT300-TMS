const functions = require("firebase-functions");
const admin = require("firebase-admin");

const cors = require("cors")({ origin: true });
var moment = require("moment");

admin.initializeApp(functions.config().firebase);

const sortByNotifTime = array_elements => {
  const result = [];
  uid = null;
  numNotification = 0;

  for (var i = 0; i < array_elements.length; i++) {
    if (array_elements[i] != uid) {
      if (numNotification > 0) {
        result.push({
          uid: uid,
          numNotification: numNotification
        });
      }
      uid = array_elements[i];
      numNotification = 1;
    } else {
      numNotification++;
    }
  }
  if (numNotification > 0) {
    result.push({
      uid: uid,
      numNotification: numNotification
    });
  }
  return result;
};

const getUnique = array => {
  var uniqueArray = [];

  // Loop through array values
  for (i = 0; i < array.length; i++) {
    if (uniqueArray.indexOf(array[i]) === -1) {
      uniqueArray.push(array[i]);
    }
  }
  return uniqueArray;
};

const createNotification = notification => {
  return admin
    .firestore()
    .collection("notifications")
    .add(notification)
    .then(doc => console.log("notification added", doc));
};

const updateUserNotification = target => {
  return admin
    .firestore()
    .collection("users")
    .doc(target.uid)
    .update({ notif: target.numNotification })

    .then(doc => console.log("notification times added", doc));
};

exports.projectCreated = functions.firestore
  .document("projects/{projectId}")
  .onCreate(doc => {
    const project = doc.data();
    const notification = {
      content: "Added a new project",
      user: `${project.authorFirstName} ${project.authorLastName}`,
      time: admin.firestore.FieldValue.serverTimestamp()
    };
    return createNotification(notification);
  });

exports.userJoined = functions.auth.user().onCreate(user => {
  const doc = admin
    .firestore()
    .collection("users")
    .doc(user.uid)
    .get();
  const newUser = doc.data();
  const notification = {
    content: "Joined the party",
    user: `${newUser.firstName} ${newUser.lastName}`,
    time: admin.firestore.FieldValue.serverTimestamp()
  };
  return createNotification(notification);
});

/////////////////////////////////////////////////////////////////////////////////////////////////////

exports.sendDailyNotifications = functions.https.onRequest(
  (request, response) => {
    cors(request, response, () => {
      const now = moment();
      const dateFormatted = now.format("DDMMYYYY");

      admin
        .firestore()
        .collection("trainings")
        .where("dateFormat", "==", dateFormatted)
        .get()
        .then(querySnapshot => {
          const promises = [];
          querySnapshot.forEach(doc => {
            const newNotification = doc.data();
            const targets = newNotification.attendees; //Assumption: the tokenId is in the doc
            const notification = {
              targets: targets,
              trainingTitle: `${newNotification.title}`,
              trainingId: doc.id,
              dateTime: newNotification.dateTime,
              createdAt: admin.firestore.FieldValue.serverTimestamp()
            };
            const notif = createNotification(notification);
            targets.forEach(tgt => {
              promises.push(tgt);
            });
          });
          return Promise.all(promises);
        })
        .then(snapshots => {
          snapshots.sort();
          const results = sortByNotifTime(snapshots);

          results.forEach(target => {
            return updateUserNotification(target);
          });

          // const uniqueTargets = getUnique(snapshots);
          // uniqueTargets.forEach(target => {
          //   return updateUserNotification(target);
          // });
          response.send(results);
        })
        .catch(error => {
          console.log(error);
          response.status(500).send(error);
        });
    });
  }
);

//////////////////////////////////////////////////////////////////////////////////////////////////

//   export const getBostonAreaWeather = functions.https.onRequest((request, response) => {
//     admin.firestore().doc("areas/greater-boston").get()
//     .then(areaSnapshot => {
//         const cities = areaSnapshot.data().cities
//         const promises = []
//         cities.forEach(city => {
//             const p = admin.firestore().doc(`cities-weather/${city}`).get()
//             promises.push(p)
//         })
//         return Promise.all(promises)
//     })
//     .then(snapshots => {
//         const results = []
//         snapshots.forEach(snap => {
//             const data = snap.data()
//             data.city = snap.id
//             results.push(data)
//         })
//         response.send(results)
//     })
//     .catch(error => {
//         console.log(error)
//         response.status(500).send(error)
//     })
// })
