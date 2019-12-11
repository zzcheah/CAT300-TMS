import React from "react";
import { connect } from "react-redux";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import { compose } from "redux";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";

import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";

import TrainingList from "../trainings/TrainingList";
import CircularLoad from "../loading/CircularLoad";

const useStyles = makeStyles(theme => ({
  root: {
    width: "75%"
  }
}));

function arrayContainsAnotherArray(needle, haystack) {
  for (var i = 0; i < needle.length; i++) {
    if (haystack.indexOf(needle[i]) === -1) return false;
  }
  return true;
}

const SearchResult = props => {
  const classes = useStyles();
  const { tagString, trainings } = props;
  const tags = tagString.replace("&$", "#").split("&&");
  //   console.log(tags);
  // console.log(trainings);
  var result = [];

  // if (trainings) {
  //   const now = moment();
  //   console.log("Now:", now);
  //   for (var i = 0; i < trainings.length; i++) {
  //     const daysDiff = now.diff(trainings[i].dateTime.toDate(), "days");
  //     console.log("Event Time:", trainings[i].dateTime.toDate(), daysDiff);
  //     if (daysDiff > 0) continue;
  //     console.log(daysDiff);
  //     for (var j = 0; j < trainings[i].selectedTags.length; j++) {
  //       if (tags.includes(trainings[i].selectedTags[j])) {
  //         result.push(trainings[i]);
  //         break;
  //       }
  //     }
  //   }
  //   result.sort(function(a, b) {
  //     return a.dateTime - b.dateTime;
  //   });
  // }

  if (trainings) {
    result = trainings.filter(
      training =>
        moment().diff(training.dateTime.toDate(), "days") <= 0 &&
        arrayContainsAnotherArray(tags, training.selectedTags)
    );
    result.sort(function(a, b) {
      return a.dateTime.seconds - b.dateTime.seconds;
    });
    console.log(result, "after");
  }

  if (trainings) {
    return result.length !== 0 ? (
      <Container>
        <CssBaseline />
        <div className={classes.root}>
          <div style={{ height: "20px" }} />
          <Typography variant="h6">Search Results</Typography>

          <TrainingList trainings={result} />
        </div>
      </Container>
    ) : (
      " Currently no such training. Please try other tag"
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
  return {
    trainings: state.firestore.ordered.trainings,
    tagString: ownProps.match.params.tags,
    auth: state.firebase.auth
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([{ collection: "trainings" }])
)(SearchResult);
