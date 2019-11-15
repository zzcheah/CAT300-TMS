import React from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import moment from "moment";
import "../../style/tag.css";

const TrainingDetails = props => {
  // console.log(props)
  const { training, auth } = props;
  if (auth.isEmpty) return <Redirect to="/signin" />;
  if (training) {
    return (
      <div className="container section training-details">
        <div className="card z-depth-0">
          <div className="card-content">
            <span className="card-title">{training.title}</span>
            <p>{training.description}</p>
            <p>Cost : RM{training.price}</p>
            <p>Available seats: {training.seat}</p>

            <span>Tag(s)</span>

            <div className="tags-input">
              <ul id="tags">
                {training.tags.map((tag, index) => (
                  <li key={index} className="tag">
                    <span className="tag-title">{tag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="card-action grey lighten-4 grey-text">
            <div>organized by {training.organizer} </div>
            <div>{training.venue} </div>
            <div>{moment(training.dateTime.toDate()).format("LLLL")}</div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container center">
        <p>Loading training. . . </p>
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  const id = ownProps.match.params.id;
  const trainings = state.firestore.data.trainings;
  const training = trainings ? trainings[id] : null;
  return {
    auth: state.firebase.auth,
    training: training
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(["trainings"])
)(TrainingDetails);
