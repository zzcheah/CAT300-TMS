import React, { Component } from "react";
import {
  createTraining,
  fetchOrganizers,
  fetchTags
} from "../../store/actions/trainingActions";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import "../../style/tag.css";
import { storage } from "../../config/fbConfig";
// import firebase from "../../config/fbConfig";
// import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";

import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import DropDownMenu from "../utilities/DropDownMenu";
import Chips from "../utilities/Chips";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import CreateIcon from "@material-ui/icons/Create";

const useStyles = theme => ({
  button: {
    margin: theme.spacing(0)
  }
});

class CreateTraining extends Component {
  state = {
    // testvalues: [],
    title: "",
    description: "",
    organizer: "",
    venue: "",
    imagePath: "",
    dateTime: null,
    price: 0,
    seat: 0,
    tags: [],
    selectedTags: [],
    inputSpace: "",
    repeat: false,
    url: ""
  };

  componentWillMount() {
    this.props.fetchOrganizers();
    this.props.fetchTags();
  }

  orgCallback = organizer => {
    this.setState({
      organizer: organizer
    });
  };

  tagCallback = tag => {
    const { selectedTags } = this.state;
    const { tags } = this.props;

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
    console.log("runned");
  };

  handleChange = e => {
    this.setState({
      [e.target.id]:
        e.target.id === "dateTime" ? new Date(e.target.value) : e.target.value,
      repeat: false
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    delete this.state.inputSpace;
    delete this.state.repeat;
    this.props.createTraining(this.state);
    this.props.history.push("/");
  };

  handleImageUpload = e => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      const uploadTask = storage.ref(`images/${image.name}`).put(image);
      uploadTask.on(
        "state_changed",
        snapshot => {
          console.log(snapshot);
        },
        error => {
          console.log(error);
        },
        () => {
          storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then(x => {
              this.setState({ url: x });
            });
        }
      );
    }
  };

  render() {
    const { auth, classes } = this.props;
    const { selectedTags, url } = this.state;

    if (auth.isEmpty) return <Redirect to="/signin" />;

    return (
      <React.Fragment>
        <CssBaseline />
        <Container className="">
          <form onSubmit={this.handleSubmit} className="white">
            <h5 className="grey-text text-darken-3">Create Training</h5>

            <div className="input-field">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" onChange={this.handleChange} />
            </div>

            <div className="input-field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                className="materialize-textarea"
                onChange={this.handleChange}
              ></textarea>
            </div>

            <div>
              <label htmlFor="organizer">Organizer</label>
              <DropDownMenu
                options={this.props.organizers}
                parentCallback={this.orgCallback}
                text="Choose Organizer"
              />
            </div>

            <div className="input-field">
              <label htmlFor="venue">Venue</label>
              <input type="text" id="venue" onChange={this.handleChange} />
            </div>

            <div className="input-field">
              <label htmlFor="dateTime">Date and Time</label>
              <br />
              <br />
              <input
                type="datetime-local"
                id="dateTime"
                // min="2018-06-07T00:00"
                // max="2020-06-14T00:00"
                onChange={this.handleChange}
              />
            </div>

            <img
              src={`${url}` || "https://img.mobiscroll.com/demos/fruit-4.png"}
              alt="placeholder"
            />

            <div className="input-field">
              <label htmlFor="imagePath">Image Path</label>
              <input
                type="file"
                id="imagePath"
                onChange={this.handleImageUpload}
              />
            </div>

            <div className="input-field">
              <label htmlFor="price">Price</label>
              <input type="number" id="price" onChange={this.handleChange} />
            </div>

            <div className="input-field">
              <label htmlFor="seat">Seat</label>
              <input type="number" id="seat" onChange={this.handleChange} />
            </div>

            <div className="input-field">
              <label htmlFor="tags">Tag(s)</label>
              <DropDownMenu
                options={this.props.tags}
                parentCallback={this.tagCallback}
                text="Choose Tag"
              />
            </div>

            <Chips
              selectedTags={selectedTags}
              parentCallback={this.removeTag}
            />

            <div className="input-field">
              <Button
                variant="contained"
                color="primary"
                size="large"
                className={classes.button}
                startIcon={<CreateIcon />}
              >
                Create
              </Button>
            </div>
          </form>
        </Container>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    organizers: state.training.organizers,
    tags: state.training.tags
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createTraining: training => dispatch(createTraining(training)),
    fetchOrganizers: () => dispatch(fetchOrganizers()),
    fetchTags: () => dispatch(fetchTags())
  };
};
// polyfill(CreateTraining);
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(useStyles)
)(CreateTraining);

// export default compose(
//   connect(mapStateToProps, mapDispatchToProps),
//   firestoreConnect(["tags"])
// )(CreateTraining);
