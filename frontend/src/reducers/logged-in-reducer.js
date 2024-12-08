import { LOGIN, LOGOUT } from '../actions/index.js';

const loggedInReducer = (state = false, action) => {
    switch (action.type) {
        case LOGIN:
            return true;
        case LOGOUT:
            return false;
        default:
            return state;
        }
    };

export default loggedInReducer;
