import config from '@/config';

const BASE_URL = config.wsUrl;
class WebsocketClient {

    constructor() {
        this.emitter = document.createElement('div');
        document.addEventListener('resume', () => {
            if(this.instance && ![this.instance.OPEN, this.instance.CONNECTING].includes(this.instance.readyState)) {
                this.connect();
            }
        }, false);

    }

    connect() {

        const authToken = localStorage.getItem('authToken');

        if(!authToken) return false;

        this.url = `${BASE_URL}?token=${authToken}`;
        this.instance = new WebSocket(this.url);
        this.instance.onmessage = this.onmessage.bind(this);
        this.instance.onclose = (e) => {
            switch (e.code) {
                case 1000:	// CLOSE_NORMAL
                    break;
                default:	// Abnormal closure
                    this.reconnect(e);
                    break;
            }
        };
        this.instance.onrror = (e) => {

            switch (e.code) {
                case 'ECONNREFUSED':
                    this.reconnect(e);
                    break;
                default:
                    this.onerror(e);
                    break;
            }
        };
    }

    disconnect() {
        if(this.instance && [this.instance.OPEN, this.instance.CONNECTING].includes(this.instance.readyState)) {
            this.instance.close(1000, 'sign out');
        }
    }

    reconnect(e) {

        setTimeout(() => {
            this.connect();
        }, config.wsRetryFrequency);
    }

    addEventListener() {
        this.emitter.addEventListener(...arguments);
    }

    removeEventListener() {
        this.emitter.removeEventListener(...arguments);
    }

    onmessage(e) {
        const data = JSON.parse(e.data || {});
        const type = data.type;

        if(type) {
            const event = new Event(type);
            const globalGenericEvent = new Event('appMessage');
            const globalSpecificEvent = new Event(`appMessage:${type}`);

            globalGenericEvent.message = globalSpecificEvent.message = event.message = data;
            this.emitter.dispatchEvent(event);
            window.dispatchEvent(globalGenericEvent);
            window.dispatchEvent(globalSpecificEvent);
        }
    }
}

const monitor = new WebsocketClient();


export {
    monitor as default,
    WebsocketClient
}