import { SET_METABAR_PLAYHEAD } from '../actions/index.js';

const metaBarPlayheadReducer = (state = null, action) => {
  switch (action.type)
  {
    case SET_METABAR_PLAYHEAD:
      return action.payload;
    default:
      return state;
  }
};

export default metaBarPlayheadReducer;
