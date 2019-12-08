import React, { Component } from "react";
import { createTag } from "../../store/actions/tagAction";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Popup from "reactjs-popup";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import "../../style/popup.css";

class CreateTag extends Component {
  state = {
    type: ""
  };
  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    //  console.log(this.state)
    this.props.createTag(this.state);
  };

  render() {
    const { auth } = this.props;
    if (auth.isEmpty) return <Redirect to="/signin" />;

    return (
      <Popup
        trigger={
          <Fab variant="extended" aria-label="like" id="test">
            <AddIcon />
            New Tag
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
              <h5 className="grey-text text-darken-3">Create Tag</h5>
              <div className="input-field">
                <label htmlFor="type">New Tag</label>
                <input type="text" id="type" onChange={this.handleChange} />
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
    createTag: tag => dispatch(createTag(tag))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateTag);
