const initState = {
  trainings: [],
  organizers: [],
  tags: []
};

const trainingReducer = (state = initState, action) => {
  switch (action.type) {
    case "CREATE_TRAINING":
      console.log("create training", action.training);
      return state;

    case "CREATE_TRAINING_ERROR":
      console.log("create prj error", action.err);
      return state;

    case "SET_ORGANIZERS":
      return {
        ...state,
        organizers: action.payload
      };

    case "SET_TAGS":
      return {
        ...state,
        tags: action.payload
      };

    default:
      return state;
  }
};

export default trainingReducer;
