import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authAction";

const SignedInLinks = props => {
  // console.log(props.uid, "lala props");
  return (
    <ul className="right">
      <li>
        <NavLink to="/manageTag">Manage Tags</NavLink>
      </li>
      <li>
        <NavLink to="/manageOrganizer">Manage Organizer</NavLink>
      </li>
      <li>
        <NavLink to="/create">New Project</NavLink>
      </li>
      <li>
        <NavLink to="/createTraining">New Training</NavLink>
      </li>
      <li>
        <a onClick={props.signOut}>Log Out</a>
      </li>
      <li>
        <NavLink
          to={"/profile/" + props.uid}
          className="btn btn-floating pink lighten-1"
        >
          {props.profile.initials}
        </NavLink>
      </li>
    </ul>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    signOut: () => dispatch(signOut())
  };
};

export default connect(null, mapDispatchToProps)(SignedInLinks);
