// This exports the plugin object.
import axios from "axios";
import Vue from "vue";
import Api from '@/services/api.service';
import config from '@/config';

const API_BASE_URL = config.apiBaseUrl;
const AUTH_BASE_URL = config.authBaseUrl;
const http = axios.create();
const authToken = localStorage.getItem('authToken');

if (authToken) {
    http.defaults.headers.common.Authorization = `Bearer ${authToken}`;
}

export default {

    init() {
        const user = localStorage.getItem('user');
        if (user) {
            Vue.prototype.$user = JSON.parse(user);
        }
    },
    loginLocally(credentials) {

        return http.post(`${AUTH_BASE_URL}/local`, credentials).then(resp => {
            return this.onNewAuthToken(resp.data.token);
        }).catch(onError);
    },
    logout() {

        this.removeDevice();
        const username = Vue.prototype.$user ? Vue.prototype.$user.username : false;
        if (username) {
            Vue.prototype.$user = false;
        }
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        Vue.prototype.$user = false;
        Api.updateAuthToken(false);
        delete http.defaults.headers.common.Authorization;
    },
    signUpLocally(user) {
        return http.post(`${API_BASE_URL}/users`, user).then(resp => {
            return this.onNewAuthToken(resp.data.token);
        }).catch(onError);
    },
    addDevice() {

        if (http.defaults.headers.common.Authorization) {
            const deviceId = localStorage.getItem('deviceId');
            if (deviceId && (!window.cordova || (window.cordova && window.cordova.platformId === 'browser'))) {
                return http.put(`${API_BASE_URL}/users/me/devices/${deviceId}`).catch(onError);
            } else {
                return Promise.resolve();
            }
        }
    },
    removeDevice() {

        if (http.defaults.headers.common.Authorization) {
            const deviceId = localStorage.getItem('deviceId');
            if (deviceId && (!window.cordova || (window.cordova && window.cordova.platformId === 'browser'))) {
                return http.delete(`${API_BASE_URL}/users/me/devices/${deviceId}`).catch(onError);
            }
        }
    },
    async onNewAuthToken(token) {

        localStorage.setItem('authToken', token);
        Api.updateAuthToken(token);
        http.defaults.headers.common.Authorization = `Bearer ${token}`;

        await this.addDevice();
        const user = await http.get(`${API_BASE_URL}/users/me`).then(resp => resp.data).catch(onError);
        if (user.username) {
            Vue.prototype.$user = user;
            localStorage.setItem('user', JSON.stringify(user));
        }
        return user;
    },
    async setUsername(newUsername) {

        const user = await http.put(`${API_BASE_URL}/users/me/username`, {
            newUsername
        }).then(resp => resp.data).catch(onError);

        Vue.prototype.$user = user;
        localStorage.setItem('user', JSON.stringify(user));
        return user;

    }
}

function onError(err) {
    if (err.response && err.response.status) {
        throw err.response.data;
    } else {

        throw {
            code: 'network',
            isNetwork: true
        };
    }

}