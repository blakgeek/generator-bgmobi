import Analytics from '@/services/analytics.service';
import store from '@/store';
import config from '@/config';

const adsConfig = config.ads;

export default  {
    init(adMobIds, options = {}) {

        if (!adsConfig.disabled && window.AdMob) {

            const ids = adMobIds[cordova.platformId];
            if(!ids) {
                return;
            }

            AdMob.setOptions({
                publisherId: ids.banner,
                interstitialAdId: ids.interstitial,
                adSize: AdMob.AD_SIZE.SMART_BANNER,	//use SMART_BANNER, BANNER, LARGE_BANNER, IAB_MRECT, IAB_BANNER, IAB_LEADERBOARD
                bannerAtTop: true, // set to true, to put banner at top
                overlap: true, // banner will overlap webview
                autoShow: false, // auto show interstitial ad when loaded
                ...adsConfig
            });

            document.addEventListener('onDismissInterstitialAd', function(){
                AdMob.createInterstitialView();
                AdMob.requestInterstitialAd();
                if(this.resolveInterstitial) {
                    this.resolveInterstitial()
                }
            });

            AdMob.createInterstitialView();
            AdMob.requestInterstitialAd();
            this.enabled = true;

            store.watch(store => store.playCtr % adsConfig.frequency === 0, showAd => {
                if(showAd) this.showInterstitial();
            });

            document.body.classList.add('ads-enabled');
        }
    },

    showBanner() {
        if(this.enabled) {
            document.body.classList.add('banner-visible');
            if(!this.bannerCreated) {
                AdMob.createBannerView({}, () => {
                    AdMob.showBannerAd().catch(err => {
                        console.error(err);
                    });
                });
                this.bannerCreated = true;
            } else {
                AdMob.showBannerAd().catch(err => {
                    Analytics.logError('show banner failed', err.toString());
                });
            }
        }
    },

    hideBanner() {
        if(this.enabled) {
            document.body.classList.remove('banner-visible');
            AdMob.hideBannerAd().catch(err => {
                Analytics.logError('hide banner failed', err.toString());
            })
        }
    },

    showInterstitial() {

        if(this.enabled) {
            AdMob.showInterstitialAd();
            return new Promise(resolve => {
                this.resolveInterstitial = resolve;
            })
        }

        return Promise.resolve();
    }
}