import React from "react";
import { NavLink } from "react-router-dom";
import SignedInLinks from "./SignedInLinks";
import SignedOutLinks from "./SignedOutLinks";
import { connect } from "react-redux";
import AppBar from "../utilities/AppBar";
import GuestBar from "../utilities/GuestBar";
import CircularLoad from "../loading/CircularLoad";

const Navbar = props => {
  const { auth, profile } = props;

  if (auth.isEmpty && !auth.isLoaded) return null;
  else if (auth.isEmpty && auth.isLoaded) return <GuestBar />;
  else if (!auth.isEmpty && auth.isLoaded) return <AppBar />;

  // return <div>{auth.isLoaded ? <AppBar /> : <GuestBar />}</div>;
};

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile
  };
};

export default connect(mapStateToProps)(Navbar);
