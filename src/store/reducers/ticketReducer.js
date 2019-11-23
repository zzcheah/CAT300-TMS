const initState = {};

const ticketReducer = (state = initState, action) => {
  switch (action.type) {
    case "PURCHASE_TICKET":
      console.log("purchase ticket", action.ticket);
      return state;
    case "PURCHASE_TICKET_ERROR":
      console.log("purchase ticket error", action.err);
      return state;
    default:
      return state;
  }
};

export default ticketReducer;
