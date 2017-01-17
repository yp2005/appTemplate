<template>

<vheader :hdstyle="hdstyle" :in-search-page="inSearchPage" :search-value.sync="searchValue" :current-search-type.sync="searchType" :search-types="searchTypes" :typeclass="typeclass">
</vheader>
<div class="mui-content">
    <search-page :history-search-datas.sync="historySearchDatas" :hot-search="hotSearch" :model-name="modelName" @touchstart="blurSearch" @itemtap="historyDataSearch"></search-page>
</div>

</template>

<script>

import vheader from 'component/mui/Header';
import searchPage from 'component/SearchPage';
import muiUtils from 'common/muiUtils';
import cache from 'common/cacheUtils';
import arrayUtils from 'common/arrayUtils';
import CONSTS from 'common/consts';
// import api from 'api';
// import log from 'common/logUtils';
export default {
    data: function() {
        var historySearchDatas = cache.localStorage(plus.webview.currentWebview().modelName).get(CONSTS.SEARCH_HISTORY_KEY);
        var modelName = plus.webview.currentWebview().modelName;
        var typeclass = modelName && (modelName === 'home' || modelName === 'buyer_activity') ? 'goodsShops' : 'insearchpage';
        typeclass = modelName && modelName === 'contract' ? 'goodsShops3' : typeclass;
        typeclass = modelName && modelName === 'sellergoodsmanage' ? 'goodsShops' : typeclass;
        return {
            typeclass: typeclass,
            hdstyle: {
                searchBar: {
                    display: true,
                    placeholder: plus.webview.currentWebview().placeholder ? plus.webview.currentWebview().placeholder : '请输入关键字'
                },
                searchTypeBut: {
                    display: plus.webview.currentWebview().searchTypeBut ? true : 'none'
                },
                rightButton: {
                    display: true,
                    text: '取消',
                    onClick: function() {
                        plus.webview.currentWebview().close();
                    }
                }
            },
            historySearchDatas: historySearchDatas ? JSON.parse(historySearchDatas) : [],
            modelName: plus.webview.currentWebview().modelName,
            inSearchPage: true,
            searchValue: plus.webview.currentWebview().searchValue,
            parentPage: plus.webview.currentWebview().parentPage,
            gotoPage: plus.webview.currentWebview().gotoPage,
            fromSellerPage: plus.webview.currentWebview().fromSellerPage,
            searchTypes: plus.webview.currentWebview().searchTypeBut,
            hotSearch: plus.webview.currentWebview().hotSearch,
            searchType: plus.webview.currentWebview().searchType,
            extras: plus.webview.currentWebview().extras
        };
    },
    methods: {
        blurSearch: function() {
            mui('input[type=search]')[0].blur();
        },
        doSearch: function() {
            this.searchValue = this.searchValue.replace(/^\s*$/,'');
            if (this.searchValue !== '' && this.searchValue != null) {
                var index = arrayUtils.arrayIndex(this.historySearchDatas, this.searchValue);
                if (index !== -1) {
                    this.historySearchDatas.splice(index, 1);
                }
                if (this.historySearchDatas.length >= 15) {
                    this.historySearchDatas.pop();
                }
                this.historySearchDatas.unshift(this.searchValue);
            }
            else {
                mui.toast('请输入搜索关键字!');
                return;
            }

            if (this.gotoPage) {
                var id = this.gotoPage === '../../commonpage/buyinghall/index.html' ? 'seller_commonpage_buyinghall_index.html' : this.gotoPage;
                id = this.gotoPage === '../../buyer/homesearch/index.html' ? 'buyer_homesearch_index.html' : id;
                if(id === 'buyer_homesearch_index.html' && this.extras && this.extras.store_id) {
                    id += '_' + this.extras.store_id + '_' + plus.webview.all().length;
                }
                muiUtils.openWindow(this.gotoPage, id, {
                    extras: {
                        'searchValue': this.searchValue,
                        'searchType': this.searchType,
                        'fromSellerPage': this.fromSellerPage,
                        'extras': this.extras
                    },
                    isClose: true
                });
            } else {
                mui.fire(plus.webview.getWebviewById(this.parentPage), 'doSearch', {
                    searchValue: this.searchValue,
                    searchType: this.searchType
                });
                plus.webview.currentWebview().close();
            }
        },
        /**
         * @desc 点击搜索记录进行搜索
         * @param {String} item 点击的历史记录的值
         */
        historyDataSearch: function(item) {
            this.searchValue = item;
            this.doSearch();
        }
    },
    ready: function() {
        var nativeWebview = plus.webview.currentWebview().nativeInstanceObject();
        if (mui.os.android) {
            var main = plus.android.runtimeMainActivity();
            var Context = plus.android.importClass('android.content.Context');
            var InputMethodManager = plus.android.importClass('android.view.inputmethod.InputMethodManager');
            var imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
            plus.android.importClass(nativeWebview);
            nativeWebview.requestFocus();
            imm.toggleSoftInput(0, InputMethodManager.SHOW_FORCED);
            setTimeout(function() {
                mui('input[type=search]')[0].focus();
            }, 50);
        } else {
            nativeWebview.plusCallMethod({
                'setKeyboardDisplayRequiresUserAction': false
            });
            setTimeout(function() {
                mui('input[type=search]')[0].focus();
            }, 200);
        }
    },
    components: {
        vheader,
        searchPage
    }
};

</script>

<style>

.mui-backdrop {
    background-color: rgba(0, 0, 0, 0);
}

.mui-content {
    background-color: #ffffff;
}

</style>
