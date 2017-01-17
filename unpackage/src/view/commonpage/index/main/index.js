// 引入vue
import Vue from 'vue';
import VueRouter from 'vue-router';
import app from './app';
import muiUtils from 'common/muiUtils';
import CONSTS from 'common/consts';
import pageUrl from 'api';
import vheader from 'component/mui/Header.vue';
import vnav from 'component/mui/NavTabbar.vue';

Vue.use(VueRouter);
let router = new VueRouter();

//mui生命周期管理
mui.init({
    swipeBack: false
});
mui.plusReady(function() {
    router.start(app, '#app');
});

let isLogin = (muiUtils.getLoginUserInfo() || {}).user_type === 2;
// 用户是卖家时候才显示首页切换按钮
let homeSwitchButtonDisplay = 'none';
if (isLogin) { // 已登录
  // let user_type = CONSTS.USER_TYPE;
  // 如果是供应商，跳转到卖家首页
    if (muiUtils.getLoginUserInfo().user_type === 2) {
        homeSwitchButtonDisplay = 'block';
    }
}

// head 和 foot所用参数
let hdstyle = {
    homeSwitchButton: {
        display: homeSwitchButtonDisplay,
        text: '买家版',
        homeSwitch: function() {
            muiUtils.openWindow('../../seller/index/sellerindex.html', pageUrl.PAGE_URL.seller_index.id, {
                styles: {
                    popGesture: 'none'
                }
            });
        }
    },
    title: {
        display: 'none'
    },
    searchBar: {
        display: true,
        placeholder: '请输入关键字',
        modelName: 'home', // 搜索历史在本地缓存中存放的key
        searchTypeBut: [{ // 搜索页是否显示搜索类型下拉菜单按钮，不显示不要设置这个值
            name: '商品',
            value: 'goods'
        }, {
            name: '店铺',
            value: 'store'
        }],
        hotSearch: true,
        gotoPage: '../../buyer/homesearch/index.html'
    },
    rightButton: {
        display: 'none',
        text: '编辑',
        onClick: function(that) {
            let webview = plus.webview.currentWebview();
            if (that.hdstyle.rightButton.text === '编辑') {
                that.hdstyle.rightButton.text = '完成';
                that.title = '已选择(0)';
                mui.fire(webview, 'isedit', {
                    edit: false
                });
            } else {
                that.hdstyle.rightButton.text = '编辑';
                that.title = '采购单';
                mui.fire(webview, 'isedit', {
                    edit: true
                });
            }
        } // 右侧按钮点击事件处理方法
    },
    rightBarcodeBtn: {
        display: true,
        color: '#ffffff',
        onClick: function() {
            if (mui.os.android) {
                muiUtils.openWindow('../../commonpage/barcodescan/index.html', 'commonpage_barcodescan_index.html');
            } else {
                muiUtils.openWindow('../../commonpage/barcodescan/index.html', 'commonpage_barcodescan_index.html', {
                    styles: {
                        popGesture: 'none'

                    },
                    show: {
                        aniShow: 'slide-in-top',
                        autoShow: true,
                        duration: 300
                    }
                });
                setTimeout(() => {
                    plus.navigator.setStatusBarBackground('#000000');
                    plus.navigator.setStatusBarStyle('UIStatusBarStyleDefault');
                    plus.navigator.setFullscreen(true);
                }, 100);
            }
        }
    }
};
let hrefes = [{
    href: '/home',
    text: '首页',
    icon: 'icon-shouye'
}, {
    href: '/type',
    text: '分类',
    icon: 'icon-fenlei'
}, {
    href: '/order',
    text: '采购单',
    icon: 'icon-caigoudan'
}, {
    href: '/mine',
    text: '我的',
    icon: 'icon-gerenzhongxin'
}];
let typeclass = isLogin ? 'buyHome' : 'buyHomeNoLogin';
let index = 0;
let showHeader = true;
// 头部head start
let HeaderVue = Vue.extend(vheader);
let header = new HeaderVue({
    propsData: {
        hdstyle: hdstyle,
        typeclass: typeclass,
        title: hrefes[index].text,
        showHeader: showHeader
    },
    el: 'vheader'
});
// 头部head end

// 尾部foot start
let FootVue = Vue.extend(vnav);
/*eslint-disable no-unused-vars */
let footer = new FootVue({
    propsData: {
        hdstyle: hdstyle,
        hrefes: hrefes,
        typeclass: typeclass,
        showHeader: showHeader,
        index: index
    },
    el: 'vnav',
    watch: {
        index: function() {
            header.hdstyle = this.hdstyle;
            header.title = hrefes[this.index].text;
            header.typeclass = this.typeclass;
            header.showHeader = this.showHeader;
            header.navIndex = this.index;
            router.app.index = this.index;
        }
    }
});
// 尾部 end

// 两次点击返回
let first = null;
mui.back = function() {
  // 首次按键
    if (!first) {
        first = new Date().getTime();
        mui.toast('再按一次退出');
        setTimeout(function() {
            first = null;
        }, 1000);
    } else {
        if (new Date().getTime() - first < 1000) {
            plus.runtime.quit();
        }
    }
};

// 监听页面返回首页事件
window.addEventListener(CONSTS.WEBVIEW_SHOW_EVENT, function(event) {
  // console.log('页面返回首页事件');
    if (muiUtils.getLoginUserInfo()) { // 已登录
    // let user_type = CONSTS.USER_TYPE;
    // 如果是供应商，跳转到卖家首页
        if (muiUtils.getLoginUserInfo().user_type === 2 && footer.index === 0) {
            hdstyle.homeSwitchButton.display = 'block';
            header.typeclass = 'buyHome';
        } else {
            header.hdstyle.homeSwitchButton.display = 'none';
            typeclass = 'buyHomeNoLogin';
        }
    }
});
// 监听跳转采购单
window.addEventListener('toptext', function(event) {
    hdstyle.rightButton.text = event.detail.toptext;
    header.title = event.detail.title;
});
// 监听购买数量
window.addEventListener('buytype', function(event) {
    if (hdstyle.rightButton.text === '编辑') {
        header.title = '采购单';
    } else {
        header.title = '已选择(' + event.detail.buytype + ')';
    }
});
