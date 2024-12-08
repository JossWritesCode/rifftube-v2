import { SET_METABAR_CALLBACK } from '../actions/index.js';

const metaBarCallbackReducer = (state = null, action) => {
  switch (action.type)
  {
    case SET_METABAR_CALLBACK:
      return action.payload;
    default:
      return state;
  }
};

export default metaBarCallbackReducer;
