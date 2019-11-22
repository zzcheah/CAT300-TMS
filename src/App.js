import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Dashboard from "./components/dashboard/Dashboard";
import ProjectDetails from "./components/projects/ProjectDetails";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import CreateProject from "./components/projects/CreateProject";
import CreateTraining from "./components/trainings/CreateTraining";
import EditTraining from "./components/trainings/EditTraining";
import TrainingDetails from "./components/trainings/TrainingDetails";
import Recommendation from "./components/recommendation/Recommendation";
import ManageTag from "./components/manage/ManageTag";
import ManageOrganizer from "./components/manage/ManageOrganizer";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <Switch>
          {/* <Route exact path="/" component={Dashboard} /> */}
          <Route exact path="/" component={Dashboard} />
          <Route path="/project/:id" component={ProjectDetails} />
          <Route path="/training/:id" component={TrainingDetails} />
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route path="/create" component={CreateProject} />
          <Route path="/createTraining" component={CreateTraining} />
          <Route path="/editTraining/:id" component={EditTraining} />
          <Route path="/recommendation" component={Recommendation} />
          <Route path="/manageTag" component={ManageTag} />
          <Route path="/manageOrganizer" component={ManageOrganizer} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
