import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { connect } from "react-redux";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";

import { fetchTags } from "../../store/actions/trainingActions";
import DropDownMenu from "../utilities/DropDownMenu";
import Chips from "../utilities/Chips";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        PMO Innovations
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = theme => ({
  paper: {
    marginTop: theme.spacing(25),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    textAlign: "right"
  }
});

class LandingPage extends React.Component {
  state = {
    selectedTags: []
  };
  componentWillMount() {
    this.props.fetchTags();
  }

  tagCallback = tag => {
    const { selectedTags } = this.state;
    const { tags } = this.props;
    for (var i = 0; i < tags.length; i++) {
      if (tags[i] === tag) {
        tags.splice(i, 1);
        i--;
      }
    }
    selectedTags.push(tag);
    this.setState({
      selectedTags: selectedTags
    });
  };

  removeTag = tag => {
    const { selectedTags } = this.state;
    const { tags } = this.props;
    tags.push(tag);
    for (var i = 0; i < selectedTags.length; i++) {
      if (selectedTags[i] === tag) {
        selectedTags.splice(i, 1);
        i--;
      }
    }
    this.setState({
      selectedTags: selectedTags
    });
    console.log("removed tag");
  };

  handleSubmit = e => {
    e.preventDefault();
    console.log(this.state);
    // this.props.createTraining(this.state);
    var temp = "";
    this.state.selectedTags.forEach(element => {
      temp += element + "&&";
    });

    const toPush = "/result/" + temp.substring(0, temp.length - 2);

    // console.log(toPush);
    this.props.history.push(toPush);
  };

  render() {
    const { classes, tags } = this.props;
    const { selectedTags } = this.state;

    return (
      <Container
        component="main"
        maxWidth="sm"
        //   style={{ zIndex: "90", marginTop: "-30px" }}
      >
        <CssBaseline />
        <div className={classes.paper}>
          {/* <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar> */}
          <Typography component="h1" variant="h3">
            PMO Innovations
          </Typography>
          <form
            onSubmit={this.handleSubmit}
            className={classes.form}
            noValidate
          >
            <Typography variant="subtitle1" align="center">
              {"I'm interested in trainings related to "}
              <span>
                <DropDownMenu
                  // style={{ display: "inline" }}
                  options={tags}
                  parentCallback={this.tagCallback}
                  text="_____"
                />
              </span>
            </Typography>
            <Chips
              selectedTags={selectedTags}
              parentCallback={this.removeTag}
              justify="center"
            />
            <div style={{ textAlign: "center" }}>
              <Button
                type="submit"
                // fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={selectedTags.length > 0 ? false : true}
              >
                Search
              </Button>
            </div>
          </form>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    tags: state.training.tags
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchTags: () => dispatch(fetchTags())
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(useStyles)
)(LandingPage);
