const initState = {};

const organizerReducer = (state = initState, action) => {
  switch (action.type) {
    case "CREATE_ORGANIZER":
      console.log("create organizer", action.organizer);
      return state;
    case "CREATE_ORGANIZER_ERROR":
      console.log("create organizer error", action.err);
      return state;
    default:
      return state;
  }
};

export default organizerReducer;
