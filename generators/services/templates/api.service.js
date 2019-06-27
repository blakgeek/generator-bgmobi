import axios from 'axios';
import config from '@/config';

const http = axios.create();
const authToken = localStorage.getItem('authToken');

http.defaults.baseURL = config.apiBaseUrl

if (authToken) {
    http.defaults.headers.common.Authorization = `Bearer ${authToken}`;
}

export default {

    updateAuthToken(token = false) {
        if (token) {
            http.defaults.headers.common.Authorization = `Bearer ${token}`;
        } else {
            delete http.defaults.headers.common.Authorization;
        }
    },
    getUser(username) {
        return http.get(`/users/${username}`).then(getData).catch(onError);
    },
}

export class NetworkError extends Error {}

function getData(resp) {
    return resp.data;
}

function onError(err) {
    if(err.response && err.response.status) {
        if(err.response.status >= 400) {
            throw err.response.data;
        }
        return err.response.data;
    } else {

        throw {
            code: 'network',
            isNetwork: true
        };
    }
}