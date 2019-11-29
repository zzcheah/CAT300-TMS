const initState = {};

const feedbackReducer = (state = initState, action) => {
  switch (action.type) {
    case "CREATE_FEEDBACK":
      console.log("create feedback", action.feedback);
      return state;
    case "CREATE_FEEDBACK_ERROR":
      console.log("create feedback error", action.err);
      return state;
    default:
      console.log("no feedback action");
      return state;
  }
};

export default feedbackReducer;
