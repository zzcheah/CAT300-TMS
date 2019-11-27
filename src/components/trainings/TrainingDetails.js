import React from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import moment from "moment";
import "../../style/tag.css";
import { Link } from "react-router-dom";
import CircularLoad from "../loading/CircularLoad";
import PurchaseTicket from "../manage/PurchaseTicket";
import Button from "@material-ui/core/Button";

const TrainingDetails = props => {
  const { id, training, auth, profile } = props;
  // console.log(props, "props");
  // console.log(moment().format("DDMMYYYY"), "moment");

  if (auth.isEmpty && auth.isLoaded) return <Redirect to="/signin" />;
  if (training) {
    return (
      <div className="container section training-details">
        <div className="card z-depth-0">
          <div className="card-content">
            <Link to={"/editTraining/" + id} key={id}>
              <span className="right">Edit</span>
            </Link>

            <span className="card-title">{training.title}</span>

            {training.url ? (
              <img src={training.url} alt="test" />
            ) : (
              <p>null image</p>
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
          <div className="card-action grey lighten-4 grey-text">
            <div>organized by {training.organizer} </div>
            <div className="right">
              {profile.trainings && profile.trainings.includes(id) ? (
                <button className="btn green lighten-1 z-depth-0 left" disabled>
                  Purchased
                </button>
              ) : (
                <PurchaseTicket
                  trainingid={id}
                  organizer={training.organizer}
                />
              )}
            </div>
            <div>{training.venue} </div>

            <div>{moment(training.dateTime.toDate()).format("LLLL")}</div>
            {/* <div>{moment(training.date.toDate()).format("DDMMYYYY")}</div> */}
            {/* {console.log(
              moment(training.dateTime.toDate()).format("DDMMYYYY"),
              "training de moment"
            )} */}
          </div>
        </div>
      </div>
    );
  } else {
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
  // console.log(trainings, "trainings");
  // console.log(training, "training");

  return {
    id: id,
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    training: training
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(["trainings"])
)(TrainingDetails);
