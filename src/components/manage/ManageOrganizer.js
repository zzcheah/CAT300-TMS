import React from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import "../../style/tag.css";
import CreateOrganizer from "./CreateOrganizer";
import "../../style/listDisplay.css";
import CircularLoad from "../loading/CircularLoad";

const ManageOrganizer = props => {
  const { organizers, auth, role } = props;
  console.log(organizers, "organizers");

  if (auth.isEmpty && auth.isLoaded) return <Redirect to="/signin" />;
  else if (role == "professional") return <Redirect to="/" />;
  else if (role == "admin" && organizers) {
    return (
      <div>
        <div className="container center">
          <div className="row">
            {organizers.map(organizer => {
              return (
                <div className="card z-depth-0 " key={organizer.name}>
                  <div className="card-content grey-text text-darken-3">
                    <span className="card-title">{organizer.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <CreateOrganizer />
      </div>
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
    auth: state.firebase.auth,
    organizers: state.firestore.ordered.organizers,
    role: state.firebase.profile.role
  };
};

// export default compose(
//   connect(mapStateToProps),
//   firestoreConnect(["organizers"])
// )(ManageOrganizer);

export default compose(
  firestoreConnect([{ collection: "organizers", orderBy: ["name", "asc"] }]),
  connect(mapStateToProps)
)(ManageOrganizer);
