process.env.VUE_APP_VERSION = require('./package.json').version;
process.env.VUE_APP_BUILD_DTM = new Date().toISOString();

module.exports = {
    outputDir: 'www',
    publicPath: './',
    parallel: false,
    productionSourceMap: true,
    configureWebpack: {
        devtool: process.env.NODE_ENV === 'production' ? undefined : 'eval-source-map'
    },
    chainWebpack: config => {
        config
            .module
            .rule("worker")
            .test(/\.worker.js$/)
            .use("worker-loader")
            .loader("worker-loader")
            .options({
                inline: true
            })
            .end();
    },
    css: {
        loaderOptions: {
            sass: {
                data: `
          @import "~@/sass/colors";
          @import "~@/sass/variables";
        `
            }
        }
    }
}
