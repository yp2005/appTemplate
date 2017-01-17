// 引入vue
import Vue from 'vue';
import VueRouter from 'vue-router';
import app from './app';

Vue.use(VueRouter);
var router = new VueRouter();
// H5 plus事件处理
var ws = null;

mui.init({
    swipeBack: false
});
// mui生命周期管理
mui.plusReady(function() {
  // Android处理返回键
    plus.key.addEventListener('backbutton', function() {
        (history.length === 1) && ws.close();
        var c = setTimeout(function() {
            ws.close();
        }, 1000);
        window.onbeforeunload = function() {
            clearTimeout(c);
        };
        history.go(-2);
    }, false);
    ws = plus.webview.currentWebview();
    app.ws = ws;
    router.start(app, '#app');
});



document.addEventListener('touchstart', function() {
    return false;
}, true);
// 禁止选择
document.oncontextmenu = function() {
    return false;
};
