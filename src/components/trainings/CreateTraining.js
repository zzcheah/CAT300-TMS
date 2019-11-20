import React, { Component } from "react";
import {
  createTraining,
  fetchOrganizers
} from "../../store/actions/trainingActions";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import "../../style/tag.css";
import firebase, { storage } from "../../config/fbConfig";
import MultiSearchSelect from "react-search-multi-select";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";

import DropDownMenu from "../utilities/DropDownMenu";

class CreateTraining extends Component {
  state = {
    testvalues: [],
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

  componentDidMount() {
    this.props.fetchOrganizers();
  }

  orgCallback = organizer => {
    this.setState({
      organizer: organizer
    });
  };
  tagsHolder;

  saveTags = () => {
    this.setState({
      tags: this.tagsHolder
    });
    const { tags } = this.state;
  };

  test = arr => {
    this.tagsHolder = arr;

    console.log(this.tagsHolder, "tagsHolder");
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
    console.log(this.state.tags, "tags");
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

  async getTags(documents) {
    await firebase
      .firestore()
      .collection("tags")
      .get()
      .then(querySnapshot => {
        querySnapshot.docs.forEach(doc => {
          documents.push(doc.data().type);
          documents.sort();
        });
      });
  }

  render() {
    const { auth } = this.props;
    const { testvalues, values, tags, inputSpace, repeat, url } = this.state;
    var dummy = [];

    this.getTags(dummy);

    if (auth.isEmpty) return <Redirect to="/signin" />;

    return (
      <div className="container">
        <form onSubmit={this.handleSubmit} className="white">
          <h5 className="grey-text text-darken-3">Create Training</h5>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <MultiSearchSelect
              searchable={true}
              showTags={true}
              multiSelect={true}
              width="500px"
              onSelect={this.test}
              options={dummy}
            />
          </div>

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

          {/* start of input tag 333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333 */}
          <div className="input-field">
            <label htmlFor="tags">Tag(s)</label>
            <br />
            <input
              type="text"
              id="inputSpace"
              value={inputSpace}
              placeholder="add tags"
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

            {/* end of tag input 333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333*/}
            <div className="input-field">
              <button
                className="btn pink lighten-1 z-depth-0"
                onMouseEnter={this.saveTags}
              >
                Create
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    organizers: state.training.organizers
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createTraining: training => dispatch(createTraining(training)),
    fetchOrganizers: () => dispatch(fetchOrganizers())
  };
};
// polyfill(CreateTraining);
export default connect(mapStateToProps, mapDispatchToProps)(CreateTraining);

// export default compose(
//   connect(mapStateToProps, mapDispatchToProps),
//   firestoreConnect(["tags"])
// )(CreateTraining);
