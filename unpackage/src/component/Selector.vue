/*!
 * Selector.vue v1.0.0
 * 索引列表选择器组件
 *
 * Author: liyubai
 * Date: 2016-06-23
 *
 * 标签引用: <selector :groupDatas="groupDatas" :selectorDatas="selectorDatas"
 *    :selectValue.sync="selectValue" :showSearch="true" :callback="selectorCallBack"></selector>
 *
 * @param groupDatas 索引分组列表
 *          groupValue: 分组名称
 * @param selectorDatas 选择项数据集合
 *          groupValue: 分组名称
 *          groupData: 选择项集合
 *              dataTag: 选择项的标记
 *              dataName: 选择项名称
 * @param selectValue 选择的值
 * @param showSearch 是否显示顶部搜索栏
 * @param callback 选择回调函数，传入当前选择项信息
 *
 */

<template>
    <div class="mui-scroll-wrapper mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
        <div id='list' class="mui-indexed-list">
            <div style="display: {{showSearch}};" class="mui-indexed-list-search mui-input-row mui-search">
                <input type="search" class="mui-input-clear mui-indexed-list-search-input selector-list-search-input" placeholder="搜索">
            </div>
            <div class="mui-indexed-list-bar" id="listBar">
                <a v-for="group in groupDatas">{{group.groupValue}}</a>
            </div>
            <div class="mui-indexed-list-alert"></div>
            <div class="mui-indexed-list-inner">
                <div class="mui-indexed-list-empty-alert">没有数据</div>
                <ul class="mui-table-view">
                    <template v-for="selectorData in selectorDatas">
                        <li data-group="{{selectorData.groupValue}}"
                            class="mui-table-view-divider mui-indexed-list-group">{{selectorData.groupValue}}</li>
                        <li v-for="item in selectorData.groupData" @tap="selectorValue(item);"
                            data-value="{{selectorData.groupValue}}" data-tags="{{item.dataTag}}"
                            class="mui-table-view-cell mui-indexed-list-item">
                                <div v-if="item.imageUrl"><img src="{{item.imageUrl}}" style="border-radius:30px" alt=""></div>
                                <div>
                                    <h4>{{item.dataName}}</h4>
                                    <span>{{item.desc}}</span>
                                </div>
                            </li>
                    </template>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import muiIndexedList from 'static/js/mui.indexedlist.js';
    export default {
        props: {
            showSearch: { //是否显示搜索框
                type: String,
                default: 'none'
            },
            groupDatas: {
                type: Array,
                default: [{
                    groupValue: 'S'
                },{
                    groupValue: 'Y'
                },{
                    groupValue: 'Z'
                }]
            },
            selectorDatas: {
                type: Array,
                default: [{
                    groupValue: 'S',
                    groupData:[{
                        dataTag: 'ShunFengSuDi',
                        dataName: '顺丰速递'
                    }]
                },{
                    groupValue: 'Y',
                    groupData:[{
                        dataTag: 'YunDaKuaiDi',
                        dataName: '韵达快递'
                    }]
                },{
                    groupValue: 'Z',
                    groupData:[{
                        dataTag: 'ZhongTongKuaiDi',
                        dataName: '中通快递'
                    }]
                }]
            },
            selectValue: {
                type: String,
                default: ''
            },
            callback:Function
        },
        methods: {
            selectorValue: function(item){
                if(this.callback){
                    this.callback(item);
                }else{
                    this.selectValue = item.dataTag;
                    mui.back();
                }
            }
        },
        ready: function() {
            var deceleration = mui.os.ios ? 0.003 : 0.0009;
            mui('.mui-scroll-wrapper').scroll({
                bounce: false,
                indicators: true, //是否显示滚动条
                deceleration: deceleration
            });

            var list = document.getElementById('list');
            var listBar = document.getElementById('listBar');
            //calc hieght
            list.style.height = (document.body.offsetHeight - 212) + 'px';
            mui('#list').indexedList();
            listBar.style.height = (document.body.offsetHeight - 264) + 'px';
        }
    };
</script>
<style>
.mui-table-view-divider:before,.mui-table-view-divider:after,.mui-table-view:after,.mui-table-view-cell:after{
    height: 0;
}
</style>
<style scoped>
.mui-indexed-list {
    position: relative;
    border-top: solid 1px #e3e3e3;
    border-bottom: solid 1px #e3e3e3;
    overflow: hidden;
    background-color: #fafafa;
    height: 300px;
    cursor: default;
}
.selector-list-search-input {
    height: 32px !important;
}
.mui-indexed-list-inner {
    margin: 0px;
    padding: 0px;
    overflow-y: auto;
    border: none;
}
.mui-indexed-list-inner::-webkit-scrollbar {
    width: 0px;
    height: 0px;
    visibility: hidden;
}
.mui-indexed-list-empty-alert,
.mui-indexed-list-inner.empty ul {
    display: none;
}
.mui-indexed-list-inner.empty .mui-indexed-list-empty-alert {
    display: block;
}
.mui-indexed-list-empty-alert {
    padding: 30px 15px;
    text-align: center;
    color: #ccc;
    padding-right: 45px;
}
.mui-ios .mui-indexed-list-inner {
    width: calc(100% + 10px);
}
.mui-ios .mui-indexed-list-empty-alert {
    padding-right: 55px;
}
.mui-indexed-list-group {
    background-color: #f3f5f7;
	padding: 4px 12px;
	margin: 0;
	line-height: 1;
	text-align: left;
	color: #666666;
	font-size: 15px;
}
.mui-indexed-list-search {
    border-bottom: solid 1px #e3e3e3;
    z-index: 15;
}
.mui-indexed-list-search.mui-search:before {
    margin-top: -10px;
}
.mui-indexed-list-search input {
    border-radius: 0px;
    margin: 0px;
    background-color: #fafafa;
}
.mui-indexed-list-bar {
    width: 23px;
    background-color: #ebebeb;
    position: absolute;
    right: 4px;
    bottom: 0;
    top: 26px;
    height: 100%;
    z-index: 10;
    -webkit-transition: .2s;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
}
.mui-indexed-list-bar a {
    display: block;
    text-align: center;
    font-size: 11px;
    padding: 0px;
    margin: 0px;
    line-height: 15px;
    color: #aaa;
}
.mui-indexed-list-bar.active {
    background-color: rgb(200,200,200);
}
.mui-indexed-list-bar.active a {
    color: #333;
}
.mui-indexed-list-bar.active a.active {
    color: #007aff;
}
.mui-indexed-list-alert {
    position: absolute;
    z-index: 20;
    background-color: rgba(0, 0, 0, 0.5);
    width: 80px;
    height: 80px;
    left: 50%;
    top: 50%;
    margin-left: -40px;
    margin-top: -40px;
    border-radius: 40px;
    text-align: center;
    line-height: 80px;
    font-size: 35px;
    color: #fff;
    display: none;
    -webkit-transition: .2s;
}
.mui-indexed-list-alert.active {
    display: block;
}
.mui-bar {
    -webkit-box-shadow: none;
    box-shadow: none;
}
.mui-indexed-list-item{
    padding: 0;
}
.mui-indexed-list-item > div{
    float: left;
    position: relative;
    text-align: left;
}
.mui-indexed-list-item > div:nth-child(1){
    width: 60px;
    height: 77px;
    margin-left: 12px;
	text-align:left;
	display: table-cell;
}
.mui-indexed-list-item > div:nth-child(1) img{
    vertical-align: middle;
	width: 60px;
	height: 60px;
	position: absolute;
	top: 50%;
	margin-top: -30px;
	left: 0;
}
.mui-indexed-list-item > div:nth-child(2){
    position: absolute;
    left: 91px;
    right: 0;
    min-height: 77px;
}
.mui-indexed-list-item h4,.mui-indexed-list-item span{
	text-align: left;
	display: block;
	line-height: 1;
}
.mui-indexed-list-item h4{
	font-size: 14px;
	color: #666666;
	margin-top: 22px;
	font-weight: normal;
}
.mui-indexed-list-item span{
	color: #999999;
	font-size: 12px;
	margin-top: 8px;
}
.mui-indexed-list-item > div:nth-child(2):after{
	position: absolute;
	right: 0;
	bottom: 0;
	left: 0;
	height: 1px;
	content: '';
	-webkit-transform: scaleY(.5);
	transform: scaleY(.5);
	background-color: #d7d7d7;
}
</style>
