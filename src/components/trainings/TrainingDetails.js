import React from "react";
import { connect } from "react-redux";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import moment from "moment";
import "../../style/tag.css";
import { Link } from "react-router-dom";
import CircularLoad from "../loading/CircularLoad";
import PurchaseTicket from "../manage/PurchaseTicket";
import ViewUserFeedback from "../feedback/ViewUserFeedback";
import ViewAllFeedbacks from "../feedback/ViewAllFeedbacks";

import Button from "@material-ui/core/Button";

const TrainingDetails = props => {
  const { id, training, auth, profile, state, role } = props;
  // console.log(props, "props");
  // console.log(moment().format("DDMMYYYY"), "moment");

  // if (auth.isEmpty && auth.isLoaded) return <Redirect to="/signin" />;
  if (training) {
    var purchaseButton;
    if (training.dateTime.toDate() < moment()) {
      // training that has passed
      purchaseButton = <p>Passed</p>;
    } else if (profile.trainings && profile.trainings.includes(id)) {
      purchaseButton = (
        <button className="btn green lighten-1 z-depth-0 left" disabled>
          Purchased
        </button>
      );
    } else if (training && training.seat == 0) {
      purchaseButton = (
        <button className="btn green lighten-1 z-depth-0 left" disabled>
          Out of Stock
        </button>
      );
    } else {
      purchaseButton = (
        <PurchaseTicket
          trainingid={id}
          organizer={training.organizer}
          trainingTags={training.selectedTags}
          seat={training.seat}
        />
      );
    }

    return (
      <div>
        <div className="container section training-details">
          <div className="card z-depth-0">
            <div className="card-content ">
              <span className="card-title">{training.title}</span>

              {training.url ? (
                <img
                  src={training.url}
                  alt="image"
                  width="auto"
                  style={{ maxHeight: "300px", maxWidth: "100%" }}
                />
              ) : (
                <img
                  src={require("../../images/training.jpg")}
                  alt="no image"
                  width="auto"
                  style={{ maxHeight: "300px", maxWidth: "100%" }}
                />
              )}

              <p>{training.description}</p>
              <p>Cost : RM{training.price}</p>
              <p>Available seats: {training.seat}</p>

              <span>Tag(s)</span>
              <div className="tags-input">
                <ul id="tags">
                  {training.selectedTags.map((tag, index) => (
                    <li key={index} className="tag">
                      <span className="tag-title">{tag}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="card-action black lighten-4 white-text">
              <div>organized by {training.organizer} </div>
              <div className="right">{purchaseButton}</div>
              <div>{training.venue} </div>

              {/* <div>{moment().diff(training.dateTime.toDate(), "days")}</div> */}
              <div>{moment(training.dateTime.toDate()).format("LLLL")}</div>
            </div>
          </div>
        </div>
        {auth.isLoaded && role == "admin" ? (
          <ViewAllFeedbacks trainingId={id} />
        ) : null}

        {auth.isLoaded && role == "professional" ? (
          <ViewUserFeedback uid={auth.uid} trainingId={id} />
        ) : null}

        <div style={{ height: "100px" }} />
        {/* view user feedback */}
      </div>
    );
  } else {
    // console.log(state);
    return (
      <div className="container center">
        <CircularLoad />
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  // console.log(state, "state");
  // console.log(ownProps, "ownProps");

  const id = ownProps.match.params.id;
  const trainings = state.firestore.data.trainings;
  const training = trainings ? trainings[id] : null;

  return {
    state: state,
    id: id,
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    training: training,
    role: state.firebase.profile.role
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([{ collection: "trainings" }])
)(TrainingDetails);
