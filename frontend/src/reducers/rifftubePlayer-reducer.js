import { SET_RIFFTUBE_PLAYER } from '../actions/index.js';

const rifftubePlayerReducer = (state = null, action) => {
  switch (action.type)
  {
    case SET_RIFFTUBE_PLAYER:
      return action.payload;
    default:
      return state;
  }
};

export default rifftubePlayerReducer;
