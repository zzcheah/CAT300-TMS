import React, { Component } from "react";
import { createFeedback } from "../../store/actions/feedbackAction";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import moment from "moment";
import { Redirect } from "react-router-dom";
import CircularLoad from "../loading/CircularLoad";
import Rating from "@material-ui/lab/Rating";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

class CreateFeedback extends Component {
  state = {
    trainingId: this.props.match.params.trainingId,
    feedback: "",
    rate: 1,
    empty: false
  };
  handleChange = e => {
    // console.log(e);
    this.setState({
      [e.target.id]: e.target.value
    });
  };
  handleRating = (e, newValue) => {
    // console.log(e);
    console.log(this.state);
    this.setState({
      [e.target.name]: newValue
    });
  };
  handleSubmit = e => {
    if (this.state.feedback == "") {
      e.preventDefault();

      this.handleAlert();
    } else {
      e.preventDefault();
      //  console.log(this.state)
      delete this.state.empty;

      this.props.createFeedback(
        this.state,
        this.props.match.params.notificationId,
        this.props.training.title
      );
      this.props.history.push("/training/" + this.state.trainingId);
    }
  };

  handleAlert = e => {
    const { empty } = this.state;
    this.setState({
      empty: !empty
    });
  };

  render() {
    // console.log(this.props);
    // console.log(this.state);
    const { auth, training, title } = this.props;
    const { empty } = this.state;

    // const [value, setValue] = React.useState(2);

    if (auth.isEmpty && auth.isLoaded) return <Redirect to="/signin" />;
    if (training) {
      return (
        <div>
          <div className="container section training-details">
            <div className="card z-depth-0">
              <div className="card-content ">
                <span className="card-title">{training.title}</span>

                {training.url ? (
                  <img
                    src={training.url}
                    alt="trainingIMG"
                    width="auto"
                    style={{ maxHeight: "300px", maxWidth: "100%" }}
                  />
                ) : (
                  <img
                    src={require("../../images/training.jpg")}
                    alt="nullImg"
                    width="auto"
                    style={{ maxHeight: "300px", maxWidth: "100%" }}
                  />
                )}

                <p>{training.description}</p>
                <p>Cost : RM{training.price}</p>
                <p>Available seats: {training.seat}</p>

                <span>Tag(s)</span>
                <div className="tags-input">
                  <ul id="tags">
                    {training.selectedTags.map((tag, index) => (
                      <li key={index} className="tag">
                        <span className="tag-title">{tag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="card-action black lighten-4 white-text">
                <div>organized by {training.organizer} </div>
                <div className="right">
                  {/* {training.dateTime > Date() ? <p>passed</p> : <p>coming</p>} */}
                  {/* {profile.trainings && profile.trainings.includes(id) ? (
                  <button
                    className="btn green lighten-1 z-depth-0 left"
                    disabled
                  >
                    Purchased
                  </button>
                ) : (
                  <PurchaseTicket
                    trainingid={id}
                    organizer={training.organizer}
                  />
                )} */}
                </div>
                <div>{training.venue} </div>

                {/* <div>{moment().diff(training.dateTime.toDate(), "days")}</div> */}
                <div>{moment(training.dateTime.toDate()).format("LLLL")}</div>

                {/* <div>{moment(training.date.toDate()).format("DDMMYYYY")}</div> */}
                {/* {console.log(
              moment(training.dateTime.toDate()).format("DDMMYYYY"),
              "training de moment"
            )} */}
              </div>
            </div>
            <div>
              {/* form */}
              <form onSubmit={this.handleSubmit} className="white">
                <h5 className="grey-text text-darken-3">Create Feedback</h5>
                How would you rate the training?
                <Box
                  display="flex"
                  flexDirection="column"
                  component="fieldset"
                  mb={3}
                  borderColor="transparent"
                >
                  <Rating
                    name="rate"
                    value={this.state.rate}
                    onChange={this.handleRating}
                    size="large"
                  />
                </Box>
                <div className="input-field">
                  {/* <label htmlFor="feedback">Feedback</label> */}
                  Add a comment about the quality of the training provided:
                  <textarea
                    id="feedback"
                    className="materialize-textarea"
                    onChange={this.handleChange}
                  ></textarea>
                </div>
                <div className="input-field">
                  <button className="btn pink lighten-1 z-depth-0">
                    Submit feedback
                  </button>
                </div>
              </form>
            </div>
          </div>
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
    } else {
      return (
        <div className="container center">
          <CircularLoad />
        </div>
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  // console.log(state, "state");
  // console.log(ownProps, "ownProps");
  const id = ownProps.match.params.trainingId;
  const trainings = state.firestore.data.trainings;
  const training = trainings ? trainings[id] : null;

  return {
    training: training,
    // title: training.title,
    auth: state.firebase.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createFeedback: (feedback, notifId, title) =>
      dispatch(createFeedback(feedback, notifId, title))
  };
};

// export default connect(mapStateToProps, mapDispatchToProps)(CreateFeedback);
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect(["trainings"])
)(CreateFeedback);
