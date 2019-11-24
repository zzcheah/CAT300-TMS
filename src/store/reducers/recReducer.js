const initState = {
  userRows: [],
  trainingRows: []
};

const trainingReducer = (state = initState, action) => {
  switch (action.type) {
    case "SET_VECTORS":
      return {
        ...state,
        userRows: action.payload.userRows,
        trainingRows: action.payload.trainingRows
      };

    default:
      return state;
  }
};

export default trainingReducer;
