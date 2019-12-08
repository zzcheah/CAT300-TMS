import React, { Component } from "react";
import { createOrganizer } from "../../store/actions/organizerAction";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Popup from "reactjs-popup";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import "../../style/popup.css";

class CreateOrganizer extends Component {
  state = {
    name: ""
  };
  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    //  console.log(this.state)
    this.props.createOrganizer(this.state);
  };

  render() {
    const { auth } = this.props;
    if (auth.isEmpty) return <Redirect to="/signin" />;

    return (
      <Popup
        trigger={
          <Fab variant="extended" aria-label="like" id="test">
            <AddIcon />
            New Organizer
          </Fab>
        }
        modal
        closeOnDocumentClick
        closeOnEscape
      >
        {close => (
          <form
            onSubmit={e => {
              this.handleSubmit(e);
              close();
            }}
            className="white"
          >
            <a className="close" onClick={close}>
              &times;
            </a>
            <div className="container">
              <h5 className="grey-text text-darken-3">Create Organizer</h5>
              <div className="input-field">
                <label htmlFor="name">New Organizer</label>
                <input type="text" id="name" onChange={this.handleChange} />
              </div>
              <div className="input-field">
                <button className="btn pink lighten-1 z-depth-0">Create</button>
              </div>
            </div>
          </form>
        )}
      </Popup>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createOrganizer: organizer => dispatch(createOrganizer(organizer))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateOrganizer);
