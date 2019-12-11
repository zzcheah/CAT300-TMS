import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { signUp } from "../../store/actions/authAction";
import Chips from "../utilities/Chips";
import DropDownMenu from "../utilities/DropDownMenu";
import { fetchTags } from "../../store/actions/trainingActions";

class SignUp extends Component {
  state = {
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    selectedTags: []
    // notification:false
  };

  componentWillMount() {
    this.props.fetchTags();
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.signUp(this.state);
  };

  tagCallback = tag => {
    const { selectedTags } = this.state;
    const { tags, test } = this.props;

    for (var i = 0; i < tags.length; i++) {
      if (tags[i] === tag) {
        tags.splice(i, 1);
        i--;
      }
    }
    selectedTags.push(tag);
    this.setState({
      selectedTags: selectedTags
    });
    console.log("added tag");
    console.log(selectedTags);
  };

  removeTag = tag => {
    const { selectedTags } = this.state;
    const { tags } = this.props;
    tags.push(tag);
    for (var i = 0; i < selectedTags.length; i++) {
      if (selectedTags[i] === tag) {
        selectedTags.splice(i, 1);
        i--;
      }
    }
    this.setState({
      selectedTags: selectedTags
    });
    console.log("removed tag");
  };

  render() {
    const { auth, authError } = this.props;
    const { selectedTags } = this.state;
    // console.log(this.props.tags);

    if (!auth.isEmpty) return <Redirect to="/" />;
    return (
      <div className="container">
        <form
          onSubmit={this.handleSubmit}
          className="white"
          style={{
            borderRadius: "7px",
            boxShadow:
              "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
          }}
        >
          <h5 className="grey-text text-darken-3">Sign Up</h5>
          <div className="input-field">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" onChange={this.handleChange} />
          </div>
          <div className="input-field">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" onChange={this.handleChange} />
          </div>
          <div className="input-field">
            <label htmlFor="firstName">First Name</label>
            <input type="text" id="firstName" onChange={this.handleChange} />
          </div>
          <div className="input-field">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" onChange={this.handleChange} />
          </div>

          <div className="input-field">
            <label htmlFor="tags">
              Select the tag(s) that you're interested in (max: 3)
            </label>
            <br />
            <br />
            {selectedTags.length < 3 ? (
              <DropDownMenu
                options={this.props.tags}
                parentCallback={this.tagCallback}
                text="Choose Tag"
              />
            ) : (
              ""
            )}
          </div>

          <Chips selectedTags={selectedTags} parentCallback={this.removeTag} />

          <div className="input-field">
            <button className="btn pink lighten-1 z-depth-0">SignUp</button>
            <div className="red-text center">
              {authError ? <p>{authError}</p> : null}
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log(state, "state");
  return {
    auth: state.firebase.auth,
    authError: state.auth.authError,
    tags: state.training.tags
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signUp: newUser => dispatch(signUp(newUser)),
    fetchTags: () => dispatch(fetchTags())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);

// export default compose(
//   connect(mapStateToProps, mapDispatchToProps),
//   firestoreConnect(["tags"])
// )(SignUp);
