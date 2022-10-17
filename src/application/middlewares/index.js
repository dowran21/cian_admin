import {api} from '../api/index';
import toast from 'react-hot-toast';

export const get = ({ url, token, action }) => async () => {
    try {
        const response = await api.get({ url, token, withCredentials: false });
        return action({ success: true, data: response.data });
    } catch (error) {
        console.log(error)
        return action({ success: false, message: error?.response?.data });
    }
}
    
export const post = ({ url, token, action, data }) => async dispatch => {
    try {
        const response = await api.post({ url, params: data, withCredentials: false, token });
        return action({ success: true, data: response.data });
    } catch (error) {
        return action({ success: false, message: error?.response?.data, error: error?.response });
    }
}
    
export const put = ({ url, token, action, data }) => async dispatch => {
    try {
        const response = await api.update({ url, params: data, withCredentials: false, token });
        return action({ success: true, data: response.data });
    } catch (error) {
        return action({ success: false, message: error?.response?.data });
    }
}
    
export const del = ({ url, token, action }) => async dispatch => {
    try {
        const response = await api.delete({ url, token, withCredentials: false });
        dispatch(action(response.data));
    } catch (error) {
        console.log(error)
        toast.error("Üstinlikli Bolmady");
    }
}