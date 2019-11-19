import React from "react";
import moment from "moment";

const TrainingSummary = ({ training }) => {
  return (
    <div className="card z-depth-0 training-summary">
      <div className="card-content grey-text text-darken-3">
        <span className="card-title">{training.title}</span>
        <p>Posted by {training.organizer} </p>
        <p className="grey-text">
          {moment(training.createdAt.toDate()).calendar()}
        </p>
      </div>
    </div>
  );
};

export default TrainingSummary;
