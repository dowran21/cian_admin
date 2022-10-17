export const LOGOUT = 'LOGOUT';
export const logout = () => ({
    type: LOGOUT
});
 
export const USER_LOADING = 'USER_LOADING';
export const userLoading = () => ({
    type: USER_LOADING
});
 
export const USER_LOAD_FAILED = 'USER_LOAD_FAILED';
export const userLoadFailed = () => ({
    type: USER_LOAD_FAILED
});
 
export const USER_LOADED = 'USER_LOADED';
export const userLoaded = (data) => ({
    type: USER_LOADED,
    payload: data
});
 
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const loginSuccess = data => ({
    type: LOGIN_SUCCESS,
    payload: data,
});

