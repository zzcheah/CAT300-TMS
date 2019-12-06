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

const useStyles = makeStyles(theme => ({
  root: {}
}));

const SearchResult = props => {
  const classes = useStyles();
  const { tagString, trainings } = props;
  const tags = tagString.split("&&");
  //   console.log(tags);
  // console.log(trainings);
  var result = [];
  if (trainings) {
    const now = moment();
    console.log("Now:", now);
    for (var i = 0; i < trainings.length; i++) {
      const daysDiff = now.diff(trainings[i].dateTime.toDate(), "days");
      console.log("Event Time:", trainings[i].dateTime.toDate(), daysDiff);
      if (daysDiff > 0) continue;
      console.log(daysDiff);
      for (var j = 0; j < trainings[i].selectedTags.length; j++) {
        if (tags.includes(trainings[i].selectedTags[j])) {
          result.push(trainings[i]);
          break;
        }
      }
    }
    // console.log(result);
  }

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
    ""
  );
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
  firestoreConnect([{ collection: "trainings", orderBy: ["dateTime", "asc"] }])
)(SearchResult);
