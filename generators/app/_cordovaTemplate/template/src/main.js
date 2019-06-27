import 'vue2-animate/dist/vue2-animate.min.css';
import '@/sass/index.scss'

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import * as ModalDialogs from 'vue-modal-dialogs'
// import Dialogs from '@/plugins/dialogs.plugin';
// import config from '@/config';

if (window.cordova) {
    document.addEventListener('deviceready', init);
} else {
    init();
}

function init() {

    try {
        document.documentElement.classList.add(cordova.platformId);
    } catch(e) {

    }

    Vue.use(ModalDialogs);
    Vue.config.productionTip = false;

    const app = new Vue({
        router,
        store,
        created() {
        },
        render: h => h(App),
        mounted() {
            if(navigator.splashscreen) {
                setTimeout(() => navigator.splashscreen.hide(), 1000);
            }
        }
    });

    app.$mount('#app');

    if(window.cordova) {

    }
}
