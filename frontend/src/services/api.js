import axios from 'axios';

//create base axios w/ common config
const api = axios.create({
    baseURL: 'http://localhost:5690',
});

//modifies every outgoing request before it is sent
api.interceptors.request.use(config => {
    //gets token from localstorage
    const token = localStorage.getItem('token');

    //Adds authorization header
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;