import {
  SET_AUDIO_PLAYERS,
  SET_FREE_AUDIO_PLAYER_IN_USE,
  SET_AUDIO_PLAYER_IN_USE,
  SET_AUDIO_PLAYER_NOT_IN_USE,
} from '../actions/index.js';

const audioPlayersReducer = (state = {players: [], inUse: {}, free: null, freeId: null}, action) => {
  switch (action.type)
  {
    case SET_AUDIO_PLAYERS:
      return {...state, inUse: {}, players: action.payload, free: action.payload[0], freeId: 0};
    case SET_AUDIO_PLAYER_IN_USE:
    {
        let inUse = {...state.inUse, [action.playload]: true };
        let free, freeId;
        for ( let i = 0; i < 5; i++ )
        {
          if (!inUse[i])
          {
            free = state.players[i];
            freeId = i;
            break;
          }
        }
        return {...state, inUse, free, freeId};
    }
    case SET_FREE_AUDIO_PLAYER_IN_USE:
    {
        let inUse = {...state.inUse, [state.freeId]: true };
        let free, freeId;
        for ( let i = 0; i < 5; i++ )
        {
          if (!inUse[i])
          {
            free = state.players[i];
            freeId = i;
            break;
          }
        }
        return {...state, inUse, free, freeId};
    }
    case SET_AUDIO_PLAYER_NOT_IN_USE:
    {
        console.log(action.payload, "off")
        let inUse = {...state.inUse, [action.payload]: false };
        let free, freeId;
        for ( let i = 0; i < 5; i++ )
        {
          if (!inUse[i])
          {
            free = state.players[i];
            freeId = i;
            break;
          }
        }
        return {...state, inUse, free, freeId};
    }
    default:
      return state;
  }
};

export default audioPlayersReducer;
