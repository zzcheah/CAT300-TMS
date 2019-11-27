import React from "react";
import moment from "moment";

const NotifSummary = ({ notification }) => {
  return (
    <div className="card z-depth-0 training-summary">
      <div className="card-content grey-text text-darken-3">
        <span className="card-title">{notification.trainingTitle}</span>
        <p>{notification.trainingId} </p>
        <p className="grey-text">
          started at {moment(notification.dateTime.toDate()).format("LLL")}
        </p>
      </div>
    </div>
  );
};

export default NotifSummary;
