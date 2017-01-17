'use strict';
/*!
 * muiUitls.js v1.0.0
 * 基于mui进行封装的工具类<br>
 *
 * Author: liaoxm
 * Date: 2016-06-16
 * 使用方法：
 *        import muiUitls from 'muiUitls.js'
 *        muiUitls.openWindow(url,id,opts)
 */
import merge from 'webpack-merge';
import logger from './logUtils';
import propUtils from './propUtils';
import utils from './utils';
import cacheUtils from './cacheUtils';
import pageUrl from 'api';
import CONSTS from './consts';
import { delAllFile } from './image-utils';


/**
 * 打开新窗口
 * @param {string} url 要打开的页面地址
 * @param {string} id 指定页面ID
 * @param {object} options 可选:参数,等待,窗口,显示配置{params:{},waiting:{},styles:{},show:{},isValidLogin,isClose}
 * 通过isValidLogin来确定是否做登录验证，true|false，默认false
 * 通过isClose来确定是否需要关闭当前webview，默认false
 * 默认是从右边划出，动画时间是500ms
 * @public
 */
const openWindow = (url, id, options) => {
    if (unsafeTap()) {
        return false;
    }
  // 判断网络情况，无网直接跳网络异常页面
  //  if (getNetworkType() === 1) {
  //      forwordError();
  //      return false;
  //  }
    id = id || url;
    options = options || {};

    if (typeof id === 'object') {
        options = id;
        id = url;
    }
  // 处理默认值
    options = merge({
        styles: {
            popGesture: 'close',
            softinputMode: 'adjustResize'
        },
        show: {
            autoShow: true,
            aniShow: 'pop-in',
            duration: 300
        },
        waiting: {
            autoShow: false // 自动显示等待框，默认为true
        },
        createNew: false
    }, options || {});

    let blacklist = propUtils.getProperty('webview.id.blacklist', 'urlprops');
    if (!blacklist.some(item => item === id)) {
        cacheUtils.localStorage(CONSTS.PREFIX_LOGIN).setObject(CONSTS.LOGIN_FORWORD, {
            url: url,
            id: id,
            options: options || {}
        });
        logger.log('缓存的url:' + url);
    }

  // 是否需要验证登录
    if (options.isValidLogin === true) {
        if (loginValid() === false) {
            return false;
        }
    }
    //强制将要离开的界面关闭键盘(ios7.0 bug)
    hideKeyBord();
    setStatusStyleForPageId(id);
    let gotoPage = plus.webview.getWebviewById(id);
    let pagelist = propUtils.getProperty('webview.preload.whiltlist', 'urlprops');
    if (gotoPage && !options.createNew) {
        if (pagelist.some(item => item === id)) {
            mui.fire(gotoPage, CONSTS.WEBVIEW_SHOW_EVENT, options.extras);
        }
        gotoPage.hide(); // 只有先hide再show才能出动画
        gotoPage.show(options.show.aniShow, options.show.duration);
    } else {
        gotoPage = mui.openWindow(url, id, options);
        if (!pagelist.some(item => item === id)) {
            controlOpenPage(id);
        }
    }
  // 延迟一秒关闭当前webview
    if (options.isClose === true) {
        setTimeout(function() {
      // 去掉关闭动画
            closWebview();
        }, 1100);
    }
    setTimeout(function() {
        popGestureEvent(gotoPage);
    }, 300);
    return gotoPage;
};

/**
 * 根据内存状态设置状态栏样式，非主页页面使用
 */
const setStatusStyle = () => {
    if (!plus) {
        return;
    }
    if (window.localStorage.getItem('openwindow_seller_index') === '0') {
        plus.navigator.setStatusBarBackground('#419fdc');
    } else {
        plus.navigator.setStatusBarBackground('#f04e30');
    }
    plus.navigator.setStatusBarStyle('UIStatusBarStyleBlackOpaque');
};

/**
 * 根据页面id设置状态栏样式，只有两个主页需要关注
 * @param {[type]} id [description]
 */
const setStatusStyleForPageId = id => {
    if (!plus) {
        return;
    }
    if (id === 'main') {
    // plus.navigator.setStatusBarBackground('#f04e30');
    // plus.navigator.setStatusBarStyle('UIStatusBarStyleBlackOpaque');
        window.localStorage.setItem('openwindow_seller_index', '1');
    } else if (id === 'seller_index') {
    // plus.navigator.setStatusBarBackground('#419fdc');
    // plus.navigator.setStatusBarStyle('UIStatusBarStyleBlackOpaque');
        window.localStorage.setItem('openwindow_seller_index', '0');
    }
    setStatusStyle();
};

/**
 * 控制连续点击多次打开窗口
 * 目前的开窗口动画300，在这个时间内多次点击会打开多个webview，所以将时间设置成500，保证手速再快也只能响应一次
 * @type {[type]}
 */
var tapFirst = null;
const unsafeTap = () => {
    if (!tapFirst) {
        tapFirst = new Date().getTime();
        setTimeout(function() {
            tapFirst = null;
        }, 500);
    } else {
        return true;
    }
};

/**
 * 监听侧滑事件
 * @type {[type]}
 */
/* eslint-disable no-unused-vars*/
const popGestureEvent = gotoPage => {
    let sbb = null;
    let sbs = null;
    gotoPage.addEventListener('popGesture', function(e) {
        sbb = sbb || plus.navigator.getStatusBarBackground();
        sbs = sbs || plus.navigator.getStatusBarStyle();
        if (e.type === 'end') {
            if (e.result === false) {
        // 侧滑取消，还原状态栏样式
                plus.navigator.setStatusBarBackground(sbb);
                plus.navigator.setStatusBarStyle(sbs);
            }
        }
        if (e.type === 'move' && e.progress > 55) {
            let id = plus.webview.currentWebview().id;
            if (id === 'main') {
                setStatusStyleForPageId('main');
            }
        }
    }, false);
};

/**
 * 控制新开页面数量，最大开20个页面，不包括预加载的页面，超过20个就砍掉最开始的第一个
 * @param  {String} id 新开页面的id
 * @return {void}
 */
const controlOpenPage = id => {
    let maxNum = propUtils.getProperty('open_page_num', 'UIprops');
    let allView = plus.webview.all();
    let pagelist = propUtils.getProperty('webview.preload.whiltlist', 'urlprops');
    allView = allView.filter(item => !pagelist.some(id => id === item.id));
    if (allView.length > maxNum) {
        logger.log(maxNum + 'openPage is max:' + allView.length, 'controlOpenPage()');
        setTimeout(function() {
            allView.splice(0, 1).map(id => {
                plus.webview.close(id, 'none');
            });
        }, 1000);
    }
};

/**
 * 关闭新开的页面，除了预加载的页面
 * @return {[type]} [description]
 */
const closeAllOpenPage = () => {
    let allView = plus.webview.all();
    let pagelist = propUtils.getProperty('webview.preload.whiltlist', 'urlprops');
    allView = allView.filter(item => !pagelist.some(id => id === item.id));
    logger.log('closeAllOpenPage is max:' + allView.length, 'closeAllOpenPage()');
    setTimeout(function() {
        allView.map(id => {
            plus.webview.close(id, 'none');
        });
    }, 1000);
};

/**
 * 登录跳转打开上一次打开的窗口，需要刷新webview
 * 默认是从右边划出，动画时间是500ms
 * @param {object} options 可选:参数,等待,窗口,显示配置{params:{},waiting:{},styles:{},show:{}}
 * @public
 */
const openPreWindow = (options) => {
  // 缓存读取id。通过id来开页面，如果没有就跳首页
    let o = cacheUtils.localStorage(CONSTS.PREFIX_LOGIN).getObject(CONSTS.LOGIN_FORWORD) || pageUrl.PAGE_URL.buyer_index;
    options = options || {};
  // 处理默认值
    options = merge(o.options || {}, options || {});
    options = merge({
        styles: {
            popGesture: 'close'
        },
        show: {
            autoShow: true,
            aniShow: 'pop-in',
            duration: 300
        },
        waiting: {
            autoShow: false // 自动显示等待框，默认为true
        }
    }, options || {});
  //  options.createNew = true;//重复新开一个webview，解决刷新数据刷新问题
    let login = true;
    let gotoPage = plus.webview.getWebviewById(o.id);
    if (o.id === pageUrl.PAGE_URL.buyer_index.id) {
        let accessToken = cacheUtils.localStorage(CONSTS.PREFIX_LOGIN).get(CONSTS.LOGIN_ACCESS_TOKEN);
        if (accessToken === undefined || accessToken == null || accessToken === '' || accessToken === 'null') {
            login = false;
        }
        if (options.openIndex !== undefined) {
            mui.fire(gotoPage, 'home_nav', {
                index: options.openIndex
            });
        }
        setTimeout(() => {
            gotoPage.hide();
            gotoPage.show(options.show.aniShow, options.show.duration);
        }, 300);
        if (login === false) {
            mui.fire(plus.webview.getWebviewById(o.id), CONSTS.LOGIN_OUT_EVENT, {});
            return;
        }
        mui.fire(gotoPage, CONSTS.LOGIN_COMPUTER_EVENT, {});
        setTimeout(function() {
            closWebview();
        }, 1000);
    } else if (gotoPage) {
    // 纯按钮操作，不涉及页面, 必须将去向页面show处理，中间有几个页面，仅仅关闭当前页面是不够的
        mui.fire(gotoPage, CONSTS.LOGIN_COMPUTER_EVENT, {});
        setTimeout(() => {
            gotoPage.hide();
            gotoPage.show(options.show.aniShow, options.show.duration);
        }, 300);
        setTimeout(() => {
            plus.webview.currentWebview().close('none');
        }, 1000);
    } else {
    // 跳转到目标页面
        mui.openWindow(o.url, o.id, options);
        setTimeout(function() {
            plus.webview.currentWebview().close('none');
        }, 500);
    }
};

/**
 * 打开首页
 * @param {string} type 打开的首页类型
 * buyer(买家首页) seller(卖家首页)
 * @public
 */
const openIndexWindow = (type, options) => {
    options = options || {};
    let openIndex = options.openIndex || 0;
    mui.fire(plus.webview.getWebviewById(pageUrl.PAGE_URL.buyer_index.id), 'home_nav', {
        index: openIndex
    });
    let id = pageUrl.PAGE_URL.buyer_index.id;
    let url = pageUrl.PAGE_URL.buyer_index.url;
    if (type === 'seller') {
        id = pageUrl.PAGE_URL.seller_index.id;
        url = pageUrl.PAGE_URL.seller_index.url;
    }
  // openWindow(url, id);
    setTimeout(function() {
        openWindow(url, id, options);
    }, 300);
};

const closWebview = () => {
    if (plus.webview.currentWebview().id !== 'main') {
        plus.webview.currentWebview().close('none');
    }
};

/**
 * 手机网络状态
 * CONNECTION_UNKNOW: 网络连接状态未知  0
 * CONNECTION_NONE: 未连接网络 1
 * CONNECTION_ETHERNET: 有线网络 2
 * CONNECTION_WIFI: 无线WIFI网络 3
 * CONNECTION_CELL2G: 蜂窝移动2G网络 4
 * CONNECTION_CELL3G: 蜂窝移动3G网络 5
 * CONNECTION_CELL4G: 蜂窝移动4G网络 6
 * @return { Number} 连接状态数值
 * @public
 */
const getNetworkType = () => {
    let types = {};
    types[plus.networkinfo.CONNECTION_UNKNOW] = 'Unknown connection';
    types[plus.networkinfo.CONNECTION_NONE] = 'None connection';
    types[plus.networkinfo.CONNECTION_ETHERNET] = 'Ethernet connection';
    types[plus.networkinfo.CONNECTION_WIFI] = 'WiFi connection';
    types[plus.networkinfo.CONNECTION_CELL2G] = 'Cellular 2G connection';
    types[plus.networkinfo.CONNECTION_CELL3G] = 'Cellular 3G connection';
    types[plus.networkinfo.CONNECTION_CELL4G] = 'Cellular 4G connection';
    logger.log('networkinfo:' + plus.networkinfo.getCurrentType(), 'getNetworkType()');
    return plus.networkinfo.getCurrentType();
};

/**
 * 手机网络状态
 * CONNECTION_UNKNOW: 网络连接状态未知  0
 * CONNECTION_NONE: 未连接网络 1
 * CONNECTION_ETHERNET: 有线网络 2
 * CONNECTION_WIFI: 无线WIFI网络 3
 * CONNECTION_CELL2G: 蜂窝移动2G网络 4
 * CONNECTION_CELL3G: 蜂窝移动3G网络 5
 * CONNECTION_CELL4G: 蜂窝移动4G网络 6
 * @return { Number} 连接状态数值
 * @public
 */
const getNetworkTypeZH = () => {
    let types = {};
    types[plus.networkinfo.CONNECTION_UNKNOW] = '网络连接状态未知';
    types[plus.networkinfo.CONNECTION_NONE] = '未连接网络';
    types[plus.networkinfo.CONNECTION_ETHERNET] = '有线网络';
    types[plus.networkinfo.CONNECTION_WIFI] = 'WiFi网络';
    types[plus.networkinfo.CONNECTION_CELL2G] = '2G网络';
    types[plus.networkinfo.CONNECTION_CELL3G] = '3G网络';
    types[plus.networkinfo.CONNECTION_CELL4G] = '4G网络';

    return types[plus.networkinfo.getCurrentType()];
};

/**
 * ajax方法的封装
 * @param {object} options 配置的参数
 * @public
 */
const forwordError = (options) => {
    options = options || {};
    let url = pageUrl.PAGE_URL.error_connect.url;
    let id = pageUrl.PAGE_URL.error_connect.id;
    logger.log(id + 'forwordError:' + url, 'forwordError()');
    mui.openWindow(url, id, {});
};

/**
 * ajax方法的封装,增加一个参数，如果不需要进行加载动画时，需要显示设置为false
 * options.loading = false;默认值是true
 * @param {string} url 要打开的页面地址
 * @param {string} options 配置的参数，具体的参数配置同mui的ajax参数
 * @public
 */
const muiAjax = (url, options) => {
    if (options.loading === undefined) {
        options.loading = true;
    }
    logger.log('url:' + url + ' options:' + utils.stringify(options));
  //  mui.ajaxSettings.beforeSend = ajaxBeforeSend;
    mui.ajaxSettings.inspect = ajaxInspect;
    mui.ajaxSettings.success = ajaxSuccess;
    mui.ajaxSettings.error = ajaxError;
    mui.ajaxSettings.complete = ajaxComplete;
  /**
   * ajax超时时间设置为10秒
   */
    mui.ajaxSettings.timeout = 10000;
    if (ajaxBeforeSend(options, url) === false) {
        logger.log('ajaxBeforeSend has return false', 'muiAjax ajaxBeforeSend');
    //      options.error();
        return false;
    }
    mui.ajax(url, options);
};

/**
 * 带回调函数的登录验证方法
 * @param  {Function} cb 回调函数，登录成功之后调用，用来处理登录之后的后续逻辑
 * @param  {Object} opt   回调参数
 * @return {void}           无返回
 */
const loginValid = (cb, opt) => {
    let accessToken = cacheUtils.localStorage(CONSTS.PREFIX_LOGIN).get(CONSTS.LOGIN_ACCESS_TOKEN);
    if (accessToken === undefined || accessToken == null || accessToken === '' || accessToken === 'null') {
    // 未登录，打开登录页面
        let ops = {
            styles: {
                popGesture: 'close',
                softinputMode: 'adjustResize'
            },
            show: {
                autoShow: true,
                aniShow: 'pop-in',
                duration: 300
            },
            waiting: {
                autoShow: false // 自动显示等待框，默认为true
            },
            createNew: false
        };
        if (cb !== undefined && typeof cb === 'function') {
      // 开启监听，等待登录完成
            window.addEventListener(CONSTS.LOGIN_COMPUTER_EVENT, e => {
                logger.log(CONSTS.LOGIN_COMPUTER_EVENT, 'loginValidHasCb');
        // 确保callback是一个函数
                if (typeof cb === 'function') {
                    cb(opt);
                } else {
                    logger.log('cbSuccess must be function!');
                }
            });
        }
        mui.openWindow(pageUrl.PAGE_URL.login_index.url, pageUrl.PAGE_URL.login_index.id, ops);
        return false;
    } else {
        if (cb !== undefined && typeof cb === 'function') {
            cb(opt);
        }
        return true;
    }
};

/**
 * 开始,return false 就会终止ajax请求
 * 1.判断网络状态
 * 2.set头部信息
 * @param {XMLHttpRequest} xhr XMLHttpRequest对象
 * @param {Object} setting 参数
 * @private
 */
const ajaxBeforeSend = (options, url) => {
  //  logger.log('ajaxBeforeSend', 'muiUtils.js');
  //  if (getNetworkType() === 1) {
  //      forwordError();
  //      return false;
  //  }
  // 设置头部认证信息
    options.headers = options.headers || {};
    let token = cacheUtils.localStorage(CONSTS.PREFIX_LOGIN).get(CONSTS.LOGIN_ACCESS_TOKEN);
    let instanceId = cacheUtils.localStorage(CONSTS.PREFIX_LOGIN).get(CONSTS.APP_INSTANCE_ID);
    if (instanceId === undefined || instanceId == null || instanceId === '' || instanceId === 'null') {
        instanceId = utils.uuidV4();
        cacheUtils.localStorage(CONSTS.PREFIX_LOGIN).set(CONSTS.APP_INSTANCE_ID, instanceId);
    }

    options.headers.instance_id = instanceId;
    options.headers.access_token = (token === 'null' || token == null) ? '' : token;
    options.headers.reqStartTime = new Date().getTime(); // 请求开始时间
    options.headers.url = url; // 打印而已
  // 开启加载动画
    if (options.loading === true) {
        let w = plus.nativeUI.showWaiting('处理中...');
        options.nativeUI = w;
    }
};

/**
 * 拦截器，拦截ajax回调，处理权限等
 * @param {Object} data api给的结果
 * @param {String} xhr  XMLHttpRequest对象
 * @param {XMLHttpRequest} setting  传入的参数对象
 * @private
 */
const ajaxInspect = (data, xhr, setting) => {
  //  logger.log(JSON.stringify(setting.inspecterror) + 'require data before deal:' + JSON.stringify(data), 'inspecttype' + setting.inspecttype);
  // 关闭加载动画
    if (setting.nativeUI !== undefined) {
        setting.nativeUI.close();
    }
    let reqTime = new Date().getTime() - setting.headers.reqStartTime;
    logger.log('url:' + setting.url);
    logger.log('ajaxInspect reqTime:' + reqTime, 'ajaxInspect()');
    if (data === 'error') { // 异常处理
        logger.log('errorType:' + setting.inspecttype, 'error');
        logger.log('error:' + setting.inspecterror, 'error');
    } else { // 正常处理
    // 将API返回的data数据处理成统一格式
        let tempData = data.result_data || {};
        data.header = {
            code: data.error_code + '',
            msg: data.error_message
        };
        Object.keys(tempData).map(item => {
            data[item] = tempData[item];
        });
        delete data.error_code;
        delete data.error_message;
        delete data.error_data;
        delete data.result_data;
        logger.log('require data after deal:' + JSON.stringify(data));
    // 当在函数体内使用赋值操作时，系统就创建了一个变量名为data的变量。这个data是函数内部的变量，对它进行赋值当然只在函数体内起作用，外面的data还是原来的data,对对象进行修改就会反映到外部data上，因为对象和数组都是传递的引用
    // data = tempData;
        if (data.header !== undefined && data.header.code === CONSTS.ERROR_CODE.INSUFFICIENT_PERMISSIONS) {
            logger.log('权限不足', 'ajaxInspect');
            if (loginValid() === false) {
                setting.error();
                return false;
            }
        }
        let instanceId = xhr.getResponseHeader(CONSTS.APP_INSTANCE_ID);
        if (instanceId === cacheUtils.localStorage(CONSTS.PREFIX_LOGIN).get(CONSTS.APP_INSTANCE_ID)) {
            logger.log("it's my require!!!!", 'valid instanceId is ok');
        } else {
            logger.log('it is not  my require!!!!,the token is no safe,please login again and change password,' + instanceId, 'valid instanceId is nok');
    // 测试阶段，直接忽略，上线了可以开启
    // return false;
        }
    // 更新token
        let token = xhr.getResponseHeader(CONSTS.LOGIN_ACCESS_TOKEN) || cacheUtils.localStorage(CONSTS.PREFIX_LOGIN).get(CONSTS.LOGIN_ACCESS_TOKEN);
    // logger.log(token, 'CONSTS.LOGIN_ACCESS_TOKEN ajaxInspect');
        cacheUtils.localStorage(CONSTS.PREFIX_LOGIN).set(CONSTS.LOGIN_ACCESS_TOKEN, token);
    }
  // 返回true就是放过，false就拦截后面的请求，目前拦截了error和sucess
    return true;
};

/**
 * 成功
 * @param {Object} data api给的结果
 * @param {String} xhr  XMLHttpRequest对象
 * @param {XMLHttpRequest} setting  传入的参数对象
 * @private
 */
const ajaxSuccess = (data, xhr, setting) => {
    logger.log('ajaxSuccess' + data, 'muiUtils.js');
};

/**
 * 出错
 * @private
 */
const ajaxError = (error, type, xhr, setting) => {
    logger.log('ajaxError' + error + type, 'muiUtils.js');
};

/**
 * 结束
 * @private
 */
const ajaxComplete = (status, xhr, setting) => {
    let reqTime = new Date().getTime() - setting.headers.reqStartTime;
  //  logger.log('ajaxComplete reqStartTime:' + setting.headers.reqStartTime + 'reqEndTime:' + new Date().getTime(), 'ajaxComplete()');
    logger.log('ajaxComplete reqTime:' + reqTime, 'ajaxComplete()');
//  logger.log('ajaxComplete', 'ajaxComplete()');
};

/**
 * 获取登录用户信息
 * @public
 * return 用户登录返回用户对象，用户未登录返回null
 */
const getLoginUserInfo = () => {
    let accessToken = cacheUtils.localStorage(CONSTS.PREFIX_LOGIN).get(CONSTS.LOGIN_ACCESS_TOKEN);
    if (accessToken === 'undefined' || accessToken == null || accessToken === '' || accessToken === 'null') {
        return {};
    } else {
        let localStorage = cacheUtils.localStorage(CONSTS.PREFIX_LOGIN);
        let userInfo = localStorage.getObject(CONSTS.USER_INFO);
        return userInfo;
    }
};

/**
 * 清空缓存，包括图片
 * @param {Boolean} onlyMemory true 仅仅清理内存数据，否则一并清理图片
 * @public
 */
const clearMemory = (onlyMemory) => {
    let instanceId = window.localStorage.getItem(CONSTS.PREFIX_LOGIN + '_' + CONSTS.APP_INSTANCE_ID);
    let accessToken = window.localStorage.getItem(CONSTS.PREFIX_LOGIN + '_' + CONSTS.LOGIN_ACCESS_TOKEN);
    let userInfo = window.localStorage.getItem(CONSTS.PREFIX_LOGIN + '_' + CONSTS.USER_INFO);
    window.localStorage.clear();
    cacheUtils.cookie.clear();
    window.sessionStorage.clear();
    if (onlyMemory !== true) {
        delAllFile();
    }
    cacheUtils.localStorage(CONSTS.PREFIX_LOGIN).set(CONSTS.APP_INSTANCE_ID, instanceId === undefined ? '' : instanceId);
    cacheUtils.localStorage(CONSTS.PREFIX_LOGIN).set(CONSTS.LOGIN_ACCESS_TOKEN, accessToken === undefined ? '' : accessToken);
    cacheUtils.localStorage(CONSTS.PREFIX_LOGIN).set(CONSTS.USER_INFO, userInfo === undefined ? '' : userInfo);
//  window.localStorage.setItem(CONSTS.PREFIX_LOGIN + '_' + CONSTS.APP_INSTANCE_ID, instanceId === undefined ? '' : instanceId);
//  window.localStorage.setItem(CONSTS.PREFIX_LOGIN + '_' + CONSTS.LOGIN_ACCESS_TOKEN, accessToken === undefined ? '' : accessToken);
};

/**
 * 输入框获取焦点被底部fix定位所遮盖,光标丢失,处于输入状态时跳转新的webview。
 * 输入键盘不消失,点击键盘中的完成时,键盘消失,但界面出现白屏。注意（此处没有加入横竖屏判断,只适用于手机竖屏）
 * @private
 */
const hideKeyBord = (url) => {
    if(document.documentElement.clientHeight < plus.webview.currentWebview().pageOldH){
    	var nativeWebview = plus.webview.currentWebview().nativeInstanceObject();
    	if (mui.os.android) {//安卓暂时没有发现此问题如果有请把它放开
//          var main = plus.android.runtimeMainActivity();
//          var Context = plus.android.importClass('android.content.Context');
//          var InputMethodManager = plus.android.importClass('android.view.inputmethod.InputMethodManager');
//          var imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
//          plus.android.importClass(nativeWebview);
//          nativeWebview.requestFocus();
//          imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
        } 
        if(mui.os.ios){
        	var tagName = document.activeElement.tagName.toLowerCase();
			if(tagName=='input'||tagName=='textarea'){
				document.activeElement.blur();
				return;
			}
    		nativeWebview.plusCallMethod({
                'setKeyboardDisplayRequiresUserAction': false
            });
            var input = document.createElement('input');
	    	document.body.appendChild(input);
	        input.focus();
			input.blur();
			document.body.removeChild(input);
			input=null;
        }
    }
};

export default {
    openWindow,
    openPreWindow,
    openIndexWindow,
    getNetworkType,
    getNetworkTypeZH,
    forwordError,
    muiAjax,
    loginValid,
    getLoginUserInfo,
    clearMemory,
    closeAllOpenPage,
    setStatusStyle,
    setStatusStyleForPageId
};
