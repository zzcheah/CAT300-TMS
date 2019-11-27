import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { compose } from "redux";
// import { Container } from "@material-ui/core";
import TitleBar from "../utilities/AppBar";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { firestoreConnect } from "react-redux-firebase";

import FeatureMatrix from "./FeatureMatrix";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `nav-tab-${index}`,
    "aria-controls": `nav-tabpanel-${index}`
  };
}

function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={event => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

const useStyles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  }
});

class Recommendation extends React.Component {
  state = {
    value: 0
    // userRows: [],
    // trainingRows: []
  };

  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
  };

  createData(id, name, vector) {
    return { id, name, vector };
  }

  handleClick = () => {
    console.log("presssed");
    var xhr = new XMLHttpRequest();

    // get a callback when the server responds
    xhr.addEventListener("load", () => {
      // update the state of the component with the result here
      console.log(xhr.responseText);
    });
    // open the request with the verb and the url
    xhr.open(
      "GET",
      "https://us-central1-training-management-syst-79d28.cloudfunctions.net/refreshFM"
    );
    // send the request
    xhr.send();
  };

  trainingRows = [];
  userRows = [];

  render() {
    const { classes, organizers, tags, users, trainings } = this.props;
    const { value } = this.state;

    if (
      organizers &&
      tags &&
      users &&
      trainings &&
      value === 0 &&
      this.trainingRows.length === 0 &&
      this.userRows.length === 0
    ) {
      console.log("read!");
      trainings.map(training => {
        const vector = [];
        for (var i = 0; i < tags.length; i++) {
          if (training.selectedTags.includes(tags[i].type)) vector.push(true);
          else vector.push(false);
        }

        for (i = 0; i < organizers.length; i++) {
          if (training.organizer === organizers[i].name) vector.push(true);
          else vector.push(false);
        }
        this.trainingRows.push(
          this.createData(training.id, training.title, vector)
        );
        return null;
      });

      users.map(user => {
        const vector = [];
        for (var i = 0; i < tags.length; i++) {
          if (user.tags.includes(tags[i].type)) vector.push(true);
          else vector.push(false);
        }
        if (user.organizers) {
          for (i = 0; i < organizers.length; i++) {
            if (user.organizers.includes(organizers[i].name)) vector.push(true);
            else vector.push(false);
          }
        } else {
          for (i = 0; i < organizers.length; i++) {
            vector.push(false);
          }
        }

        this.userRows.push(this.createData(user.id, user.firstName, vector));
        return null;
      });
    }

    return (
      <React.Fragment>
        <TitleBar />
        <CssBaseline />
        <div className={classes.root}>
          <AppBar position="static" color="inherit">
            <Tabs
              variant="fullWidth"
              value={value}
              onChange={this.handleChange}
              aria-label="nav tabs example"
            >
              <LinkTab
                label="Feature Matrix"
                href="/drafts"
                {...a11yProps(0)}
              />
              <LinkTab label="Page Two" href="/trash" {...a11yProps(1)} />
              <LinkTab label="Page Three" href="/spam" {...a11yProps(2)} />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            {organizers && tags && users && trainings && value === 0 ? (
              <FeatureMatrix
                tags={tags}
                organizers={organizers}
                userRows={this.userRows}
                trainingRows={this.trainingRows}
              />
            ) : (
              ""
            )}
            <br />
          </TabPanel>
          <TabPanel value={value} index={1}>
            {value === 1 ? (
              <div>
                {this.trainingRows.map((trainingRow, index) => (
                  <div key={index}>
                    {trainingRow.id}
                    <br />
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}
          </TabPanel>
          <TabPanel value={value} index={2}>
            {value === 2 ? <div>{console.log("test")}</div> : ""}
            <Fab color="primary" aria-label="add" onClick={this.handleClick}>
              <AddIcon />
            </Fab>
          </TabPanel>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    organizers: state.firestore.ordered.organizers,
    tags: state.firestore.ordered.tags,
    users: state.firestore.ordered.users,
    trainings: state.firestore.ordered.trainings
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(useStyles),
  firestoreConnect([
    { collection: "organizers", orderBy: ["name", "asc"] },
    { collection: "tags", orderBy: ["type", "asc"] },
    { collection: "users", orderBy: ["firstName", "asc"] },
    { collection: "trainings", orderBy: ["title", "asc"] }
  ])
)(Recommendation);
