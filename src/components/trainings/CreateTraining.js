import React, { Component } from "react";
import { createTraining } from "../../store/actions/trainingActions";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import "../../style/tag.css";

class CreateTraining extends Component {
  state = {
    title: "",
    description: "",
    organizer: "",
    venue: "",
    imagePath: "",
    dateTime: null,

    price: null,
    seat: null,
    tags: [],
    inputSpace: "",
    repeat: false
  };

  addTags = () => {
    const { tags, inputSpace, repeat } = this.state;
    if (inputSpace) {
      if (tags.indexOf(inputSpace) > -1) {
        this.setState({
          repeat: true
        });
      } else {
        const nextState = [...tags, inputSpace];
        this.setState({
          tags: nextState,
          inputSpace: "",
          repeat: false
        });
      }
    }
  };

  // addTags = event => {
  //   const { tags } = this.state;
  //   if (event.target.value !== "") {
  //     if (tags.indexOf(event.target.value) < -1) {
  //     } else {
  //       const nextState = [...tags, event.target.value];
  //       event.target.value = "";
  //       this.setState({
  //         tags: nextState
  //       });
  //     }
  //   }
  // };

  removeTags = index => {
    const { tags } = this.state;
    const nextState = [...tags.filter(tag => tags.indexOf(tag) !== index)];
    this.setState({
      tags: nextState
    });
  };

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };
  handleSubmit = e => {
    e.preventDefault();
    delete this.state.inputSpace;
    this.props.createTraining(this.state);
    this.props.history.push("/");
  };

  render() {
    const { auth } = this.props;
    const { tags, inputSpace, repeat } = this.state;
    if (auth.isEmpty) return <Redirect to="/signin" />;

    return (
      <div className="container">
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

          <div className="input-field">
            <label htmlFor="organizer">Organizer</label>
            <input type="text" id="organizer" onChange={this.handleChange} />
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
              onChange={this.handleChange}
            />
          </div>

          <div className="input-field">
            <label htmlFor="imagePath">Image Path</label>
            <input type="text" id="imagePath" onChange={this.handleChange} />
          </div>

          <div className="input-field">
            <label htmlFor="price">Price</label>
            <input type="number" id="price" onChange={this.handleChange} />
          </div>

          <div className="input-field">
            <label htmlFor="seat">Price</label>
            <input type="number" id="seat" onChange={this.handleChange} />
          </div>

          <div className="input-field">
            <label htmlFor="tags">Tag(s)</label>
            <br />

            <input
              type="text"
              id="inputSpace"
              value={inputSpace}
              placeholder="add tags"
              //onKeyUp={this.addTags}
              onChange={this.handleChange}
            />
            <div>
              <span className="btn green" onClick={this.addTags}>
                Add
              </span>
              {repeat ? <span>{inputSpace} is already added</span> : null}
            </div>
            <div className="tags-input">
              <ul id="tags">
                {tags.map((tag, index) => (
                  <li key={index} className="tag">
                    <span className="tag-title">{tag}</span>
                    <span
                      className="tag-close-icon"
                      onClick={() => this.removeTags(index)}
                    >
                      x
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="input-field">
            <button className="btn pink lighten-1 z-depth-0">Create</button>
          </div>
        </form>
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
    createTraining: training => dispatch(createTraining(training))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateTraining);
