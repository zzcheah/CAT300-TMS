const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
const priorityQueue = require("js-priority-queue");
const cors = require("cors")({ origin: true });
var moment = require("moment");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const createNotification = notification => {
  return admin
    .firestore()
    .collection("notifications")
    .add(notification)
    .then(doc => console.log("notification added", doc));
};

const deleteNotification = id => {
  return admin
    .firestore()
    .collection("notifications")
    .doc(id)
    .delete()
    .then(console.log("notification deleted", id));
};

const sortByNotifTime = array_elements => {
  const result = [];
  var uid = null;
  var numNotification = 0;

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
  for (var i = 0; i < array.length; i++) {
    if (uniqueArray.indexOf(array[i]) === -1) {
      uniqueArray.push(array[i]);
    }
  }
  return uniqueArray;
};

const updateUserNotification = target => {
  return admin
    .firestore()
    .collection("users")
    .doc(target.uid)
    .update({ notif: target.numNotification })

    .then(doc => console.log("notification times added", doc));
};

const updateRecommendation = () => {
  const db = admin.firestore();

  const userRows = [];
  const trainingRows = [];

  function cosinesim(A, B) {
    var dotproduct = 0;
    var mA = 0;
    var mB = 0;
    for (var i = 0; i < A.length; i++) {
      dotproduct += A[i] * B[i];
      mA += A[i] * A[i];
      mB += B[i] * B[i];
    }
    mA = Math.sqrt(mA);
    mB = Math.sqrt(mB);
    var similarity = dotproduct / (mA * mB);
    return similarity;
  }

  var p1 = db
    .collection("userRows")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        userRows.push(doc);
      });
    });

  var p2 = db
    .collection("trainingRows")
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        trainingRows.push(doc);
      });
    });

  var loadData = Promise.all([p1, p2]);

  loadData.then(() => {
    var compareNumbers = function(a, b) {
      return b.similarity - a.similarity;
    };

    userRows.forEach(userRow => {
      var queue = new priorityQueue({
        comparator: compareNumbers
      });

      trainingRows.forEach(trainingRow => {
        const similarity = cosinesim(
          userRow.data().vector,
          trainingRow.data().vector
        );
        queue.queue({ id: trainingRow.data().id, similarity });
      });

      const len = queue.length >= 5 ? 5 : queue.length;
      const recommendation = [];

      for (var i = 0; i < len; i++) {
        recommendation.push(queue.dequeue().id);
      }

      db.collection("users")
        .doc(userRow.data().id)
        .update({ recommendation });
    });
  });
};

exports.refreshFM = functions.https.onRequest((request, response) => {
  const db = admin.firestore();

  var del = db
    .collection("trainingRows")
    .get()
    .then(snapshot => {
      let batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      return batch.commit();
    });

  var del2 = db
    .collection("userRows")
    .get()
    .then(snapshot => {
      let batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      return batch.commit();
    });

  Promise.all([del, del2]).then(() => {
    const users = [];
    const trainings = [];
    const tags = [];
    const organizers = [];

    var p1 = db
      .collection("users")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          users.push(doc);
        });
      });

    var p2 = db
      .collection("trainings")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          trainings.push(doc);
        });
      });

    var p3 = db
      .collection("tags")
      .orderBy("type", "asc")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          tags.push(doc);
        });
      });

    var p4 = db
      .collection("organizers")
      .orderBy("name", "asc")
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          organizers.push(doc);
        });
      });

    var fm = Promise.all([p1, p2, p3, p4]).then(() => {
      trainings.map(training => {
        const vector = [];
        for (var i = 0; i < tags.length; i++) {
          if (training.data().selectedTags.includes(tags[i].data().type))
            vector.push(true);
          else vector.push(false);
        }

        for (i = 0; i < organizers.length; i++) {
          if (training.data().organizer === organizers[i].data().name)
            vector.push(true);
          else vector.push(false);
        }

        db.collection("trainingRows").add({
          id: training.id,
          title: training.data().title,
          vector: vector
        });

        return null;
      });

      users.map(user => {
        const vector = [];
        for (var i = 0; i < tags.length; i++) {
          if (user.data().tags.includes(tags[i].data().type)) vector.push(true);
          else vector.push(false);
        }
        if (user.data().organizers) {
          for (i = 0; i < organizers.length; i++) {
            if (user.data().organizers.includes(organizers[i].data().name))
              vector.push(true);
            else vector.push(false);
          }
        } else {
          for (i = 0; i < organizers.length; i++) {
            vector.push(false);
          }
        }

        db.collection("userRows").add({
          id: user.id,
          name: user.data().firstName,
          vector: vector
        });

        return null;
      });
    });

    fm.then(() => {
      setTimeout(updateRecommendation, 5000);
      // updateRecommendation();
      response.send("done");
    });
  });
});

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
  return admin
    .firestore()
    .collection("users")
    .doc(user.uid)
    .get()
    .then(doc => {
      const newUser = doc.data();
      const notification = {
        content: "Joined the party",
        user: `${newUser.firstName} ${newUser.lastName}`,
        time: admin.firestore.FieldValue.serverTimestamp()
      };

      return createNotification(notification);
    });
});

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
            const targets = newNotification.attendees;
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

exports.deleteEmptyNotification = functions.https.onRequest(
  (request, response) => {
    admin
      .firestore()
      .collection("notifications")
      .get()
      .then(querySnapshot => {
        const promises = [];
        querySnapshot.forEach(doc => {
          if (doc.data().targets.length == 0) {
            promises.push(doc.id);
          }
        });
        return Promise.all(promises);

        // response.send(promises);
      })
      .then(snapshots => {
        snapshots.forEach(id => {
          deleteNotification(id);
        });
        response.send(snapshots);
      })
      .catch(error => {
        console.log(error);
        response.status(500).send(error);
      });
  }
);

/////////////////////////////////////////////////////////////////////////
exports.deleteOutdatedNotification = functions.https.onRequest(
  (request, response) => {
    cors(request, response, () => {
      admin
        .firestore()
        .collection("notifications")
        .get()
        .then(querySnapshot => {
          const promises = [];
          const now = moment();
          querySnapshot.forEach(doc => {
            const daysDiff = now.diff(doc.data().dateTime.toDate(), "days");
            if (daysDiff > 14) {
              promises.push(doc.id);
            }
          });
          return Promise.all(promises);
        })
        .then(snapshots => {
          snapshots.forEach(id => {
            deleteNotification(id);
          });
          response.send(snapshots);
        })
        .catch(error => {
          console.log(error);
          response.status(500).send(error);
        });
    });
  }
);

exports.testCloud = functions.https.onRequest((request, response) => {
  async function quickstart() {
    console.log("yeayaey");
    // Imports the Google Cloud client library
    const language = require("@google-cloud/language");

    // Instantiates a client
    const client = new language.LanguageServiceClient();

    // The text to analyze
    const text = "The training is very bad";

    const document = {
      content: text,
      type: "PLAIN_TEXT"
    };

    // Detects the sentiment of the text
    const [result] = await client.analyzeSentiment({ document: document });
    const sentiment = result.documentSentiment;

    response.send(`Sentiment score: ${sentiment.score}`);
    console.log(`Text: ${text}`);
    console.log(`Sentiment score: ${sentiment.score}`);
    console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
  }
  quickstart();
  return null;
});
