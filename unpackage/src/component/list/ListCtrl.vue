<template>

<!--下拉刷新容器-->
<div id="{{'comlist_pullrefresh'+customid}}" class="comlist_pullrefresh mui-scroll-wrapper">
    <div id="{{'pullrefresh'+customid}}" class="mui-scroll">
		<noresult :msg="noresultmsg" :isloading="resultloading" :isshow="noresultshow"></noresult>
        <list :isactivity="isactivity" :listitem.sync="listitem" :keymap="keymap" :showdelete="showdelete" :showall="showall"></list>
    </div>
</div>

</template>

<script>

/**
 * @file 列表组件（包含上拉和下拉刷新）
 * @Author zhongzhian
 * 组件说明：目前作为商品列表使用，内部引用了List组件
 * 组件使用：
 *  引入：import vheader from 'component/list/ListCtrl';
 *  标签示例：<listctrl :childlist="childlist" @getlistdata="getdata" @comlist_itemtap="itemtap" :keymap="keymap"></listctrl>
 *  参数：
 *  @param {Object} childlist 列表展示组件的配置，默认为List组件，
 *      在使用ListCtrl的页面中也import自己的列表展示组件，并且在data中作绑定；
 *      具体可参考view/buyer/supplier/productlist/app.vue中的使用
 *       必传!!!!!
 *  @param {Function} getlistdata 列表数据获取事件，
 *      参数值为列表获取数据的回调函数，getdata(pager, callback),
 *      pager为列表分页对象，
            "totalRow": 99999999,   //总条数
            "pageNumber": 1,    //当前页
            "lastPage": false,  //是否最后页（暂时无用）
            "totalPage": 999999,    //总页数
            "pageSize": 10, //每页条数，默认10
 *      callback为组件内部回调函数，用于返回数据给组件。callback(data.detail);
 *       必传!!!!!
 *  @param {Function} comlist_itemtap 列表选中事件，
 *      参数值为列表项选中的回调函数，itemtap(item),item为列表项的数据，
 *      该事件是List组件定义的，也可从ListCtrl中透传，List组件本身可不传。
 *      可选：如果使用List组件而且需要点击事件的话，该参数必传
 *  @param {Object} keymap 列表数据结构的映射，
 *      参数为【列表数据的字段名称】与【实际数据的字段名称】的映射，不传就使用列表默认的
 *      该属性是List组件使用的，这里是通过ListCtrl做透传。
        defaultkeys = {
            's_id':'s_id',              //列表项id
            'last_date':'last_date',    //到期时间
            'picurl':'picurl',          //图片url
            'title':'title',            //列表项名称
            'price':'price',            //价格
            'viewed':'viewed',          //浏览次数
            'remark':'remark',          //描述
            'type':'type'               //分类
        }
 *      可选：如果使用List组件的话，该参数必传
 *  @param {Boolean} showall 批量操作列表项，在前面出现checkbox，
 *      该属性是List组件使用的，这里是通过ListCtrl做透传。
 *      可选：如果使用List组件而且需要批量操作，该参数必传
 *  @param {Boolean} showdelete 列表项是否可删除，
 *      该属性是List组件使用的，这里是通过ListCtrl做透传。
 *      可选：如果使用List组件而且需要列表项的左推删除的话，该参数必传
 *  @param {String} noresultmsg 无查询结果页描述文字，
 *      默认为“没有搜索到结果”
 *  事件 reflashlist 手动刷新列表数据，
 *      调用方法：this.$broadcast('reflashlist');
 *      该事件会触发列表调用getlistdata方法，刷新数据。
 *      可选：如果需要手动刷新数据的话，该参数必传
 * @public
 */
import utils from 'common/utils';
import noresult from 'src/component/NoResult';
import Vue from 'vue';
import pullToRefresh from 'static/js/mui.pullToRefresh.js';
import pullToRefreshMaterial from 'static/js/mui.pullToRefresh.material.js';
import 'static/css/pull_to_refresh.css';
//	import zoom from 'static/js/mui.lazyload.js';
//	import previewimage from 'static/js/mui.lazyload.img.js';
var reloadCom = function(vueobj) {
    Vue.component('list', vueobj);
};
export default {
//	watch: {
//		listitem:{
//			handler: function (val, oldVal) {
//				setTimeout(function(){
//					mui(document).imageLazyload({
//						placeholder: '../../static/img/placehold.png'
//					});
//				},0);
//			},
//    		deep: true
//		}
//	},
    props: {
        //如果是活动详情页，商品列表项点击时参数为goods_id，对此做处理了
        isactivity: {
            type:Boolean,
            default:false
        },
        //如果单个页面中用到了多个该组件，可以传入一个自定义id作为标识，不然会出问题
        customid:{
            type:String,
            default:''
        },
        //目前默认会做一次加载，可以传入false不默认加载
    	auto:{
    		type:Boolean,
    		default:true
    	},
    	toptipheight:{
    		type:Number,
    		default:70
    	},
        keymap: Object,
        showdelete: Boolean,
        showall: Boolean,
        childlist: Object,
        listitem: {
            type: Array,
            default: []
        },
        noresultmsg: {
            type: String,
            default: '没有搜索到结果'
        }
    },
    data: function() {
        return {
            pager: {
                row_start_number: -1,
                row_count: 20,
                total_row_number: 0
            },
            resultloading:false,
            noresultshow: false,
            default_row_count: 10,
            default_first_count: 20,
            pullrefresh: null
        };
    },
    events: {
        reflashlist: function() {
            this.listitem = [];
            this.pager.row_start_number = 0;
            this.pager.row_count = this.default_first_count;
			this.pullrefresh.pullDownLoading();
        }
    },
    methods: {
    	testtest: function(){
			console.log('testtest::::::::::::::::::::::::::::');
			mui(document).imageLazyload({
				placeholder: '../../../dist/static/img/placehold.png'
			});
    	},
        getdata: function(pager,isfrash) {
            var that = this;
            this.$dispatch('getlistdata', pager, function(detail) {
                if (detail) {
                	isfrash ? that.frashdata(detail) : that.loadmore(detail);
                } else {
                	isfrash ? that.pullrefresh.endPullDownToRefresh() : that.pullrefresh.endPullUpToRefresh();
                	that.resultloading = false;
                }
            });
        },
        frashdata: function(detail){
            this.pager.row_start_number = detail.row_start_number;
            this.pager.row_count = detail.row_count;
            this.pager.total_row_number = detail.total_row_number;
        	if (!detail.items || (detail.items.length === 0)) {
                this.noresultshow = true;
                this.pullrefresh.endPullDownToRefresh();
                this.resultloading = false;
            } else {
                this.noresultshow = false;
                this.listitem = detail.items;
                this.pullrefresh.endPullDownToRefresh();
                this.resultloading = false;
                this.pullrefresh.refresh(true);
//              if (this.pager.row_count >= this.pager.total_row_number){
//                  this.pullrefresh.endPullUpToRefresh(true);
//              }
            }
        },
        loadmore:function(detail){
            this.pager.row_start_number = detail.row_start_number;
            this.pager.row_count = detail.row_count;
            this.pager.total_row_number = detail.total_row_number;
        	if (!detail.items || (detail.items.length === 0)) {
                this.pullrefresh.endPullUpToRefresh(true);
            } else {
                this.listitem = this.listitem.concat(detail.items);
//              if ((this.pager.row_start_number + this.pager.row_count) < this.pager.total_row_number) {
                if (this.pager.row_start_number < this.pager.total_row_number) {
                    this.pullrefresh.endPullUpToRefresh();
                } else {
                    this.pullrefresh.endPullUpToRefresh(true);
                }
            }
        },
        pullupRefresh: function() {
            // 首次调用获取20条，之后每次10条
//          if (this.pager.row_start_number < 0) {
//              this.pager.row_start_number = 0;
//              this.pager.row_count = this.default_first_count;
//              this.getdata(this.pager);
//          } else if ((this.pager.row_start_number + this.pager.row_count) < this.pager.total_row_number) {
//              this.pager.row_start_number = this.pager.row_start_number + this.pager.row_count;
//              this.pager.row_count = this.default_row_count;
//              this.getdata(this.pager);
//          } else {
//              // 参数为true代表没有更多数据了。
//              this.pullrefresh.endPullUpToRefresh(true);
//          }
            
            if (this.pager.row_start_number < this.pager.total_row_number) {
                this.pager.row_count = this.default_row_count;
                this.getdata(this.pager);
            } else {
                // 参数为true代表没有更多数据了。
                this.pullrefresh.endPullUpToRefresh(true);
            }
        },
        pulldownRefresh: function() {
            this.pager.row_start_number = 0;
            this.pager.row_count = this.default_first_count;
            this.resultloading = true;
            this.getdata(this.pager,true);
        }
    },
    components: {
        noresult
    },
    created: function() {
        reloadCom(this.childlist);
    },
    ready: function() {
        var deceleration = mui.os.ios ? 0.003 : 0.0009;
        mui('#comlist_pullrefresh'+this.customid).scroll({
            bounce: true,
            indicators: true, //是否显示滚动条
            deceleration: deceleration
        });
        var that = this;
        this.pullrefresh = mui('#pullrefresh'+this.customid).pullToRefresh({
            down: {
            	height:this.toptipheight,
                offset: 50,
                auto: that.auto,
                callback: function() {
                    that.pulldownRefresh();
                }
            },
            up: {
                offset: 50,
                callback: function() {
                    that.pullupRefresh();
                }
            }
        });
    }
};
</script>

<style>
</style>