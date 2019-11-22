const initState = {};

const tagReducer = (state = initState, action) => {
  switch (action.type) {
    case "CREATE_TAG":
      console.log("create tag", action.tag);
      return state;
    case "CREATE_TAG_ERROR":
      console.log("create tag error", action.err);
      return state;
    default:
      return state;
  }
};

export default tagReducer;
