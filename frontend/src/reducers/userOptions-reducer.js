import { LOAD_USER_OPTIONS, LOGOUT } from '../actions/index.js';

const userOptionsReducer = (state = null, action) => {
  switch (action.type) {
    // clear on logout
    case LOGOUT:
      return null;
    case LOAD_USER_OPTIONS:
      return action.payload;
    default:
      return state;
  }
};

export default userOptionsReducer;
