import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import { connect } from "react-redux";
import { startAuthChangedListener } from "../../actions/auth";
import Login from "../../Pages/Login";
import SignUp from "../../Pages/SignUp";
import Dashboard from "../../Components/Dashboard";
import Database from "../../database.js";
import LinearProgress from "@material-ui/core/LinearProgress";
import styled from "styled-components";

const OpacityComponent = styled.div`
  opacity: ${props => (props.loading ? 0.3 : 1)};
  pointer-events: ${props => (props.loading ? "none" : "")};
`;

const PrivateRoute = ({ component, isAuth, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        isAuth ? (
          React.createElement(component, props)
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

export class AppLayout extends Component {
  componentWillMount() {
    this.props.dispatch(startAuthChangedListener());
  }

  render() {
    const { authLoading, isAuth, loading } = this.props;

    return authLoading ? (
      <LinearProgress />
    ) : (
      <React.Fragment>
        {loading ? <LinearProgress /> : ""}
        <OpacityComponent loading={loading}>
          <BrowserRouter>
            <Switch>
              <Route
                exact
                path="/"
                render={() => <Redirect to="/dashboard" />}
              />
              <Route
                exact
                path="/app"
                render={() => <Redirect to="/dashboard" />}
              />
              <PrivateRoute
                path="/dashboard"
                component={Dashboard}
                isAuth={isAuth}
              />
              <Route path="/login" component={Login} />
              <Route path="/database" component={Database} />
              <Route path="/signup" component={SignUp} />

              <Route component={Error} />
            </Switch>
          </BrowserRouter>
        </OpacityComponent>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    authLoading: state.auth.authLoading,
    isAuth: state.auth.user,
    loading: state.app.loading
  };
};
export default connect(mapStateToProps)(AppLayout);
