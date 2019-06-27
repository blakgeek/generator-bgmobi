export default {

    install(Vue, config = {}) {

        Vue.prototype.$logEvent = this.logEvent.bind(this);
        Vue.prototype.$logError = this.logError.bind(this);

        this.enabled = !!window.FlurryAnalytics;

        if(this.enabled) {
            this.flurry = new FlurryAnalytics({
                ...config,
                appKey: cordova.platformId === 'ios' ? config.iosKey : config.androidKey
            });

            const user = localStorage.getItem('user');
            if (user) {
                this.flurry.setUserId(JSON.parse(user).username);
            }
        }
    },
    logEvent(name, params) {
        if(this.enabled) {
            this.flurry.logEvent(name, params);
        }
    },
    logError(code, message) {
        if(this.enabled) {
            this.flurry.logError(code, message);
        }
    },
    setUsername(username) {
        if(this.enabled) {
            this.flurry.setUserId(username);
        }
    }
}

