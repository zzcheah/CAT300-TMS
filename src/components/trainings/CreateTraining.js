import React, { Component } from "react";
import {
  createTraining,
  fetchOrganizers,
  fetchTags
} from "../../store/actions/trainingActions";
import { connect } from "react-redux";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import { Redirect } from "react-router-dom";
import "../../style/tag.css";
import { storage } from "../../config/fbConfig";
// import firebase from "../../config/fbConfig";
// import { firestoreConnect } from "react-redux-firebase";

import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import DropDownMenu from "../utilities/DropDownMenu";
import Chips from "../utilities/Chips";
import Button from "@material-ui/core/Button";
import CreateIcon from "@material-ui/icons/Create";

import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";

import CircularLoad from "../loading/CircularLoad";
import { Box } from "@material-ui/core";

const useStyles = theme => ({
  button: {
    margin: theme.spacing(0)
  }
});

class CreateTraining extends Component {
  state = {
    title: "",
    description: "",
    organizer: "",
    venue: "",
    imagePath: "",
    dateTime: null,
    price: 0,
    seat: 0,
    selectedTags: [],
    empty: false,
    url: ""
  };

  componentWillMount() {
    this.props.fetchOrganizers();

    this.props.fetchTags();
  }

  componentWillUnmount() {
    delete this.state.training;
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
    console.log("removed tag");
  };

  handleChange = e => {
    this.setState({
      [e.target.id]:
        e.target.id === "dateTime" ? new Date(e.target.value) : e.target.value
    });
  };

  handleAlert = e => {
    const { empty } = this.state;
    this.setState({
      empty: !empty
    });
  };

  handleSubmit = e => {
    if (
      this.state.title == "" ||
      this.state.description == "" ||
      this.state.dateTime == null ||
      this.state.organizer == "" ||
      this.state.price == 0 ||
      this.state.seat == "" ||
      this.state.selectedTags == []
    ) {
      this.handleAlert();
    } else {
      e.preventDefault();
      delete this.state.empty;
      this.props.createTraining(this.state);
      this.props.history.push("/");
    }
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
    const mystyle = {
      padding: "10px",
      textAlign: "center",
      margin: "25px 100px 75px",
      paddingLeft: "300px"
    };
    const { auth, classes, role } = this.props;
    const { selectedTags, url, empty } = this.state;
    console.log(this.props);

    if (auth.isEmpty && auth.isLoaded) return <Redirect to="/signin" />;
    else if (role == "professional") return <Redirect to="/" />;
    else if (role == "admin")
      return (
        <React.Fragment>
          <CssBaseline />
          <Container className="">
            <form
              onSubmit={this.handleSubmit}
              className="white"
              style={{
                borderRadius: "7px",
                boxShadow:
                  "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
              }}
            >
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
                <br />
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
                src={`${url}` || require("../../images/noImage.png")}
                alt="placeholder"
                width="50%"
              />

              <div className="input-field">
                {/* <label htmlFor="imagePath"><br/>Image Path</label> */}
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
                <label htmlFor="seat">Total Seats</label>
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
                justify="left"
              />

              <div className="input-field">
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  className={classes.button}
                  startIcon={<CreateIcon />}
                  onClick={this.handleSubmit}
                >
                  Create
                </Button>
              </div>
            </form>
            <Box mb={6} borderColor="transparent" />
          </Container>

          <Dialog
            onClose={this.handleAlert}
            aria-labelledby="customized-dialog-title"
            open={empty}
          >
            <DialogTitle
              id="customized-dialog-title"
              onClose={this.handleAlert}
            >
              <Typography gutterBottom color="error">
                Alert
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Typography gutterBottom color="error">
                Please fill in every field.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={this.handleAlert} color="secondary">
                ok
              </Button>
            </DialogActions>
          </Dialog>
        </React.Fragment>
      );
    else
      return (
        <Container>
          <div className="container" style={mystyle}>
            <CircularLoad />
          </div>
        </Container>
      );
  }
}

const mapStateToProps = state => {
  console.log(state, "state");
  return {
    auth: state.firebase.auth,
    organizers: state.training.organizers,
    tags: state.training.tags,
    role: state.firebase.profile.role
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
