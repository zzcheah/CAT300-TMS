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

class CreateFeedback extends Component {
  state = {
    trainingId: this.props.match.params.trainingId,
    feedback: "",
    trainingTitle: this.props.title,
    rate: 1
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
    e.preventDefault();
    //  console.log(this.state)

    this.props.createFeedback(
      this.state,
      this.props.match.params.notificationId
    );
    this.props.history.push("/training/" + this.state.trainingId);
  };

  render() {
    // console.log(this.props);
    // console.log(this.state);
    const { auth, training, title } = this.props;
    // const [value, setValue] = React.useState(2);

    if (auth.isEmpty && auth.isLoaded) return <Redirect to="/signin" />;
    if (training) {
      return (
        <div>
          <div className="container section training-details">
            <div className="card z-depth-0">
              <div className="card-content">
                <span className="card-title">{training.title}</span>

                {training.url ? (
                  <img
                    src={training.url}
                    alt="image"
                    width="auto"
                    style={{ maxHeight: "300px", maxWidth: "100%" }}
                  />
                ) : (
                  <img
                    src={require("../../images/training.jpg")}
                    alt="no image"
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
                <div>organized by {training.organizer} </div>
                <div>{training.venue} </div>
                <div>{moment(training.dateTime.toDate()).format("LLLL")}</div>
              </div>
              <div className="card-action black lighten-4 white-text">
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
          </div>
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
    title: training.title,
    auth: state.firebase.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createFeedback: (feedback, notifId) =>
      dispatch(createFeedback(feedback, notifId))
  };
};

// export default connect(mapStateToProps, mapDispatchToProps)(CreateFeedback);
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect(["trainings"])
)(CreateFeedback);
