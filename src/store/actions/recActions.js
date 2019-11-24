export const setVector = (userRows, trainingRows) => {
  return (dispatch, getState, { getFirebase }) => {
    console.log("yeah");
    dispatch((userRows, trainingRows) => ({
      type: "SET_VECTORS",
      payload: { userRows, trainingRows }
    }));
  };
};
