/**
 * @file 列表展示组件（不包含上拉和下拉刷新）
 * @Author zhongzhian
 * 组件说明：ListCtrl组件的子组件，也可单独使用；目前作为商品列表展示组件使用
 * 组件使用：
 *  引入：import vheader from 'component/list/List';
 *  标签示例：<list :listitem="listitem" @comlist_itemtap="itemtap" :keymap="keymap" 
 *				:showdelete="showdelete"
 *				 :showall="showall" @before_alldelete="before" @after_alldelete="after"></list>
 *  参数：
 *  @param {Array} listitem 数据样例如下
 * 		[
 * 			{
 *          	"s_id": 0,	//列表项id
 *              "last_date": "2016-03-24",	//时间
 *              "picurl": "",	//图片url
 *              "title": "标题是什么鬼",	//商品名称
 *              "price": 1111,	//商品价格
 *              "viewed": 3820,		//浏览次数
 *              "remark": "说明"	//说明
 *       	},...
 *       ]
 *  @param {Function} comlist_itemtap 列表选中事件，
 *		参数值为列表项选中的回调函数，itemtap(item),item为列表项的数据，参考上一参数，
 *		跟ListCtrl组件一起使用时，该参数可从ListCtrl中传入，List组件本身可不传。
 *  @param {Object} keymap 列表数据结构的映射，
 *		参数为【列表数据的字段名称】与【实际数据的字段名称】的映射，不传就使用列表默认的
 		defaultkeys = {
			's_id':'s_id', 				//列表项id
			'last_date':'last_date',	//到期时间
			'picurl':'picurl',			//图片url
			'title':'title',			//列表项名称
			'price':'price',			//价格
			'viewed':'viewed',			//浏览次数
			'remark':'remark',			//描述
			'type':'type'				//分类
		}
 *  @param {Boolean} showdelete 列表项是否可删除，
 *		跟ListCtrl组件一起使用时，该参数可从ListCtrl中传入。
 *  @param {Boolean} showall 批量操作列表项，在前面出现checkbox，
 *		注::::使用此参数，请务必在数据项中添加isselect属性（数据类型为bool），作为该数据项的选中标识
 *		跟ListCtrl组件一起使用时，该参数可从ListCtrl中传入。
 *  @param {Function} before_alldelete 批量删除列表项前调用，
 *		before(),由于数据列表是父级组件传入的,因此暂时不需要参数，需要再加
 *		跟ListCtrl组件一起使用时，该事件可从ListCtrl中传入。
 *  @param {Function} after_alldelete 批量删除列表项后调用，
 *		after(),由于数据列表是父级组件传入的,因此暂时不需要参数，需要再加
 *		跟ListCtrl组件一起使用时，该事件可从ListCtrl中传入。
 * @public
 */

<template>
	<!--下拉刷新容器 -->
	<ul class="mui-table-view mui-table-view-chevron">
		<li @tap="itemtap(item)" v-for="(index, item) in listitem" class="mui-table-view-cell mui-media comlist_li_padding" >
			<div v-if="showdelete" class="mui-slider-right mui-disabled">
				<a @tap="itemDelete(index)" class="mui-btn mui-btn-red">删除</a>
			</div>
			<div v-if="item.disabled === false" class="mypurchase-tip">我的发布</div>
			<div class="mui-slider-handle">
				<div class="comlist_alldelete_left {{showall ? 'comlist_alldelete' : ''}}">
					<div class="mui-checkbox">
						<input name="checkbox" style="line-height:100px;" v-model="item['isselect']" type="checkbox" >
					</div>
				</div>
				<div class="comlistAllDelete {{showall ? 'comlist_alldelete' : ''}}">
					<!-- lazyload -->
					<img class="mui-media-object mui-pull-left comlist_img_main" :src="item[keymap['picurl']][0] | imageSizeFilter '100'">
					<div class="mui-media-body comlist_div_main">
						<p class="mui-ellipsis-2 comlist_font_main">{{*item[keymap['title']]}}</p>
						<div class="teamContent">
							<p v-if="item[keymap['type']]" class="mui-ellipsis comlist_font_sub">所属类目:&nbsp{{*item[keymap['type']]}}</p>
							<p v-if="item[keymap['price']]" class="mui-ellipsis comlist_p_price">
								<span class="price">
									<i>￥</i>{{*item[keymap['price']] | mycurrency 0}}<i class="dot">.{{*item[keymap['price']] | mycurrency 1}}</i>
								</span>
							</p>
							<p class="mui-ellipsis comlist_font_sub">
								<span v-if="item[keymap['last_date']]" class="comlist_span_lastdate">有效期限:&nbsp{{*item[keymap['last_date']] | dateFilter 2}}</span>
							</p>
	                        <p class="mui-ellipsis comlist_font_sub">
	                            <span v-if="item[keymap['viewed']] != undefined" class="comlist_span_viewed">浏览量:&nbsp{{*item[keymap['viewed']]}}</span>
	                        </p>
                        </div>
						<p v-if="item[keymap['remark']]" class="mui-ellipsis-2 comlist_font_sub">{{*item[keymap['remark']]}}</p>
					</div>
				</div>
			</div>
			<div v-if="item[keymap['store_num']] != undefined" class="comlist_div_second">
				<p v-if="item[keymap['store_num']] == 0">
					暂无反馈
				</p>
				<p v-else>
					<span>有<label style="color:#f04e30;">{{*item[keymap['store_num']]}}</label>条新反馈</span>
				</p>
				
			</div>
		</li>
	</ul>
</template>

<script>
//  import CONSTS from 'common/consts';
	import {dateFilter} from 'filter/dateFilter';
	import {
		mycurrency,
		myvolumes
	} from 'filter/goodsFilter';
    import {
        imageSizeFilter
    } from 'filter/commonFilter';
	export default {
//	    data: function(){
//	        return {
//	            errorpic: CONSTS.ERROR_PIC
//	        }
//	    },
		props: {
			showall:{
				type: Boolean,
				default:false
			},
			showdelete:{
				type: Boolean,
				default:false
			},
			listitem: Array,
			keymap: Object
		},
		filters:{
		    imageSizeFilter:imageSizeFilter,
			dateFilter:dateFilter,
			mycurrency: mycurrency,
			myvolumes: myvolumes
		},
		events:{
			alldelete: function(){
				this.$dispatch('before_alldelete');
				this.deleteAll();
				this.$dispatch('after_alldelete');
			}
		},
		methods: {
			itemDelete: function(index){
				var that = this;
				this.$dispatch('comlist_itemdelete',index);
			},
			itemtap: function(item) {
				if(!item.disabled){
					this.$dispatch('comlist_itemtap', item);
				}else{
                    mui.alert('您好，该条求购信息非您本人发布，您没有操作权限。如您有供应商账号，可在卖家版求购大厅查看求购详情。', '没有权限', function() {
//                      mui.back();
                    });
				}
			},
			deleteAll: function() {
				for(var i = (this.listitem.length - 1);i >= 0;i--){
					if(this.listitem[i].isselect){
						this.listitem.splice(i,1);
					}
				}
			}
		},
		ready: function(){
			var defaultkeys = {
				's_id':'s_id',
				'last_date':'last_date',
				'picurl':'picurl',
				'title':'title',
				'price':'price',
				'viewed':'viewed',
				'remark':'remark',
				'type':'type',
				'store_num':'store_num'
			}
			for(var k in defaultkeys){
				if(!this.keymap[k]){
					this.keymap[k] = defaultkeys[k];
				}
			}
		}
	}
</script>

<style scoped>
	.comlist_alldelete_left{
		position:absolute;
		top:0;
		display:flex;
	}
	.comlist_alldelete{
		transform: translate(58px, 0px);
	}
	.comlist_font_main {
		color: #222222;
		font-size: 14px;
		line-height: 16px;
	}
	
	.mui-content>.mui-table-view:first-child {
		margin-top: 0;
	}
	
	.comlist_font_sub {
		font-size: 13px;
		color: #666666;
        line-height: 18px;
	}
	
	.comlist_p_price {
		color: #666666;
	}
	
	.comlist_img_main {
		height: 88px;
		width: 88px;
		max-width: 88px;
		line-height: 88px;
		/*background-image: url(../../static/img/logo.png);
		background-repeat: no-repeat;
		background-size: cover;*/
	}
	
	.comlist_span_lastdate {
		float: left;
		display: inline;
	}
	
	.comlist_span_viewed {
		float: left;
		display: inline;
	}
	
	.comlist_li_padding {
		padding-right: 15px !important;
	}
	
	.comlist_a_margin {
		margin-right: -15px !important;
	}
	.mui-table-view-cell:after {
		background-color: #dbdbdb;
		left: 0;
	}
	.comlist_div_second{
		clear:both;
	}
	
	.comlist_div_second p{
		margin-left:100px;
	}
	
	.price {
		/*font-size: 12;*/
		color: rgb(238, 13, 13);
		float: left;
	}
	
	.dot {
		font-size: 12px;
	}
	
	.mypurchase-tip{
		position:absolute;
		top: 16px;
		left: 0px;
		height: 22px;
		width: 74px;
		line-height: 23px;
		border-bottom-right-radius: 15px;
		border-top-right-radius: 15px;
		background-color: #ff9173;
		font-size: 13px;
		color: #fff;
		z-index: 10;
		padding-left: 6px;
	}
	.item-disabled{
		background-color: #666;
	}
	.teamContent {
		position: absolute;
		top: 37px;
	}
	.comlistAllDelete {
		position: relative;
	}
	.mui-table-view-cell {
		padding: 16px 12px;
	}
</style>