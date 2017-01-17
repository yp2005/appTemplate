/**
 * @file 搜索页组件
 * @Author yupeng
 * 组件使用：
 *  引入：import searchPage from 'component/SearchPage';
 *  标签示例：<search-page :history-search-datas.sync="historySearchDatas" :model-name="modelName" @touchstart="blurSearch" @itemtap="historyDataSearch"></search-page>
 *  参数：
 *  @param {Array} historySearchDatas 最近搜索数据
 *  @param {String} modelName 模块名称，通过模块名称加上最近搜索缓存的key来更新缓存中的搜索历史
 * @public
 */


<template>
    <div class="search-page mui-scroll-wrapper">
        <div class="mui-scroll">
            <template v-if="hotSearch">
                <div class="hot-opb">
                    热门搜索
                </div>
                <div class="hot-search">
                    <a href="javascript:void(0);" v-for="data in hotSeachData" @tap="doSearch(data)">{{data}}</a>
                </div>
            </template>

            <div class="history-opb">
                最近搜索
            </div>
            <div class="history">
                <simple-list :listitem.sync="historySearchDatas" @itemtap="doSearch"></simple-list>
            </div>
            <div class="clears">
                <a v-if="historySearchDatas.length > 0" href="javascript:void(0);" @tap="clear">清空最近搜索</a>
            </div>
        </div>
    </div>
</template>

<script>
    import simpleList from 'component/list/SimpleList';
    import CONSTS from 'common/consts';
    import cache from 'common/cacheUtils';
    import muiUtils from 'common/muiUtils';
    import api from 'api';
    import log from 'common/logUtils';
    export default {
        data: function() {
            return {
                hotSeachData: []
            }
        },
        props: {
            historySearchDatas: Array,
            modelName: String,
            hotSearch: Boolean
        },
        methods: {
            clear: function() {
                var btnArray = ['取消', '确定'];
                var that = this;
                mui.confirm('确认清空历史搜索吗？', '操作提示', btnArray, function(e) {
                    if(e.index == 1) {
                        that.historySearchDatas = [];
                    }
                })

            },
            doSearch: function(data) { //向父组件触发最近搜索点击事件
                this.$dispatch('itemtap', data);
            }
        },
        watch: {
            historySearchDatas: function() {
                if(this.modelName) {
                    cache.localStorage(this.modelName).set(CONSTS.SEARCH_HISTORY_KEY, JSON.stringify(this.historySearchDatas));
                }
            }
        },
        created: function() {
            if(this.hotSearch) {
                var that = this;
                var params = {};
                muiUtils.muiAjax(api.GOODS_API.goods_hot_search, {
                    data: JSON.stringify(params),
                    contentType: 'application/json',
                    dataType: "json",
                    type: "post",
                    success: function(data) {
                        if(data.header.code === CONSTS.ERROR_CODE.SUCCESS) {
                            that.hotSeachData =  data.hot_search;
                        } else {
                            mui.toast(data.header.msg);
                        }
                    },
                    error: function(xhr, type, errorThrown) {
                        that.hotSearch = false;
                        log.info(type + ' ' + errorThrown, 'SearchPage.vue created');
//                      mui.toast("热门搜索数据请求失败！");
                    },
                    loading:false
                });
            }
        },
        ready: function() {
            var deceleration = mui.os.ios ? 0.003 : 0.0009;
            mui('.mui-scroll-wrapper').scroll({
                bounce: false,
                indicators: false, //是否显示滚动条
                deceleration: deceleration
            });
        },
        components: {
            simpleList
        }
    };
</script>
<style scoped>
    /*热门搜索*/
    
    .mui-scroll-wrapper {
        top: 45px;
    }
    
    .hot-search {
        height: auto;
        overflow: hidden;
        line-height: 1;
        padding: 12px 12px 0 12px;
        border-bottom: 8px solid #f2f2f2;
        background: #FFFFFF;
    }
    
    .hot-search> a {
        float: left;
        font-size: 12px;
        color: #222222;
        height: 24px;
        line-height: 24px;
        display: inline-block;
        padding: 0 12px;
        background: #f3f5f7;
        margin-bottom: 12px;
        margin-right: 12px;
        border-radius: 12px;
    }
    
    .history-opb,
    .hot-opb {
        height: 35px;
        line-height: 35px;
        text-align: left;
        text-indent: 12px;
        font-size: 13px;
        color: #999999;
        border: none;
        background: #FFFFFF;
    }
    
    .mui-table-view:before {
        background-color: #dbdbdb
    }
    
    .mui-table-view-cell:after {
        background-color: #dbdbdb
    }
    
    .hot-opb {
        /*border-bottom: solid 1px #dbdbdb;*/
       position: relative;
    }
    .hot-opb:after{
    	content: '';
		left: 0;
		bottom: 0;
		height: 1px;
		background: #dbdbdb;
		position: absolute;
		right: 0;
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
    }
    .clears {
        height: auto;
        overflow: hidden;
        text-align: center;
    }
    
    .clears> a {
        display: inline-block;
        height: 28px;
        line-height: 28px;
        font-size: 14px;
        border: 1px solid #999999;
        color: #999999;
        padding: 0 18px;
        min-width: 120px;
        -webkit-border-radius: 8px;
        -moz-border-radius: 8px;
        border-radius: 8px;
        margin-top: 36px;
    }
    
    .mui-table-view {
        background-color: #ffffff
    }
    
</style>