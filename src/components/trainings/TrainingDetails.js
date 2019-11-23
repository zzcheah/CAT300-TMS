import React from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import moment from "moment";
import "../../style/tag.css";
import { Link } from "react-router-dom";
import CircularLoad from "../loading/CircularLoad";

const TrainingDetails = props => {
  const { id, trainings, training, auth } = props;
  console.log(props, "props");

  if (auth.isEmpty && auth.isLoaded) return <Redirect to="/signin" />;
  if (training) {
    return (
      <div className="container section training-details">
        <div className="card z-depth-0">
          <div className="card-content">
            <Link to={"/editTraining/" + id} key={id}>
              <span className="right" onClick={() => null}>
                Edit
              </span>
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
            <div>{training.venue} </div>
            <div>{moment(training.dateTime.toDate()).format("LLLL")}</div>
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
  const id = ownProps.match.params.id;
  const trainings = state.firestore.data.trainings;
  const training = trainings ? trainings[id] : null;

  return {
    id: id,
    auth: state.firebase.auth,
    training: training,
    trainings: trainings
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(["trainings"])
)(TrainingDetails);
