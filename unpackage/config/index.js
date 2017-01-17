// see http://vuejs-templates.github.io/webpack for documentation.
/**
 * 这个页面只需要改三个地方，
 * 一：22行的port，调试环境的webserver端口
 * 二：18行，true则生成sourcemap，false不生成
 * 三：根据实际情况配置props
 */
var path = require('path');

module.exports = {
    build: {
        env: require('./prod.env'),
        assetsRoot: path.resolve(__dirname, '../../dist'),
        assetsPublicPathOfDev: '/',
        assetsSubDirectory: '../static',
        assetsPublicPath: '../',
        assetsSubDirectoryOfDev: 'static',
        productionSourceMap: false,
        happyPacklPoolSize: 6
    },
    dev: {
        env: require('./dev.env'),
        port: 8080,
        proxyTable: {}
    },
  	// 域名属性键值对,使用props作为前缀，要避免替换了不必要的字符串
    props: {
        'props.ui.style.top': '45px'
    },
  	// 没有图片时的替代内容
    replaceImg: {
    /*eslint-disable no-useless-escape */
        imgContext: "onerror=\\\'this.src=\\\"../../static/img/placehold.png\\\"\\\'"
    }
};
