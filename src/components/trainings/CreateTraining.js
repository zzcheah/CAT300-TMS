import React, { Component } from "react";
import { createTraining } from "../../store/actions/trainingActions";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import "../../style/tag.css";
import firebase, { storage } from "../../config/fbConfig";
import MultiSearchSelect from "react-search-multi-select";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { polyfill } from "react-lifecycles-compat";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";

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

  tagsHolder;

  saveTags = () => {
    this.setState({
      tags: this.tagsHolder
    });
    const { tags } = this.state;
    console.log(tags, "tags");
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
    // newnewnewnenwenwenwennewnewnewnenwenwenwennewnewnewnenwenwenwennewnewnewnenwenwenwennewnewnewnenwenwenwen
    const useStyles = makeStyles(theme => ({
      formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300
      },
      chips: {
        display: "flex",
        flexWrap: "wrap"
      },
      chip: {
        margin: 2
      },
      noLabel: {
        marginTop: theme.spacing(3)
      }
    }));

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250
        }
      }
    };

    const names = [
      "Oliver Hansen",
      "Van Henry",
      "April Tucker",
      "Ralph Hubbard",
      "Omar Alexander",
      "Carlos Abbott",
      "Miriam Wagner",
      "Bradley Wilkerson",
      "Virginia Andrews",
      "Kelly Snyder"
    ];

    // function getStyles(name, personName, theme) {
    //   return {
    //     fontWeight:
    //       personName.indexOf(name) === -1
    //         ? theme.typography.fontWeightRegular
    //         : theme.typography.fontWeightMedium
    //   };
    // }

    const testHandleChange = event => {
      const { testvalues } = this.state;

      const nextState = [...testvalues, event.target.value];
      this.setState({
        testvalues: nextState
      });
    };

    // newnewnewnenwenwenwennewnewnewnenwenwenwennewnewnewnenwenwenwennewnewnewnenwenwenwennewnewnewnenwenwenwennewnewnewnenwenwenwen

    const { auth } = this.props;
    const { testvalues, values, tags, inputSpace, repeat, url } = this.state;
    var dummy = [];

    this.getTags(dummy);

    console.log(dummy, "dummy");
    if (auth.isEmpty) return <Redirect to="/signin" />;

    return (
      <div className="container">
        <form onSubmit={this.handleSubmit} className="white">
          <h5 className="grey-text text-darken-3">Create Training</h5>

          {/* ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ */}

          {/* <FormControl>
            <InputLabel>Chip</InputLabel>
            <Select
              labelId="demo-mutiple-chip-label"
              id="demo-mutiple-chip"
              multiple
              value={testvalues}
              onChange={testHandleChange}
              input={<Input id="select-multiple-chip" />}
              renderValue={selected => (
                <div>
                  {selected.map(value => (
                    <Chip key={value} label={value} />
                  ))}
                </div>
              )}
              MenuProps={MenuProps}
            >
              {dummy.map(name => (
                <MenuItem
                  key={name}
                  value={name}
                  // style={getStyles(name, personName, theme)}
                >
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}

          {/* -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */}

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

            {/* <Select
            labelId="demo-mutiple-chip-label"
            id="inputSpace"
            multiple
            value={dummy}
            onChange={this.addTags}
            input={<Input id="select-multiple-chip" />}
            // renderValue={selected => (
            //   <div>
            //     {selected.map(value => (
            //       <Chip key={value} label={value} />
            //     ))}
            //   </div>
            // )}
            MenuProps={MenuProps}
          >
            {dummy.map(dum => (
              <MenuItem key={dum} value={dum}>
                {dum}
              </MenuItem>
            ))}
          </Select> */}

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
    auth: state.firebase.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createTraining: training => dispatch(createTraining(training))
  };
};
// polyfill(CreateTraining);
export default connect(mapStateToProps, mapDispatchToProps)(CreateTraining);

// export default compose(
//   connect(mapStateToProps, mapDispatchToProps),
//   firestoreConnect(["tags"])
// )(CreateTraining);
