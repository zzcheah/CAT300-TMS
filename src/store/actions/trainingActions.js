import firebase from "../../config/fbConfig";
import moment from "moment";
// import PriorityQueue from "js-priority-queue";
const priorityQueue = require("js-priority-queue");

export const createTraining = training => {
  return (dispatch, getState, { getFirebase, getFirestore }) => {
    //make asyn call to database
    const firestore = getFirestore();
    // const profile = getState().firebase.profile;
    // const authorId = getState().firebase.auth.uid;
    firestore
      .collection("trainings")
      .add({
        ...training,
        dateFormat: moment(training.dateTime).format("DDMMYYYY"),
        createdAt: new Date(),
        attendees: []
      })
      .then(() => {
        dispatch({ type: "CREATE_TRAINING", training });
      })
      .catch(err => {
        dispatch({ type: "CREATE_TRAINING_ERROR", err });
      });
  };
};

export const fetchOrganizers = () => {
  return dispatch => {
    firebase
      .firestore()
      .collection("organizers")
      .onSnapshot(snapshot => {
        var organizers = [];
        if (snapshot.docs.empty !== false) {
          snapshot.docs.forEach(doc => {
            organizers.push(doc.data().name);
          });
          dispatch(setOrganizers(organizers));
        }
      });
  };
};

export const setOrganizers = organizers => {
  return {
    type: "SET_ORGANIZERS",
    payload: organizers
  };
};

export const editTraining = training => {};

export const fetchTags = () => {
  return dispatch => {
    firebase
      .firestore()
      .collection("tags")
      .get()
      .then(snapshot => {
        var tags = [];
        if (snapshot.docs.empty !== false) {
          snapshot.docs.forEach(doc => {
            tags.push(doc.data().type);
          });
          dispatch(setTags(tags));
        }
      });
  };
};

export const setTags = tags => {
  return {
    type: "SET_TAGS",
    payload: tags
  };
};

export const testCloud = () => {
  return dispatch => {
    async function quickstart() {
      console.log("yeayaey");
      // Imports the Google Cloud client library
      const language = require("@google-cloud/language");

      // Instantiates a client
      const client = new language.LanguageServiceClient();

      // The text to analyze
      const text = "Hello, world!";

      const document = {
        content: text,
        type: "PLAIN_TEXT"
      };

      // Detects the sentiment of the text
      const [result] = await client.analyzeSentiment({ document: document });
      const sentiment = result.documentSentiment;

      console.log(`Text: ${text}`);
      console.log(`Sentiment score: ${sentiment.score}`);
      console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
    }
    // quickstart();
  };
};

export const testFM = () => {
  return dispatch => {
    const db = firebase.firestore();

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
            if (user.data().tags.includes(tags[i].data().type))
              vector.push(true);
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

      var rec = fm.then(() => {
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
            console.log(snapshot);
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

          console.log(trainingRows);

          userRows.forEach(userRow => {
            var queue = new priorityQueue({
              comparator: compareNumbers
            });
            console.log("hahahs");

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
              .update({ recommendation })
              .then(() => console.log("done"))
              .catch(err => console.log(err));
          });
        });
      });

      rec.then(() => {
        console.log("done");
      });
    });
  };
};

// var del = db
//   .collection("trainingRows")
//   .get()
//   .then(snapshot => {
//     let batch = db.batch();
//     snapshot.docs.forEach(doc => {
//       batch.delete(doc.ref);
//     });

//     return batch.commit();
//   });

// var del2 = db
//   .collection("userRows")
//   .get()
//   .then(snapshot => {
//     let batch = db.batch();
//     snapshot.docs.forEach(doc => {
//       batch.delete(doc.ref);
//     });

//     return batch.commit();
//   });

//   var fm = Promise.all([del, del2]).then(() => {
//     const users = [];
//     const trainings = [];
//     const tags = [];
//     const organizers = [];

//     var p1 = db
//       .collection("users")
//       .get()
//       .then(snapshot => {
//         snapshot.forEach(doc => {
//           users.push(doc);
//         });
//       });

//     var p2 = db
//       .collection("trainings")
//       .get()
//       .then(snapshot => {
//         snapshot.forEach(doc => {
//           trainings.push(doc);
//         });
//       });

//     var p3 = db
//       .collection("tags")
//       .orderBy("type", "asc")
//       .get()
//       .then(snapshot => {
//         snapshot.forEach(doc => {
//           tags.push(doc);
//         });
//       });

//     var p4 = db
//       .collection("organizers")
//       .orderBy("name", "asc")
//       .get()
//       .then(snapshot => {
//         snapshot.forEach(doc => {
//           organizers.push(doc);
//         });
//       });

//     var fin = Promise.all([p1, p2, p3, p4]).then(() => {
//       trainings.map(training => {
//         const vector = [];
//         for (var i = 0; i < tags.length; i++) {
//           if (training.data().selectedTags.includes(tags[i].data().type))
//             vector.push(true);
//           else vector.push(false);
//         }

//         for (i = 0; i < organizers.length; i++) {
//           if (training.data().organizer === organizers[i].data().name)
//             vector.push(true);
//           else vector.push(false);
//         }

//         db.collection("trainingRows").add({
//           id: training.id,
//           title: training.data().title,
//           vector: vector
//         });

//         return null;
//       });

//       users.map(user => {
//         const vector = [];
//         for (var i = 0; i < tags.length; i++) {
//           if (user.data().tags.includes(tags[i].data().type)) vector.push(true);
//           else vector.push(false);
//         }
//         if (user.data().organizers) {
//           for (i = 0; i < organizers.length; i++) {
//             if (user.data().organizers.includes(organizers[i].data().name))
//               vector.push(true);
//             else vector.push(false);
//           }
//         } else {
//           for (i = 0; i < organizers.length; i++) {
//             vector.push(false);
//           }
//         }

//         db.collection("userRows").add({
//           id: user.id,
//           name: user.data().firstName,
//           vector: vector
//         });

//         return null;
//       });
//     });

//     fin.then(() => {
//       response.send("done");
//     });
//   });

// fm.then(() => {
//     //get userRows, training Rows
//     return null;
//   });
