const initState = {
  trainings: [],
  organizers: [],
  tags: [],
  words: []
};

const trainingReducer = (state = initState, action) => {
  switch (action.type) {
    case "CREATE_TRAINING":
      console.log("create training", action.training);
      return state;

    case "CREATE_TRAINING_ERROR":
      console.log("create training error", action.err);
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

    case "SET_WORDS":
      return {
        ...state,
        words: action.payload
      };

    default:
      return state;
  }
};

export default trainingReducer;
