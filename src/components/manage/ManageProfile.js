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

class ManageProfile extends Component {
  state = {
    type: ""
  };
  //   handleChange = e => {
  //     this.setState({
  //       [e.target.id]: e.target.value
  //     });
  //   };
  //   handleSubmit = e => {
  //     e.preventDefault();
  //     //  console.log(this.state)
  //     this.props.createTag(this.state);
  //   };

  render() {
    const { currentId, authUid, profile, auth, trainings } = this.props;
    console.log(trainings, "check");

    if (auth.isEmpty && auth.isLoaded) return <Redirect to="/signin" />;
    else if (currentId != authUid) return <Redirect to="/" />;

    return (
      <div className="container section project-details">
        <div className="card z-depth-0">
          <div className="card-content">
            <span className="card-title">
              {profile.firstName} {profile.lastName}
            </span>
            <p>Email: {auth.email}</p>
            <span>Tag(s)</span>
            <div className="tags-input">
              <ul id="tags">
                {profile.tags.map((tag, index) => (
                  <li key={index} className="tag">
                    <span className="tag-title">{tag}</span>
                  </li>
                ))}
              </ul>
            </div>
            {profile.trainings ? (
              <ProfileTrainingTabs trainings={trainings} />
            ) : null}
            {/* <span>Ticket(s) purchased</span> */}
            {/* {profile.trainings &&
              profile.trainings.map(trainingId => {
                return (
                  <Link to={"/training/" + trainingId} key={trainingId}>
                    <TrainingSummary training={trainings[trainingId]} />
                  </Link>
                  //   <p>{trainings[trainingId].title}</p>
                );
              })} */}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const currentId = ownProps.match.params.id;
  console.log(ownProps, "ownProps");
  console.log(state, "state");

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
  firestoreConnect(props => [
    {
      collection: "trainings",
      orderBy: ["dateTime", "asc"],
      where: [["attendees", "array-contains", props.match.params.id]]
    }
  ])
)(ManageProfile);
