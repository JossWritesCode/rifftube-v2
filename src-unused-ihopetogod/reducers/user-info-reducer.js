import { LOGIN } from '../actions/index.js';

const userInfoReducer = (state = null, action) => {
    switch (action.type) {
        case LOGIN:
            //debugger;
            return action.payload;
        default:
            return state;
        }
    };

export default userInfoReducer;
