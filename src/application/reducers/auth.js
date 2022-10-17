import {
    LOGIN_SUCCESS, LOGOUT, USER_LOADING, USER_LOAD_FAILED, USER_LOADED
} from "../actions/auth";
    
const initialState = {
    token: "",
    isLogged: false,
    isLoading: true,
    user: {},
};
    
const reducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                token: action.payload.access_token,
                user: action.payload.data,
                isLoading: false,
                isLogged: true,
            };
        case USER_LOADED:
            return {
                ...state,
                token: action.payload.access_token,
                user: action.payload.data,
                isLogged: true,
                isLoading: false
            };
        case LOGOUT:
            return {
                ...state,
                token: "",
                isLogged: false,
                isLoading: false,
                user: {},
            }
        case USER_LOADING:
            return {
                ...state,
                isLoading: true
            }
        case USER_LOAD_FAILED:
            return {
                ...state,
                token: "",
                isLogged: false,
                isLoading: false,
                user: {},
            }
        default:
            return state;
    }
}
    
export default reducer;