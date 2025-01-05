import {
  DELETE_RIFF,
  SAVE_NEW_RIFF,
  SAVE_EDIT_RIFF,
  RECEIVE_RIFF_LIST,
  SAVE_NEW_RIFF_SUCCESS,
  SAVE_EDIT_RIFF_SUCCESS,
  UPDATE_RIFF_TIME_SUCCESS,
  WS_UPDATE_RIFF,
  WS_DELETE_RIFF,
  EMPTY_RIFFS,
  LOGOUT,
} from '../actions/index.js';

let initialState = EMPTY_RIFFS;

const riffsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT:
      return EMPTY_RIFFS;
    case DELETE_RIFF:
    {
      let ret = { ...state };
      delete ret[action.id]
      return ret;
    }
    case RECEIVE_RIFF_LIST:
      console.log("riffs RECEIVE_RIFF_LIST", action);
      let base = {};
      Object.defineProperty(base, "timestamp", {value: Date.now()}); // fix initial view riff load
      return action.payload.reduce(
        (acc, cur) =>
        {
          cur.payload = cur.isText ? cur.text : null;
          cur.type = cur.isText ? 'text' : 'audio';
          acc[cur.id] = cur;
          return acc;
        },
        base
      );
    case UPDATE_RIFF_TIME_SUCCESS:
    {
      let ret = { ...state };
      ret[action.id] = { ...ret[action.id], start: Number(action.start) };
      return ret;
    }
    case SAVE_NEW_RIFF: // code block for variable grouping
    {
      const riff = action.payload;
      delete riff.audio;

      // create new riffs list, including new riff
      return (
        {
          ...state,
          [riff.tempId]: riff
        });
    }
    case SAVE_NEW_RIFF_SUCCESS:
    {
      let id = action.payload.id;
      let tempId = action.payload.tempId;
      let riffs = { ...state };
      //riffs[id] = { ...riffs[tempId], id };
      riffs[id] = action.payload
      delete riffs[id].unsaved;
      delete riffs[tempId];
      return riffs;
    }

    case SAVE_EDIT_RIFF:
    {
      console.log("riffs reducer", action);
      // dup obj so that riffsAudio reducer can get the unaltered payload
      const riff = { ...action.payload };
      delete riff.audio;

      let riffs = { ...state };
      riffs[riff.id] = riff;

      return riffs;
    }
    case SAVE_EDIT_RIFF_SUCCESS:
    {
      let id = action.payload.id;
      let riffs = { ...state };
      riffs[id] = action.payload;
      return riffs;
    }
    case WS_UPDATE_RIFF:
    {
      console.log("ws update", action.payload);
      const cur = state[action.payload.riff.id];
      const riff = { ...action.payload.riff }; // doesn't need duplicating, but no harm

      // if the new riff has a timestamp equal or less than the current riff, return current state
      // this should prevent duplication on the computer that sends a save/update command
      if (cur && cur.timestamp && riff.timestamp && cur.timestamp > riff.timestamp)
        return state;

      let riffs = { ...state };
      riffs[riff.id] = riff;
      
      return riffs;
    }
    case WS_DELETE_RIFF:
    {
      // if the riff is already gone, return current state
      if (!state[action.payload.id]) return state;

      let ret = { ...state };
      delete ret[action.payload.id]
      return ret;
    }

    default:
      return state;
  }
};

export default riffsReducer;
