import React, { Component } from "react";
import Notifications from "./Notifications";
import ProjectList from "../projects/ProjectList";
import TrainingList from "../trainings/TrainingList";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";

import AppBar from "../utilities/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import CircularLoad from "../loading/CircularLoad";

class Dashboard extends Component {
  render() {
    const mystyle = {
      // height: "1000px",
      //backgroundColor: "DodgerBlue",
      padding: "10px",
      textAlign: "center",
      margin: "25px 100px 75px",
      paddingLeft: "300px"
    };
    const { test, projects, trainings, auth, notifications } = this.props;
    // console.log("Dashboard");
    console.log(test, "test");
    // console.log(test.auth.isLoaded, "auth.isLoaded");
    // console.log(test.profile.isEmpty, "profile.isEmpty");
    // console.log(test.profile.isLoaded, "profile.isLoaded");
    // console.log("------------------------------");

    // console.log(auth, "auth 1");
    if (auth.isEmpty && !auth.isLoaded)
      return (
        <Container>
          <div className="container" style={mystyle}>
            <CircularLoad />
          </div>
        </Container>
      );
    else if (auth.isEmpty && auth.isLoaded) return <Redirect to="/signin" />;
    else if (!auth.isEmpty && auth.isLoaded)
      // }
      return (
        <React.Fragment>
          <AppBar />
          {/* <CssBaseline /> */}
          <Container>
            <div className="row">
              <div className="col s12 m6">
                {/* <ProjectList projects={projects} /> */}
                {!trainings ? <CircularLoad /> : null}
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
          </Container>
        </React.Fragment>
      );
  }
}

const mapStateToProps = state => {
  return {
    // projects: state.firestore.ordered.projects,
    trainings: state.firestore.ordered.trainings,
    test: state,
    auth: state.firebase.auth,
    notifications: state.firestore.ordered.notifications
  };
};

export default compose(
  firestoreConnect([
    // { collection: "projects", limit: 5, orderBy: ["createdAt", "desc"] },
    { collection: "trainings", orderBy: ["createdAt", "desc"] },
    { collection: "notifications", limit: 3, orderBy: ["time", "desc"] }
  ]),
  connect(mapStateToProps)
)(Dashboard);
