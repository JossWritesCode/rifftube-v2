import { LOGIN, LOGOUT } from '../actions/index.js';

const confirmedReducer = (state = false, action) => {
    switch (action.type) {
        case LOGIN:
            // in case something goes wrong on the backend, this should default to false
            return action.payload.confirmed ?? false;
        case LOGOUT:
            return false;
        default:
            return state;
        }
    };

export default confirmedReducer;
