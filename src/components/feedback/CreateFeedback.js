import React, { Component } from "react";
// import { createProject } from "../../store/actions/projectActions";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import moment from "moment";

import { Redirect } from "react-router-dom";
import TrainingDetails from "../trainings/TrainingDetails";
import CircularLoad from "../loading/CircularLoad";

class CreateFeedback extends Component {
  state = {
    title: "",
    feedback: ""
  };
  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };
  //   handleSubmit = e => {
  //     e.preventDefault();
  //     //  console.log(this.state)
  //     this.props.createProject(this.state);
  //     this.props.history.push("/");
  //   };

  render() {
    const { auth, test, trainingId, training } = this.props;
    // console.log("CreateFeedback");
    // // console.log(test.auth.isEmpty, "auth.isEmpty");
    // console.log(test.auth.isLoaded, "auth.isLoaded");
    // // console.log(test.profile.isEmpty, "profile.isEmpty");
    // console.log(test.profile.isLoaded, "profile.isLoaded");
    // console.log("------------------------------");
    // console.log(test);

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
  console.log(state, "state");
  console.log(ownProps, "ownProps");
  const id = ownProps.match.params.trainingId;
  const trainings = state.firestore.data.trainings;
  const training = trainings ? trainings[id] : null;

  return {
    training: training,
    auth: state.firebase.auth,
    test: state.firebase,
    trainingId: ownProps.match.params.trainingId
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // createProject: project => dispatch(createProject(project))
  };
};

// export default connect(mapStateToProps, mapDispatchToProps)(CreateFeedback);
export default compose(
  connect(mapStateToProps),
  firestoreConnect(["trainings"])
)(CreateFeedback);
