import firebase from 'firebase/app';
import 'firebase/messaging';
import Account from '@/services/account.service';
import Messages from '@/services/messages.service';
import router from '@/router';
import Analytics from '@/services/analytics.service';

let connected = false;

export default {

    connect(username) {

        if (connected) {
            this.subscribe(`player%${username}`);
            return;
        } else if (!window.cordova || (window.cordova && window.cordova.platform === 'browser')) {

            // Initialize Firebase
            firebase.initializeApp({
                apiKey: "AIzaSyB2DIfppCP1sIctQHyLZ0IOiNXpd-RPnV4",
                authDomain: "sixation-71fea.firebaseapp.com",
                databaseURL: "https://sixation-71fea.firebaseio.com",
                projectId: "sixation-71fea",
                storageBucket: "sixation-71fea.appspot.com",
                messagingSenderId: "1030224390325"
            });

            const messaging = firebase.messaging();

            messaging.usePublicVapidKey('BDXsAvDtyW69aTwvwIfdXPiG6a8Gd049v5vAttn9DdrIXFDCrDld-8X1e8Qx-zk6sVDrZNFSjwxvIJ2Q9LwBvjI');

            messaging.requestPermission().then(function () {
                messaging.getToken().then(function (deviceId) {
                    localStorage.setItem('deviceId', deviceId);
                    Account.addDevice();
                }).catch(function (err) {
                    console.error('Unable to retrieve refreshed token ', err);
                });
            }).catch(function (err) {
                console.error('Unable to get permission to notify.', err);
            });

            messaging.onTokenRefresh(function () {
                messaging.getToken().then(function (deviceId) {
                    localStorage.setItem('deviceId', deviceId);
                    Account.addDevice();
                }).catch(function (err) {
                    console.error('Unable to retrieve refreshed token ', err);
                });
            });

            messaging.onMessage(function (payload) {
                const data = payload.data;
                const event = new Event('pushnotification');
                Object.assign(event, data);
                window.dispatchEvent(event);
            });

        } else if (!this.fcm && window.cordova) {

            const platformTopic = `platform%${cordova.platformId}`;
            const user = JSON.parse(localStorage.getItem('user') || 'false');

            this.fcm = new FirebaseMessagingPlugin();

            this.subscribe('all').catch(err => {
                Analytics.logError('topic_subscription_failed', err.message);
            });
            this.subscribe(platformTopic).catch(err => {
                Analytics.logError('topic_subscription_failed', err.message);
            });

            if (user) {
                this.subscribe(`player%${user.username}`);
            }

            window.addEventListener('pushnotification', e => {
                this.lastNotification = e;
                if (e.$appState) {

                    switch (e.messageType) {
                        case 'newGame':
                        case 'yourTurn':
                        case 'gameover':
                            if (router.currentRoute.name === 'multiPlayer') {
                                router.replace({
                                    path: `/play/${e.gameId}`
                                });
                            } else {
                                router.push({
                                    path: `/play/${e.gameId}`
                                });
                            }
                            break;
                        case 'challenge':
                            switch (router.currentRoute.name) {
                                case 'gameList':
                                    break;
                                case 'multiPlayer':
                                    history.back();
                                    break;
                                case 'singlePlayer':
                                    router.replace({
                                        name: `gameList`
                                    });
                                    break;
                                default:
                                    router.push({
                                        name: `gameList`
                                    });
                            }
                    }
                }

            });
            document.addEventListener("resume", () => this.flush(), false);

            this.flush();
        }

        connected = true;
        Messages.connect();
    },
    subscribe(topic) {

        if (this.fcm) {
            return this.fcm.subscribe(topic.replace(/\s+/g, '%').replace(/[^a-zA-Z0-9-_.~%]+/g, ''));
        }
    },
    unsubscribe(topic) {
        if (this.fcm) {
            return this.fcm.unsubscribe(topic.replace(/\s+/g, '%').replace(/[^a-zA-Z0-9-_.~%]+/g, ''));
        }
    },
    flush() {
        if (this.fcm) {
            return this.fcm.flush();
        }
    },
    getToken() {
        if (this.fcm) {
            return this.fcm.getToken();
        }
    },
    getLastNotifaction() {
        return this.lastNotification;
    }
}
