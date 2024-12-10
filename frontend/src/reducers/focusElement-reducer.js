import {
  FOCUS_ELEMENT,
  BODY_SELECTOR,
 } from '../actions/index.js';

const focusElementReducer = (state = BODY_SELECTOR, action) => {
  switch (action.type) {
    case FOCUS_ELEMENT:
      return action.payload
    default:
      return state;
  }
};

export default focusElementReducer;
