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

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1, 2, 0, 3),
    margin: "0px 300px 3px 300px"
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

const ViewUserFeedback = props => {
  const classes = useStyles();
  const { feedbacks } = props;
  var userFb = [];
  // console.log(props, "props");
  // console.log(moment().format("DDMMYYYY"), "moment");
  if (feedbacks) {
    userFb = feedbacks.filter(
      fb => fb.trainingId == props.trainingId && fb.userId == props.uid
    );

    return (
      <div>
        {userFb.map(feedback => {
          return (
            <div key={feedback.id}>
              <div>
                <Paper className={classes.root}>
                  <div className={classes.avat}>
                    <Avatar className={classes.purple}>
                      {feedback.initials}
                    </Avatar>
                    <Typography variant="h5" component="h1" gutterBottom>
                      {feedback.feedback}
                    </Typography>
                    {/* <Typography variant="h5" component="h1" gutterBottom>
                      {feedback.username}
                    </Typography> */}
                  </div>

                  <Typography variant="caption" display="block">
                    {moment(feedback.createdAt.toDate()).format("LLLL")}
                  </Typography>
                </Paper>
              </div>
            </div>
          );
        })}
      </div>
    );
  } else {
    console.log("Load from viewUserFeedback");

    return (
      <div className="container center">
        <CircularLoad />
        {/* <p>lala</p> */}
      </div>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  // console.log(state, "state");

  return {
    feedbacks: state.firestore.ordered.feedbacks
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => [
    {
      collection: "feedbacks"
      // where: [
      //   ["trainingId", "==", props.trainingId],
      //   ["userId", "==", props.uid]
      // ]
    }
  ])
)(ViewUserFeedback);
