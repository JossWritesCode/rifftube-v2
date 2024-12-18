import { LOAD_USER_OPTIONS, LOGOUT } from '../actions/index.js';

const userOptionsReducer = (state = null, action) => {
  switch (action.type) {
    // clear on logout
    case LOGOUT:
      //console.log("logout, set user options = null")
      return null;
    case LOAD_USER_OPTIONS:
      //console.log("load user options = ", action.payload)
      return action.payload;
    default:
      return state;
  }
};

export default userOptionsReducer;
