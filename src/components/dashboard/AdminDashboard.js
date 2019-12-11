import React, { Component } from "react";
import TrainingList from "../trainings/TrainingList";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import moment from "moment";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

import CircularLoad from "../loading/CircularLoad";
// import { testFM, testCloud } from "../../store/actions/trainingActions";

class AdminDashboard extends Component {
  componentWillMount() {
    // this.props.testFM();
  }

  render() {
    const mystyle = {
      padding: "10px",
      textAlign: "center",
      margin: "25px 100px 75px",
      paddingLeft: "300px"
    };
    const { trainings, auth, role } = this.props;
    // console.log(test.firestore.ordered, "state from render");

    // console.log("AdminDashboard");
    // console.log(test, "test");
    // console.log(test.auth.isLoaded, "auth.isLoaded");
    // console.log(test.profile.isEmpty, "profile.isEmpty");
    // console.log(test.profile.isLoaded, "profile.isLoaded");
    // console.log("------------------------------");

    // console.log(auth, "auth 1");
    var comingTraining = [];
    var pastTraining = [];

    // if (trainings) {
    //   comingTraining = trainings.filter(
    //     training => training.dateTime.toDate() >= moment()
    //   );
    //   comingTraining.sort(function(a, b) {
    //     return a.dateTime.seconds - b.dateTime.seconds;
    //   });
    // }

    if (trainings) {
      comingTraining = trainings.filter(
        training => training.dateTime.toDate() >= moment()
      );

      pastTraining = trainings.filter(
        training => training.dateTime.toDate() < moment()
      );

      comingTraining.sort(function(a, b) {
        return a.dateTime.seconds - b.dateTime.seconds;
      });
      pastTraining.sort(function(a, b) {
        return b.dateTime.seconds - a.dateTime.seconds;
      });
    }

    if (auth.isEmpty && !auth.isLoaded)
      return (
        <Container>
          <div className="container" style={mystyle}>
            <CircularLoad />
          </div>
        </Container>
      );
    else if (auth.isEmpty && auth.isLoaded) return <Redirect to="/signin" />;
    else if (!auth.isEmpty && auth.isLoaded && role && role == "admin")
      // }
      return (
        <React.Fragment>
          {/* <AppBar /> */}

          {/* <CssBaseline /> */}
          <Container style={{ zIndex: -1 }}>
            <div className="row">
              <div className="col s12 m6">
                <Typography variant="h6">
                  <br />
                  Coming Training
                </Typography>

                {!trainings ? <CircularLoad /> : null}
                <TrainingList trainings={comingTraining} />
              </div>

              <div className="col s12 m6">
                <Typography variant="h6">
                  <br />
                  Past Training
                </Typography>

                {!trainings ? <CircularLoad /> : null}
                <TrainingList trainings={pastTraining} />
              </div>
            </div>
          </Container>
        </React.Fragment>
      );
    else {
      return (
        <Container>
          <div className="container" style={mystyle}>
            <CircularLoad />
          </div>
        </Container>
      );
    }
  }
}

const mapStateToProps = state => {
  console.log(state, "state from map");

  return {
    trainings: state.firestore.ordered.trainings,
    role: state.firebase.profile.role,
    auth: state.firebase.auth
  };
};

// const mapDispatchToProps = dispatch => {
//   return {
//     testFM: () => dispatch(testFM()),
//     testCloud: () => dispatch(testCloud())
//   };
// };

export default compose(
  firestoreConnect([{ collection: "trainings" }]),
  connect(mapStateToProps)
)(AdminDashboard);
