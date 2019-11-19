import React, { Component } from "react";
import { createTraining } from "../../store/actions/trainingActions";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import "../../style/tag.css";
import { storage } from "../../config/fbConfig";

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
    tags: [],
    inputSpace: "",
    repeat: false,
    url: ""
  };

  addTags = () => {
    const { tags, inputSpace, dateTime, url } = this.state;

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
          repeat: false,
          dateTime: new Date(dateTime)
        });
      }
    }
    console.log(url, "url");
  };

  removeTags = index => {
    const { tags } = this.state;
    const nextState = [...tags.filter(tag => tags.indexOf(tag) !== index)];
    this.setState({
      tags: nextState
    });
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
    const { auth } = this.props;
    const { tags, inputSpace, repeat, url } = this.state;
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
              <span className="btn green z-depth-0" onClick={this.addTags}>
                Add
              </span>
              {repeat ? (
                <span className="red-text"> {inputSpace} is already added</span>
              ) : null}
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
