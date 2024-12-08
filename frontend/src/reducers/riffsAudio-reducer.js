import {
  SAVE_NEW_RIFF_SUCCESS,
  SAVE_NEW_RIFF,
  SAVE_EDIT_RIFF,
  RIFF_LOADED,
  LOAD_RIFF,
  WS_UPDATE_RIFF,
  WS_DELETE_RIFF,
} from '../actions/index.js';

let initialState = { loading: {}, all: {} };

const riffsAudioReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_NEW_RIFF: {
      // adding a new riff:
      return {
        ...state,
        all: {
          ...state.all,
          [action.payload.tempId]: action.audio,
        },
      };
    }
    case SAVE_NEW_RIFF_SUCCESS:
    {
      let id = action.payload.id;
      let tempId = action.payload.tempId;
      let all = { ...state.all };
      all[id] = all[tempId];
      delete all[tempId];
      return { ...state, all };
    }
    case SAVE_EDIT_RIFF: {
      console.log("ser ra reducer", action.payload);
      // edit riff:
      return {
        ...state,
        all: {
          ...state.all,
          [action.payload.id]: action.payload.audio,
        },
      };
    }
    case LOAD_RIFF: 
    {
      return {
        ...state,
        // add [this riff's id]: true to state.loading object
        loading: {
          ...state.loading,
          [action.payload]: true,
        },
      };
    }
    case RIFF_LOADED:
    {
      // unpack state.loading object, delete the entry for the loaded riff's id
      const loading = {...state.loading};
      delete loading[action.id]
      // create blob for audio and add to state
      //debugger;
      const audio = new Blob([action.payload], { type: 'audio/mp3' });
      return {
        ...state,
        loading,
        all: {
          ...state.all,
          [action.id]: audio
        },
      };
    }
    case WS_UPDATE_RIFF:
    {
      return {
        ...state,
        all: {
          ...state.all,
          [action.payload.id]: null,
        },
      };
    }
    case WS_DELETE_RIFF:
    {
      let id = action.payload.id;
      let all = { ...state.all };
      delete all[id];
      return { ...state, all };
    }
    default:
      return state;
  }
};

export default riffsAudioReducer;
