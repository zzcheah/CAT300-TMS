import React from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import moment from "moment";

const List = ({ items }) => (
  <div className="row ">
    {items.map((item, i) => (
      <div>
        <div key={i} className="col s1 waves-effect waves-light btn">
          {item}
        </div>
        <div className="col offset-s0 m0 l0"></div>
      </div>
    ))}
  </div>
);

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
            <div className="card">
              <span className="card-title">Tag(s)</span>
              <div className="card_action">
                <List items={training.tag} />
              </div>
            </div>
          </div>
          <div className="card-action grey lighten-4 grey-text">
            <div>organized by {training.organizer} </div>
            <div>{training.venue} </div>
            <div>{moment(training.createdAt.toDate()).calendar()}</div>
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
