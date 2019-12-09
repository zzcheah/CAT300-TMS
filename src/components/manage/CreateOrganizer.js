import React, { Component } from "react";
import { createOrganizer } from "../../store/actions/organizerAction";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Popup from "reactjs-popup";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import "../../style/popup.css";

class CreateOrganizer extends Component {
  state = {
    name: "",
    empty: false
  };
  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };
  handleSubmit = e => {
    if (this.state.name == "") {
      this.handleAlert();
    } else {
      e.preventDefault();
      delete this.state.empty;
      //  console.log(this.state)
      this.props.createOrganizer(this.state);
    }
  };
  handleAlert = e => {
    const { empty } = this.state;
    this.setState({
      empty: !empty
    });
  };

  render() {
    const { auth } = this.props;
    const { empty } = this.state;
    if (auth.isEmpty) return <Redirect to="/signin" />;

    return (
      <div>
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
                  <button className="btn pink lighten-1 z-depth-0">
                    Create
                  </button>
                </div>
              </div>
            </form>
          )}
        </Popup>
        <Dialog
          onClose={this.handleAlert}
          aria-labelledby="customized-dialog-title"
          open={empty}
        >
          <DialogTitle id="customized-dialog-title" onClose={this.handleAlert}>
            <Typography gutterBottom color="error">
              Alert
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Typography gutterBottom color="error">
              Please fill in type of tag.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={this.handleAlert} color="secondary">
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
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
