import { LOAD_USER_DATA } from '../actions/index.js';

// TODO: remove if unused

const userDataReducer = (state = [], action) => {
  switch (action.type) {
    case LOAD_USER_DATA:
      return action.payload;

    default:
      return state;
  }
};

export default userDataReducer;
