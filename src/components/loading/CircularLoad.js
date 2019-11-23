import React, { Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    "& > * + *": {
      marginLeft: theme.spacing(2)
    }
  }
}));

const CircularLoad = props => {
  const classes = useStyles();
  const { auth } = props;

  // if (auth.isEmpty && auth.isLoaded) return <Redirect to="/signin" />;
  // else if (!auth.isEmpty && auth.isLoaded) return <Redirect to="/" />;

  return (
    <div className={classes.root}>
      <CircularProgress color="secondary" size="200px" />
    </div>
  );
};

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth
  };
};

export default connect(mapStateToProps)(CircularLoad);
