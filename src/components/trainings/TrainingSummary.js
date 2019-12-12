import React from "react";
import moment from "moment";

const TrainingSummary = ({ training }) => {
  return (
    <div
      className="card z-depth-0 training-summary"
      style={{ borderRadius: "7px" }}
    >
      <div
        className="card-content grey-text text-darken-3"
        style={{
          boxShadow:
            "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
        }}
      >
        <span className="card-title">{training.title}</span>
        {training.url ? (
          <img
            src={training.url}
            alt="trainingIMG"
            width="auto"
            style={{ maxHeight: "300px", maxWidth: "50%" }}
          />
        ) : (
          <img
            src={require("../../images/training.jpg")}
            alt="nullImg"
            width="auto"
            style={{ maxHeight: "300px", maxWidth: "50%" }}
          />
        )}
        <p>Posted by {training.organizer} </p>
        <p className="grey-text">
          DateTime: {moment(training.dateTime.toDate()).calendar()}
        </p>{" "}
        <div className="tags-input">
          <ul id="tags">
            {training.selectedTags.map((tag, index) => (
              <li key={index} className="tag">
                <span className="tag-title">{tag}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TrainingSummary;
