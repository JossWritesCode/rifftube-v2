import axios from 'axios';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const CREATE_TEMP_AUDIO_RIFF = 'CREATE_TEMP_AUDIO_RIFF';
export const CREATE_TEMP_TEXT_RIFF = 'CREATE_TEMP_TEXT_RIFF';

export const EDIT_RIFF = 'EDIT_RIFF';

export const CANCEL_EDIT = 'CANCEL_EDIT';
export const SAVE_NEW_RIFF = 'SAVE_NEW_RIFF';

export const SAVE_NEW_RIFF_SUCCESS = 'SAVE_NEW_RIFF_SUCCESS';
export const SAVE_NEW_RIFF_FAILURE = 'SAVE_NEW_RIFF_FAILURE';

export const SAVE_EDIT_RIFF = 'SAVE_EDIT_RIFF';

export const SAVE_EDIT_RIFF_SUCCESS = 'SAVE_EDIT_RIFF_SUCCESS';
export const SAVE_EDIT_RIFF_FAILURE = 'SAVE_EDIT_RIFF_FAILURE';

export const UPDATE_RIFF_TIME_SUCCESS = 'UPDATE_RIFF_TIME_SUCCESS';

export const DELETE_RIFF = 'DELETE_RIFF';

export const SAVE_TEMP_AUDIO = 'SAVE_TEMP_AUDIO';

export const SET_RIFF_PLAYING = 'SET_RIFF_PLAYING';
export const SET_RIFF_NOT_PLAYING = 'SET_RIFF_NOT_PLAYING';

export const LOAD_RIFF = 'LOAD_RIFF';
export const RIFF_LOADED = 'RIFF_LOADED';

export const SET_PLAYER_MODE = 'SET_PLAYER_MODE';
export const EDIT_MODE = 'EDIT_MODE';
export const EDIT_NEW_MODE = 'EDIT_NEW_MODE';
export const PLAY_MODE = 'PLAY_MODE';
export const PAUSE_MODE = 'PAUSE_MODE';
export const TOGGLE_PLAYER_MODE = 'TOGGLE_PLAYER_MODE';

export const SET_VIDEO_ID = 'SET_VIDEO_ID';
export const RECEIVE_NAME_UPDATE = 'RECEIVE_NAME_UPDATE';

export const RECEIVE_RIFF_LIST = 'RECEIVE_RIFF_LIST';
export const RECEIVE_RIFF_META = 'RECEIVE_RIFF_META';

export const TOGGLE_VIEW_USERID_MUTED = 'TOGGLE_VIEW_USERID_MUTED';
export const SET_VIEW_USERID_MUTED = 'SET_VIEW_USERID_MUTED';

export const RECEIVE_COLLABORATION_ID = 'RECEIVE_COLLABORATION_ID';
export const CREATE_PLAYLIST_SUCCESS = 'START_COLLABORATION_SUCCESS';
export const CREATE_PLAYLIST_FAILURE = 'START_COLLABORATION_FAILURE';

export const SET_VIDEO_DURATION = 'SET_VIDEO_DURATION';

export const LOAD_USER_DATA = 'LOAD_USER_DATA';
export const LOAD_PUBLIC_USER_DATA = 'LOAD_PUBLIC_USER_DATA';
export const LOAD_PUBLIC_USER_NAME = 'LOAD_PUBLIC_USER_NAME';
export const LOAD_GLOBAL_VIDEO_LIST = 'LOAD_GLOBAL_VIDEO_LIST';

export const LOAD_USER_OPTIONS = 'LOAD_USER_OPTIONS';

export const SET_IMMEDIATE_OFF = 'SET_IMMEDIATE_OFF';
export const SET_IMMEDIATE_ON = 'SET_IMMEDIATE_ON';

export const SET_RECORDER = 'SET_RECORDER';

export const WEB_SOCKET_UPDATE = 'WEB_SOCKET_UPDATE';

export const SAVE_PIC_SUCCESS = 'SAVE_PIC_SUCCESS';
export const SAVE_PIC_FAILURE = 'SAVE_PIC_FAILURE';

export const SET_ERROR = 'SET_ERROR';
export const CLEAR_ERROR = 'CLEAR_ERROR';

export const SET_METABAR_PLAYHEAD = 'SET_METABAR_PLAYHEAD';
export const SET_METABAR_CALLBACK = 'SET_METABAR_CALLBACK';

export const SET_RIFFTUBE_PLAYER = 'SET_RIFFTUBE_PLAYER';

export const SET_AUDIO_PLAYERS = 'SET_AUDIO_PLAYERS';
export const SET_FREE_AUDIO_PLAYER_IN_USE = 'SET_FREE_AUDIO_PLAYER_IN_USE';
export const SET_AUDIO_PLAYER_IN_USE = 'SET_AUDIO_PLAYER_IN_USE';
export const SET_AUDIO_PLAYER_NOT_IN_USE = 'SET_AUDIO_PLAYER_NOT_IN_USE';

export const WS_UPDATE_RIFF = 'WS_UPDATE_RIFF';
export const WS_DELETE_RIFF = 'WS_DELETE_RIFF';

export const EMPTY_RIFFS = {};

/******** Login and logout */

export const login = (email, password) => {
  return (dispatch) => {
    axios({
      method: 'post',
      url: `/login`,
      data: { email, password },
    }).then((res) => {
      //debugger;
      dispatch({ type: LOGIN, payload: res.data });
    }).catch(err =>
      console.log("error", err));
  };
};

export const loginWithGoogle = (credentialResponse) => {
  console.log(credentialResponse);
  //debugger;
  return (dispatch) => {
    axios({
      method: 'post',
      url: `/login-with-google`,
      data: { credentials: credentialResponse },
    }).then((res) => {
      console.log(res);
      dispatch({ type: LOGIN, payload: res.data });
    }).catch(err => console.log("error", err));
  };
};

export const logout = () => {
  return (dispatch) => {
    axios({
      method: 'delete',
      url: `/logout`,
    }).then((res) => {
      //debugger;
      dispatch({ type: LOGOUT, payload: res.data });
    }).catch(err =>
      console.log("error", err));
  };
};

export const currentUserStatus = () => {
  return (dispatch) => {
    axios({
      method: 'get',
      url: `/user-status`,
    }).then((res) => {
      //debugger;
      dispatch({ type: LOGIN, payload: res.data });
    }).catch(err =>
      console.log("error", err));
  };
};


/********** Saving, editing  */


export const saveEditRiff = (body, riff) =>
{
  debugger;
  return (dispatch) =>
  {
    const now = Date.now();
    body.append("timestamp", now); // timestamp used as unique identifier of this command
    riff.timestamp = now;
    dispatch({ type: SAVE_EDIT_RIFF, payload: riff });
    fetch(`/riffs/${riff.id}`,
      {
        method: 'PATCH',
        body
      })
      .then(response => response.json())
      // update riff saved status
      .then(response => dispatch({ type: SAVE_EDIT_RIFF_SUCCESS, payload: riff.id }))
      .catch(err => dispatch({ type: SAVE_EDIT_RIFF_FAILURE, payload: err }));
  }
}

export const saveNewRiff = (body, riff) =>
{
  // TODO: move to _edit_form partial
  const now = Date.now();
  body.append("timestamp", now); // timestamp used as unique identifier of this command
  riff.timestamp = now;
  // add tempId
  //debugger;
  let tempId = `temp-${new Date().getUTCMilliseconds()}`;
  // add tempId to both body and riff
  body.set("tempId", tempId);
  riff.tempId = tempId;
  return (dispatch) =>
  {
    dispatch({ type: SAVE_NEW_RIFF, payload: riff });
    fetch(`/riffs`, 
      {
        method: 'POST',
        body
      })
      .then(response => response.json())
      // update riff id and saved status
      .then(response => dispatch({ type: SAVE_NEW_RIFF_SUCCESS, payload: {id: response.id, tempId} }))
      .catch(err => dispatch({ type: SAVE_NEW_RIFF_FAILURE, payload: err }));
  }
}


/******** MetaBar */

export const setMetaBarPlayhead = (payload) => ({
  type: SET_METABAR_PLAYHEAD,
  payload,
});

export const setMetaBarCallback = (payload) => ({
  type: SET_METABAR_CALLBACK,
  payload,
});

/******** Rifftube player */

export const setRifftubePlayer = (payload) => ({
  type: SET_RIFFTUBE_PLAYER,
  payload,
});

export const setAudioPlayers = (payload) => ({
  type: SET_AUDIO_PLAYERS,
  payload,
});

export const setFreeAudioPlayerInUse = () => ({
  type: SET_FREE_AUDIO_PLAYER_IN_USE,
});

export const setAudioPlayerInUse = (payload) => ({
  type: SET_AUDIO_PLAYER_IN_USE,
  payload,
});

export const setAudioPlayerNotInUse = (payload) => ({
  type: SET_AUDIO_PLAYER_NOT_IN_USE,
  payload,
});

/******** WebSockets */

export const setWebSocket = (payload) => ({
  type: WEB_SOCKET_UPDATE,
  payload,
});

export const cableUpdate = (payload) => ({
  type: WS_UPDATE_RIFF,
  payload,
});

export const cableDelete = (payload) => ({
  type: WS_DELETE_RIFF,
  payload,
});

/******** Editing Interface */

export const setVideoDuration = (payload) => ({
  type: SET_VIDEO_DURATION,
  payload,
});

export const setRifferName = (name) => {
  return (dispatch) => {
    axios({
      method: 'PATCH',
      url: `/riffer-name`,
      data: { name },
    }).then((res) => {
      dispatch({ type: RECEIVE_NAME_UPDATE, payload: res.data });
    }).catch(err => console.log("error", err));
  };
};

export const setRiffPic = (payload) => {
  return (dispatch) => {
    let fd = new FormData();
    fd.append('image', payload);
    axios({
      method: 'PATCH',
      url: `/riffer-pic`,
      data: fd,
      // headers: { 'Content-Type': 'multipart/form-data' }, // not needed, I think
    })
      .then((res) => {
        // res.data.data
        dispatch({ type: SAVE_PIC_SUCCESS, payload: res.data }); // fix these to constants
      })
      .catch((err) => {
        dispatch({ type: SAVE_PIC_FAILURE, payload: err.response });
      });
  };
};

// updated to use get
export const getRiffs = (videoID) => {
  return (dispatch) => {
    axios({
      method: 'get',
      url: `/riffs?video_id=${videoID}&user_id=self`,
    }).then((res) => {
      dispatch({ type: RECEIVE_RIFF_LIST, payload: res.data });
    }).catch(err => console.log("error", err));

    axios({
      method: 'get',
      url: `/riffs?video_id=${videoID}`,
    }).then((res) => {
      dispatch({ type: RECEIVE_RIFF_META, payload: res.data });
    }).catch(err => console.log("error", err));
  }
};

export const setVideoID = (videoID) => {
  return (dispatch) => {
    dispatch({
      type: SET_VIDEO_ID,
      payload: videoID,
    });
  };
};

export const getAllRiffs = (videoID) => {
  return (dispatch) => {
    axios({
      method: 'get',
      url: `/riffs?video_id=${videoID}`,
    }).then((res) => {
      dispatch({ type: RECEIVE_RIFF_META, payload: res.data });
    }).catch(error => {
      dispatch({ type: RECEIVE_RIFF_META, payload: [] });
    });
  };
};

export const getMyRiffs = (videoID) => {
  return (dispatch) => {
    axios({
      method: 'get',
      url: `/riffs?video_id=${videoID}&user_id=self`,
    }).then((res) => {
      dispatch({ type: RECEIVE_RIFF_LIST, payload: res.data });
    }).catch(error => {
      console.error(error);
      dispatch({ type: RECEIVE_RIFF_LIST, payload: [] });
    });
    
  };
};

//Delete Riff
export const deleteRiff = (riffID, video_id, websocket) => {
  return (dispatch) => {
    axios({
      method: 'delete',
      url: `/riffs/${riffID}`
    }).then((res) => {
      dispatch({ type: DELETE_RIFF, id: riffID });
    }).catch(err => console.log("error", err));
  };
};

export const getRiffsMeta = (videoID) => {
  return (dispatch) => {
    axios({
      method: 'get',
      url: `/get-view-riffs/${videoID}`,
    }).then((res) => {
      dispatch({ type: RECEIVE_RIFF_META, payload: res.data });
    }).catch(err => console.log("error", err));
  };
};


export const getViewRiffs = (videoID) => {
  return (dispatch) => {
    axios({
      method: 'get',
      url: `/riffs?video_id=${videoID}`,
    }).then((res) => {
      dispatch({ type: RECEIVE_RIFF_LIST, payload: res.data,
        timestamp: Date.now() // used to come from server, but meh
       });
    }).catch(err => console.log("error", err));
  };
};

export const getUserData = () => {
  return (dispatch) => {
    axios({
      method: 'get',
      url: '/user/self/videos?host=www.youtube.com',
    }).then((res) => {
      dispatch({ type: LOAD_USER_DATA, payload: res.data });
    }).catch(err => console.log("error", err));
  };
};

export const getPublicUserData = (id) => {
  return (dispatch) => {
    axios({
      method: 'get',
      url: `/users/${id}`,
    }).then((res) => {
      dispatch({ type: LOAD_PUBLIC_USER_DATA, payload: res.data });
    }).catch(err => console.log("error", err));
  };
};

export const getUserOptions = () => {
  return (dispatch) => {
    axios({
      method: 'get',
      url: '/user_options',
    }).then((res) => {
      dispatch({ type: LOAD_USER_OPTIONS, payload: res.data });
    }).catch(err => console.log("error", err));
  };
};

export const setUserOptions = (body) => {
  return (dispatch) => {
    fetch("/user_options",
      {
        method: 'PATCH',
        body
      })
      .then(res => res.json())
      .then(res => dispatch({ type: LOAD_USER_OPTIONS, payload: res }))
      .catch(err => console.log(err));
  };
};

export const getGlobalVideoList = () => {
  return (dispatch) => {
    axios({
      method: 'get',
      url: '/videos?host=www.youtube.com',
    }).then((res) => {
      dispatch({ type: LOAD_GLOBAL_VIDEO_LIST, payload: res.data });
    }).catch(err => console.log("error", err));
  };
};

export const setPlayerMode = (mode) => ({
  type: SET_PLAYER_MODE,
  payload: mode,
});

export const togglePlayerMode = (mode) => ({
  type: TOGGLE_PLAYER_MODE,
});

/*export const saveRiff = payload => ({
  type: SAVE_NEW_RIFF,
  payload
});*/

export const saveTempAudio = (payload, duration) => ({
  type: SAVE_TEMP_AUDIO,
  payload,
  duration,
});

export const editRiff = (payload, id, load) => {
  return (dispatch) => {
    dispatch({
      type: EDIT_RIFF,
      payload, // index
      id,
    });

    // id is only passed when the audio riff needs loading
    if (load) rawLoadAxios(dispatch, id); // loads riff audio
  };
};

export const cancelEdit = () => ({
  type: CANCEL_EDIT,
});

export const updateRiffTime = (riff_id, start) => {
  return (dispatch) =>
    {
      console.log("update time called", riff_id, start);
      let body = new FormData();
      body.set('start', start);
      fetch(`/riffs/${riff_id}?fields=start`,
      {
        method: 'PATCH',
        body,
      })
      .then((res) => {
        // res.data.data
        dispatch({ type: UPDATE_RIFF_TIME_SUCCESS, id: riff_id, start: start });
      })
      .catch((err) => {
        dispatch({ type: SAVE_NEW_RIFF_FAILURE, payload: err.response });
      });

    // dispatch NOTHING
  };
}

export const setImmediateOn = () => ({
  type: SET_IMMEDIATE_ON,
});

export const setImmediateOff = () => ({
  type: SET_IMMEDIATE_OFF,
});

export const setRecorder = (payload) => ({
  type: SET_RECORDER,
  payload,
});

export const setRiffPlaying = (index, playing) => ({
  type: playing ? SET_RIFF_PLAYING : SET_RIFF_NOT_PLAYING,
  payload: index,
});

export const loadRiff = payload => {
  //debugger;
  return (dispatch) => {
    dispatch({ type: LOAD_RIFF, payload });
    rawLoadAxios(dispatch, payload);
  };
};

const rawLoadAxios = (dispatch, id) => {
  axios({
    method: 'get',
    url: `/riffs/${id}`,
    responseType: 'arraybuffer',
  }).then((res) => {
    dispatch({ type: RIFF_LOADED, payload: res.data, id });
  }).catch(err => console.log("error", err));
};
