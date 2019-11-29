import React from "react";
import TrainingSummary from "./TrainingSummary";
import { Link } from "react-router-dom";

const TrainingList = ({ trainings }) => {
  console.log("haha", trainings);
  return (
    <div className="training-list section">
      {trainings &&
        trainings.map(training => {
          return (
            <Link to={"/training/" + training.id} key={training.id}>
              <TrainingSummary training={training} />
            </Link>
          );
        })}
    </div>
  );
};

export default TrainingList;
