import React, { Component } from "react";
// import { createTag } from "../../store/actions/tagAction";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Popup from "reactjs-popup";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import TrainingSummary from "../trainings/TrainingSummary";
import { Link } from "react-router-dom";
import "../../style/popup.css";
import "../../style/tag.css";
import ProfileTrainingTabs from "./ProfileTrainingTabs";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import { compose } from "redux";
import moment from "moment";
import CircularLoad from "../loading/CircularLoad";

const ManageProfile = props => {
  const { currentId, authUid, profile, auth, trainings } = props;
  console.log(currentId, "current id");
  console.log(authUid, "authUid");

  if (auth.isEmpty && auth.isLoaded) return <Redirect to="/signin" />;
  else if (authUid && currentId != authUid) return <Redirect to="/" />;

  var pastTraining = [];
  var comingTraining = [];

  if (trainings) {
    pastTraining = trainings.filter(
      training =>
        training.attendees.includes(currentId) &&
        training.dateTime.toDate() < moment()
    );
    pastTraining.sort(function(a, b) {
      return b.dateTime - a.dateTime;
    });
    comingTraining = trainings.filter(
      training =>
        training.attendees.includes(currentId) &&
        training.dateTime.toDate() >= moment()
    );
    comingTraining.sort(function(a, b) {
      return a.dateTime - b.dateTime;
    });
  }

  if (profile) {
    return (
      <div className="container section project-details">
        <div className="card z-depth-0">
          <div className="card-content">
            <span className="card-title">
              {profile.firstName} {profile.lastName}
            </span>
            {auth.email ? <p>Email: {auth.email}</p> : null}
            {profile.tags ? <span>Tag(s)</span> : null}

            <div className="tags-input">
              <ul id="tags">
                {profile.tags
                  ? profile.tags.map((tag, index) => (
                      <li key={index} className="tag">
                        <span className="tag-title">{tag}</span>
                      </li>
                    ))
                  : null}
              </ul>
            </div>
            {trainings ? (
              <ProfileTrainingTabs
                pastTraining={pastTraining}
                comingTraining={comingTraining}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  } else {
    return <CircularLoad />;
  }
};

const mapStateToProps = (state, ownProps) => {
  const currentId = ownProps.match.params.id;
  // console.log(state);

  // console.log(ownProps, "ownProps");
  // console.log(state, "state");

  return {
    trainings: state.firestore.ordered.trainings,
    currentId: currentId,
    auth: state.firebase.auth,
    authUid: state.firebase.auth.uid,
    profile: state.firebase.profile
  };
};

// const mapDispatchToProps = dispatch => {
//   return {
//     // createTag: tag => dispatch(createTag(tag))
//   };
// };

// export default connect(mapStateToProps)(ManageProfile);
export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    {
      collection: "trainings",
      orderBy: ["dateTime", "asc"]
      // where: [["attendees", "array-contains", props.match.params.id]]
    }
  ])
)(ManageProfile);
