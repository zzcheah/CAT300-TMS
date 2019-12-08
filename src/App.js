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
import FeedbackAnalysis from "./components/feedback/FeedbackAnalysis";
import ManageTag from "./components/manage/ManageTag";
import ManageOrganizer from "./components/manage/ManageOrganizer";
import CircularLoad from "./components/loading/CircularLoad";
import ManageProfile from "./components/manage/ManageProfile";
import CreateFeedback from "./components/feedback/CreateFeedback";
import LandingPage from "./components/layout/LandingPage";
import SearchResult from "./components/recommendation/SearchResult";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        {/* {!auth.isEmpty && auth.isLoaded? */}
        <Navbar />

        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/project/:id" component={ProjectDetails} />
          <Route path="/training/:id" component={TrainingDetails} />
          <Route path="/signin" component={SignIn} />
          <Route path="/signup" component={SignUp} />
          <Route path="/create" component={CreateProject} />
          <Route path="/createTraining" component={CreateTraining} />
          {/* <Route path="/editTraining/:id" component={EditTraining} /> */}
          <Route path="/recommendation" component={Recommendation} />
          <Route path="/feedback" component={FeedbackAnalysis} />
          <Route path="/result/:tags" component={SearchResult} />
          <Route path="/manageTag" component={ManageTag} />
          <Route path="/manageOrganizer" component={ManageOrganizer} />
          <Route path="/circularLoad" component={CircularLoad} />
          <Route path="/profile/:id" component={ManageProfile} />
          <Route
            path="/createFeedback/:trainingTitle/:trainingId/:notificationId"
            component={CreateFeedback}
          />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;

// const mapStateToProps = state => {
//   console.log(state, "from App.js");
//   return {
//     auth: state.firebase.auth,
//     notif: state.firebase.profile.notif,

//   };
// };

// export default connect(mapStateToProps)(App);
