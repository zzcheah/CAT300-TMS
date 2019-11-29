import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { compose } from "redux";
import { Container } from "@material-ui/core";
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
import MenuList from "../utilities/MenuList";
import TrainingList from "../trainings/TrainingList";

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
    value: 0,
    currentUser: -1,
    recTrainings: []
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
      "POST",
      "https://us-central1-training-management-syst-79d28.cloudfunctions.net/refreshFM"
    );
    // send the request
    xhr.send();
  };

  render() {
    const {
      classes,
      organizers,
      tags,
      users,
      trainings,
      userRows,
      trainingRows
    } = this.props;
    const { value, currentUser, recTrainings } = this.state;

    const uRows = [];
    const tRows = [];
    const usersData = [];

    const changeCurrentUser = id => {
      var i;
      for (i = 0; i < usersData.length; i++) {
        if (id === usersData[i].id) {
          break;
        }
      }
      if (i === usersData.length) {
        this.setState({ currentUser: -1 });
      } else {
        var temp = [];
        usersData[i].recommendation.forEach(rec => {
          trainings.map(data => {
            if (data.id === rec) {
              temp.push(data);
            }
          });
        });
        this.setState({ currentUser: i, recTrainings: temp });
      }
    };

    if (userRows && trainingRows) {
      userRows.map(data => {
        uRows.push(this.createData(data.id, data.name, data.vector));
      });

      trainingRows.map(data => {
        tRows.push(this.createData(data.id, data.title, data.vector));
      });
    }

    if (users) {
      users.map(data => {
        usersData.push({
          id: data.id,
          text: data.firstName + " " + data.lastName,
          recommendation: data.recommendation
        });
      });
    }

    return (
      <React.Fragment>
        {/* <TitleBar /> */}
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
                href="/featurematrix"
                {...a11yProps(0)}
              />
              <LinkTab
                label="Page Two"
                href="/userrecommendation"
                {...a11yProps(1)}
              />
            </Tabs>
          </AppBar>
          <TabPanel value={value} index={0}>
            {uRows.length !== 0 && tRows.length !== 0 && tags && organizers ? (
              <div>
                <FeatureMatrix
                  tags={tags}
                  organizers={organizers}
                  uRows={uRows}
                  tRows={tRows}
                />
              </div>
            ) : (
              ""
            )}
            <br />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Container>
              {value === 1 && usersData.length !== 0 ? (
                <div>
                  <div style={{ height: "20px" }} />
                  <Typography className={classes.title} variant="h5" noWrap>
                    Select User
                  </Typography>
                  <div style={{ height: "15px" }} />
                  <MenuList
                    options={usersData}
                    parentCallback={changeCurrentUser}
                    text="Select User"
                  />
                  {currentUser !== -1 ? (
                    <div>
                      <div style={{ height: "15px" }} />
                      <hr />
                      Recommended Trainings:
                      <TrainingList trainings={recTrainings} />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ) : (
                ""
              )}
            </Container>
          </TabPanel>
          {/* <TabPanel value={value} index={2}>
            {value === 2 ? <div>{console.log("test")}</div> : ""}
            <Fab color="primary" aria-label="add" onClick={this.handleClick}>
              <AddIcon />
            </Fab>
          </TabPanel> */}
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
    trainings: state.firestore.ordered.trainings,
    userRows: state.firestore.ordered.userRows,
    trainingRows: state.firestore.ordered.trainingRows
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
    { collection: "trainings", orderBy: ["title", "asc"] },
    { collection: "trainingRows", orderBy: ["title", "asc"] },
    { collection: "userRows", orderBy: ["name", "asc"] }
  ])
)(Recommendation);
