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
import { firestoreConnect } from "react-redux-firebase";

import {
  fetchOrganizers,
  fetchTags
} from "../../store/actions/trainingActions";

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
  };

  componentWillMount() {
    this.props.fetchOrganizers();
    this.props.fetchTags();
  }

  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
  };

  render() {
    const { classes, organizers, tags, users } = this.props;
    const { value } = this.state;

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
            <FeatureMatrix tags={tags} organizers={organizers} />
            {organizers.map((organizer, index) => (
              <div>
                {index} {organizer}
              </div>
            ))}
            <br />
            {tags.map((tag, index) => (
              <div>
                {index} {tag}
              </div>
            ))}
            <br />
            Number of features: {organizers.length + tags.length}
            <br />
            <br />
            <div>
              {users
                ? users.map((user, index) => (
                    <div>
                      {index} {user.firstName} {user.lastName}
                    </div>
                  ))
                : ""}
            </div>
            <br />
          </TabPanel>
          <TabPanel value={value} index={1}>
            Page Two
          </TabPanel>
          <TabPanel value={value} index={2}>
            Page Three
          </TabPanel>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    organizers: state.training.organizers,
    tags: state.training.tags,
    users: state.firestore.ordered.users
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchOrganizers: () => dispatch(fetchOrganizers()),
    fetchTags: () => dispatch(fetchTags())
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(useStyles),
  firestoreConnect([{ collection: "users", orderBy: ["firstName", "asc"] }])
)(Recommendation);
