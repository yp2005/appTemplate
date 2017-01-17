/**
 * @file 列表展示组件（不包含上拉和下拉刷新）
 * @Author zhongzhian
 * 组件说明：ListCtrl组件的子组件，也可单独使用；目前作为商品列表展示组件使用
 * 组件使用：
 *  引入：import vheader from 'component/list/List';
 *  标签示例：<list :listitem="listitem" @comlist_itemtap="itemtap"></list>
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
 * @public
 */

<template>
	<div v-show="isshow" class="comlist_div_noresult">
		<!--<div class="comlist_content_noresult">
			<p>{{msg}}</p>
		</div>-->
		
        <div class="comlist_noresult_main">
            <span class="comlist_noresult_img mui-icon jxddiconfont icon-{{noicon}}">
        </div>
        <div class="comlist_noresult_msg">{{msg}}</div>
	</div>
	<!--<div v-show="isshow" class="purchase-nopurchase" style="background-color: #fff;">
        <div class="comlist_noresult_main">
            <span class="comlist_noresult_img mui-icon jxddiconfont icon-{{noicon}}">
        </div>
        <div class="comlist_noresult_msg">{{msg}}</div>
    </div>-->
</template>

<script>
	export default {
		props: {
			noicon: {
				type: String,
				default: 'sousuowujieguo'
			},
			isloading: {
				type: Boolean,
				default: false
			},
			isshow: {
				type: Boolean,
				default: false
			},
			msg: {
				type: String,
				default: '没有搜索到结果'
			}
		}
	}
</script>

<style scoped>
.comlist_div_noresult{
	z-index:10;
	position: absolute;
	top:0;
	bottom:0;
	left:0;
	right:0;
	background: #fff;
}

.comlist_content_noresult{
	display:table;
	width: 100%;
	height:300px;
}

.comlist_div_noresult p{
	display:table-cell;
	vertical-align: middle;
	text-align: center;
}

    .comlist_noresult_main {
        display: table;
        text-align: center;
        width: 100%;
    }
    
    .comlist_noresult_img {
       font-size:32px !important;
       color:#999;
       margin: 100px 10px 10px 10px;
       line-height: 32px !important;
       height: 32px !important;
       width: 32px !important;
    }
    
    .comlist_noresult_msg {
        text-align: center;
        width: 100%;
        font-size: 14px;
        color: #666;
    }
</style>