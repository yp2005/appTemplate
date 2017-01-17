import Vue from 'vue';
import app from './app';
mui.init();
mui.plusReady(function() {
  /*eslint-disable no-new*/
    new Vue({
        el: '#app',
        components: {
            app
        }
    });
});
/**
 * 重写mui.back()，什么都不执行，反之用户返回到入口页；
 */
mui.back = function() {};
