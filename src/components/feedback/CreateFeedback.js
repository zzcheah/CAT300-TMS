import React, { Component } from "react";
import { createFeedback } from "../../store/actions/feedbackAction";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import moment from "moment";

import { Redirect } from "react-router-dom";
import TrainingDetails from "../trainings/TrainingDetails";
import CircularLoad from "../loading/CircularLoad";

class CreateFeedback extends Component {
  state = {
    trainingId: this.props.match.params.trainingId,
    feedback: "",
    // notificationId: this.props.match.params.notificationId,
    trainingTitle: this.props.match.params.trainingTitle
  };
  handleChange = e => {
    console.log(this.state);
    this.setState({
      [e.target.id]: e.target.value
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
    const { auth, test, training } = this.props;

    if (auth.isEmpty && auth.isLoaded) return <Redirect to="/signin" />;
    if (training) {
      return (
        <div>
          <div className="container section training-details">
            <div className="card z-depth-0">
              <div className="card-content">
                <span className="card-title">{training.title}</span>

                {training.url ? (
                  <img src={training.url} alt="test" />
                ) : (
                  <p>null image</p>
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
              <div className="card-action grey lighten-4 grey-text">
                <form onSubmit={this.handleSubmit} className="white">
                  <h5 className="grey-text text-darken-3">Create Feedback</h5>

                  <div className="input-field">
                    <label htmlFor="feedback">Feedback</label>
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
    auth: state.firebase.auth
    // notificationId: ownProps.match.params.notificationId
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
