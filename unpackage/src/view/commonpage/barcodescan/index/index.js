// 引入vue
import Vue from 'vue';
import VueRouter from 'vue-router';
import app from './App';

Vue.use(VueRouter);
var router = new VueRouter();

//mui生命周期管理
mui.init({
    swipeBack: false
});

mui.plusReady(function() {
    router.start(app, '#app');
});