
import axios from 'axios';
import store from '../index';
import { userLoaded } from '../actions/auth';
import { Logout } from '../middlewares/auth';
import { GetCookie } from '../../utils/cookie';



const API_BASE_URL = process.env.REACT_APP_IS_PRODUCTION === 'development' ? process.env.REACT_APP_API_BASE_URL :  process.env.REACT_APP_API_BASE_PRODUCTION_URL;
 
export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: null
    }
});
 
axiosInstance.interceptors.response.use(
    response => response,
    (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && error.response.data === 'Unauthorized' && GetCookie('refresh_token')) {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${GetCookie('refresh_token')}`,
                },
                withCredentials: true,
            }
            return axiosInstance.get('/api/load-user', config)
            .then((response) => {
                console.log(response)
                axiosInstance.defaults.headers.Authorization = `Bearer ${response.data.token}`;
                originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
                store.dispatch(userLoaded(response.data));
                return axiosInstance(originalRequest);
            }).catch((err) => {
                axiosInstance.defaults.headers.Authorization = null;
                originalRequest.headers.Authorization = null;
                store.dispatch(Logout());
                return Promise.reject(error);
            });
        } else {
            axiosInstance.defaults.headers.Authorization = null;
            originalRequest.headers.Authorization = null;
            //store.dispatch(Logout());
            return Promise.reject(error);
        }
    }
);


 
export const api = {
    get: async ({ url, token, withCredentials, contentType }) => {
        const config = {
            headers: {
                'Content-Type': contentType ? contentType : 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            withCredentials: withCredentials
        }
        return await axiosInstance.get(url, config);
    },
    post: async ({ url, token, withCredentials, params, }) => {
    
        const config = {
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            withCredentials: withCredentials,
        }
        return await axiosInstance.post(url, params, config);
    },
    update: async ({ url, token, withCredentials, params }) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            withCredentials: withCredentials,
        }
        return await axiosInstance.put(url, params, config);
    },
    delete: async ({ url, token, data, withCredentials, }) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
            withCredentials: withCredentials,
            data: data
        };
        return await axiosInstance.delete(url, config);
    },
    upload: async ({ url, token, withCredentials, formData }) => {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            },
            withCredentials: withCredentials,
        };
        return await axiosInstance.post(url, formData, config);
    }
}