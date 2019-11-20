import React, { Component } from "react";
import Notifications from "./Notifications";
import ProjectList from "../projects/ProjectList";
import TrainingList from "../trainings/TrainingList";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";

class Dashboard extends Component {
  render() {
    const { projects, trainings, auth, notifications } = this.props;
    if (auth.isEmpty) return <Redirect to="/signin" />;

    return (
      <div className="dashboard container">
        <div className="row">
          <div className="col s12 m6">
            <ProjectList projects={projects} />
            <TrainingList trainings={trainings} />
          </div>
          <div className="col s12 m5 offset-m1">
            <img
              src={require("../../images/ironman.jpg")}
              alt="ironman"
              width="50"
              height="60"
            />
            <img
              src="https://img.mobiscroll.com/demos/fruit-4.png"
              alt="strawberry"
            />
            <Notifications notifications={notifications} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    projects: state.firestore.ordered.projects,
    trainings: state.firestore.ordered.trainings,
    auth: state.firebase.auth,
    notifications: state.firestore.ordered.notifications
  };
};

export default compose(
  firestoreConnect([
    { collection: "projects", limit: 5, orderBy: ["createdAt", "desc"] },
    { collection: "trainings", orderBy: ["createdAt", "desc"] },
    { collection: "notifications", limit: 3, orderBy: ["time", "desc"] }
  ]),
  connect(mapStateToProps)
)(Dashboard);
