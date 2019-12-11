import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { compose } from "redux";
import { Container } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { firestoreConnect } from "react-redux-firebase";
import MenuList from "../utilities/MenuList";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import WordCloud from "./WordCloud";
import RatingStatistics from "./RatingStatistics";
import FeedbackList from "./FeedbackList";

import { testCloud } from "../../store/actions/trainingActions";
import CircularLoad from "../loading/CircularLoad";
import { Redirect } from "react-router-dom";

const useStyles = theme => ({
  root: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.paper
    backgroundColor: "#eeeeee",
    position: "absolute",
    top: theme.spacing(8),
    right: 0,
    bottom: 0,
    left: 0
  }
});

class FeedbackAnalysis extends React.Component {
  state = {
    currentTraining: -1,
    currentFB: []
  };

  componentWillMount() {
    // this.props.testCloud();
  }

  createData(id, name, vector) {
    return { id, name, vector };
  }

  render() {
    const { classes, feedbacks, role, auth } = this.props;

    const { currentTraining, currentFB } = this.state;

    const trainingsData = [];

    const changeCurrentTraining = id => {
      var i;
      for (i = 0; i < trainingsData.length; i++) {
        if (id === trainingsData[i].id) {
          break;
        }
      }
      if (i === trainingsData.length) {
        this.setState({ currentTraining: -1 });
      } else {
        var temp = [];
        feedbacks.filter(fb => fb.trainingId === id).map(fb => temp.push(fb));
        this.setState({ currentTraining: i, currentFB: temp });
      }
    };

    if (feedbacks) {
      var temp = [];
      feedbacks.map(data => {
        if (!temp.includes(data.trainingId)) {
          temp.push(data.trainingId);
          trainingsData.push({
            id: data.trainingId,
            text: data.trainingTitle
          });
        }
        return null;
      });
    }
    if (auth.isEmpty && auth.isLoaded) return <Redirect to="/signin" />;
    else if (role == "professional") return <Redirect to="/" />;
    else if (role == "admin")
      return (
        <React.Fragment>
          <CssBaseline />
          <div className={classes.root}>
            <AppBar position="static" color="inherit">
              <Container>
                <Toolbar>
                  <Typography className={classes.title} variant="h5" noWrap>
                    Feedback Analysis
                  </Typography>
                </Toolbar>
              </Container>
            </AppBar>
            <Container>
              {trainingsData.length !== 0 ? (
                <div>
                  <div style={{ height: "20px" }} />
                  <Typography className={classes.title} variant="h5" noWrap>
                    Select Training
                  </Typography>
                  <div style={{ height: "20px" }} />
                  <MenuList
                    options={trainingsData}
                    parentCallback={changeCurrentTraining}
                    text="Select Training"
                  />
                  <div style={{ height: "10px" }} />

                  {currentTraining !== -1 ? (
                    <div>
                      <div>
                        <hr />
                        <div style={{ height: "10px" }} />
                        <Typography
                          className={classes.title}
                          variant="h6"
                          noWrap
                        >
                          Training Analysis:
                        </Typography>
                        <div style={{ height: "10px" }} />
                      </div>

                      <div className="row">
                        <div className="col s3 ">
                          <Typography
                            className={classes.title}
                            variant="h6"
                            noWrap
                          >
                            Rating: <br />
                            <div style={{ height: "10px" }} />
                          </Typography>
                          <RatingStatistics feedbacks={currentFB} />
                        </div>

                        <div className="col s5">
                          <Typography
                            className={classes.title}
                            variant="h6"
                            noWrap
                            style={{ paddingLeft: "25px" }}
                          >
                            Word Cloud: <br />
                            <div style={{ height: "40px" }} />
                          </Typography>
                          {/* <div className="col s12 m5 offset-m1"> */}
                          <WordCloud id={trainingsData[currentTraining].id} />
                        </div>

                        <div className="col s4 ">
                          {/* <div style={{ height: "10px" }} />
                          <hr />
                          <div style={{ height: "10px" }} /> */}
                          <Typography
                            className={classes.title}
                            variant="h6"
                            noWrap
                          >
                            Feedback: <br />
                            <div style={{ height: "10px" }} />
                          </Typography>
                          <FeedbackList feedbacks={currentFB} />
                        </div>
                      </div>
                      <div style={{ height: "10px" }} />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
            </Container>
          </div>
        </React.Fragment>
      );
    else {
      return (
        <div className="container center">
          <CircularLoad />
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    feedbacks: state.firestore.ordered.feedbacks,
    auth: state.firebase.auth,
    role: state.firebase.profile.role
  };
};

const mapDispatchToProps = dispatch => {
  return { testCloud: () => dispatch(testCloud()) };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(useStyles),
  firestoreConnect([{ collection: "feedbacks" }])
)(FeedbackAnalysis);
