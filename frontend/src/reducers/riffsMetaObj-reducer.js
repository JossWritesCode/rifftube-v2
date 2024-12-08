import { RECEIVE_RIFF_META } from '../actions/index.js';

let initialState = {};

const riffsMetaObjReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_RIFF_META:
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
    default:
      return state;
  }
};

export default riffsMetaObjReducer;
