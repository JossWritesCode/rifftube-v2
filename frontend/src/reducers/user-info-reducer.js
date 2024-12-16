import { LOGIN } from '../actions/index.js';

const userInfoReducer = (state = null, action) => {
    //console.log("user info loaded", action)
    switch (action.type) {
        case LOGIN:
            return action.payload;
        default:
            return state;
        }
    };

export default userInfoReducer;
