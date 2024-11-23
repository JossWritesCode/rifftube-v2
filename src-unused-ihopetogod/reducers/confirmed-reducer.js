import { LOGIN, LOGOUT } from '../actions/index.js';

const confirmedReducer = (state = false, action) => {
    switch (action.type) {
        case LOGIN:
            return action.payload.confirmed ?? false; // ?? handles empty response?
        case LOGOUT:
            return false;
        default:
            return state;
        }
    };

export default confirmedReducer;
