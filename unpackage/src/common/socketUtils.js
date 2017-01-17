'use strict';
/**
 * @file 此js文件用于处理socket通信
 * @Author liyubai
 * 使用方法：import socketUtils from 'common/socketUtils'
 */

import muiUtils from './muiUtils';
import api from 'api';
import CONST from 'common/consts';
import utils from 'common/utils';
import cacheUtils from 'common/cacheUtils';
import log from 'common/logUtils';
// 心跳循环对象
var timeout;
var listeningTimeout;
// 心跳计数器
var count = 1;
// 心跳监听
var heartListening = 0;
// 心跳监听连接失败计数器
var heartFailCount = 0;
// 心跳请求间隔时间
var defineTime = 5000;
var time = defineTime;
var listeningTime = defineTime;

/**
 * 初始化心跳机制
 */
const initHeart = (socket) => {
    count = 1;
    heartFailCount = 0;
    heartBack(socket);
    heart(socket);
};
const heart = (socket) => {
    if (muiUtils.getNetworkType() === 1) {
        setConnectStatus(3);
        clearTimeout(listeningTimeout);
        clearTimeout(timeout);
        return;
    }

    var connect = getConnectStatus();
    // log.log("heart connect status:"+connect);
    if (connect === 2) {
        log.log('通信连接建立失败，需要手动刷新连接！');
        clearTimeout(listeningTimeout);
        clearTimeout(timeout);
        return;
    }

    heartListening = 0;
    socket.emit('onHeartBeat', JSON.stringify({
        status: 0
    }));

    time = count * defineTime;
    if (count > 1) {
        listeningTime = (count - 1) * 1000;
    } else {
        listeningTime = defineTime;
    }
    if (time > 60000) {
        time = 60000;
    }
    count += 1;
    log.log('heart time:' + time);

    listeningTimeout = setTimeout(function() {
        // log.log("heard listening: "+heartListening);
        if (heartListening === 0) {
            heartFailCount = heartFailCount + 1;
            count = 1;
            log.log('heard listening fail count: ' + heartFailCount);
            if (heartFailCount >= 5) {
                setConnectStatus(2);
            }
        }
    }, listeningTime);

    timeout = setTimeout(function() {
        heart(socket);
    }, time);

};

const heartBack = (socket) => {
    // 心跳回调监听方法
    socket.on('onHeartBeat', function(data) {
        heartListening = data.status;
    });
};

/**
 * 连接状态操作方法
 */
const getConnectStatus = () => {
    return cacheUtils.localStorage(CONST.IMCHAT_PURCHASE).getObject(CONST.IMCHAT_CONNECT_STATUS);
};
const setConnectStatus = (status) => {
    cacheUtils.localStorage(CONST.IMCHAT_PURCHASE).setObject(CONST.IMCHAT_CONNECT_STATUS, status);
};

export default {
    initHeart,
    getConnectStatus,
    setConnectStatus
};
