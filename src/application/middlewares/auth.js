import {
    logout, userLoading, userLoadFailed, userLoaded
} from "../actions/auth";
import {api} from '../api';
import toast from 'react-hot-toast';
import { GetCookie, RemoveCookie } from '../../utils/cookie'
    
export const Logout = () => async dispatch => {
    try {
        RemoveCookie('refresh_token')
        dispatch(logout());
    } catch (error) {
        dispatch(logout());
        RemoveCookie('refresh_token')
        toast.error('Неизвестная ошибка');
    }
}
    
export const LoadUser = () => async dispatch => {
    dispatch(userLoading());
    let token = GetCookie('refresh_token');
    try {
        if (token) {
            const response = await api.get({ url: '/api/admin/load-admin', token, withCredentials: true });
            dispatch(userLoaded(response.data));
        } else {
            dispatch(userLoadFailed());
        }
    } catch (error) {
        dispatch(userLoadFailed());
        toast.error('Неизвестная ошибка');
    }
}
