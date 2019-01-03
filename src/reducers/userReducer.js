import { userConstants } from "../actions/actionTypes";

const initState = JSON.parse(localStorage.getItem('user')) || {};

const userReducer = (state = initState, action) => {
    switch (action.type) {
        case userConstants.LOGIN_SUCCESS: {
            return { 
                ...state, 
                _id: action.user._id,
                name: action.user.name,
                email: action.user.email,
                token: action.user.token,
            };
        }
        default:
            return state;
    }
}

export default userReducer;