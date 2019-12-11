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
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import { deepOrange, deepPurple } from "@material-ui/core/colors";
import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1, 2, 0, 3),
    margin: "0px 300px 20px 300px"
  },
  avat: {
    display: "flex",
    "& > *": {
      margin: theme.spacing(1)
    }
  },
  orange: {
    color: "#fff",
    backgroundColor: deepOrange[500]
  },
  purple: {
    color: "#fff",
    backgroundColor: deepPurple[500]
  }
}));

const ViewAllFeedbacks = props => {
  const classes = useStyles();

  const { feedbacks, trainingId } = props;
  var fback = [];

  if (feedbacks) {
    fback = feedbacks.filter(fb => fb.trainingId == trainingId);
    fback.sort(function(a, b) {
      return a.createdAt.seconds - b.createdAt.seconds;
    });
  }

  // console.log(props, "props");
  // console.log(moment().format("DDMMYYYY"), "moment");
  if (feedbacks) {
    return (
      <div>
        {fback.map(feedback => {
          return (
            <div key={feedback.id}>
              <Paper className={classes.root} elevation={8}>
                <div className={classes.avat}>
                  <Avatar className={classes.purple}>
                    {feedback.initials}
                  </Avatar>

                  <Typography variant="h5" component="h1" gutterBottom>
                    <Rating
                      name="rate"
                      value={feedback.rate}
                      size="large"
                      readOnly
                    />
                    <br />
                    {feedback.feedback}
                  </Typography>
                </div>

                <Typography variant="caption" display="block">
                  {moment(feedback.createdAt.toDate()).format("LLLL")}
                </Typography>
              </Paper>
            </div>
          );
        })}
      </div>
    );
  } else
    return (
      <div className="container center">
        <CircularLoad />
      </div>
    );
};

const mapStateToProps = (state, ownProps) => {
  console.log(ownProps, "ownProps");
  // console.log(ownProps, "ownProps");

  // console.log(trainings, "trainings");
  // console.log(training, "training");

  return {
    feedbacks: state.firestore.ordered.feedbacks,
    trainingId: ownProps.trainingId
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => [
    {
      collection: "feedbacks"
      // orderBy: ["createdAt", "asc"],
      // where: [["trainingId", "==", props.trainingId]]
    }
  ])
)(ViewAllFeedbacks);
