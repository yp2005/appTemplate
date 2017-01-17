/**
 * @file 历史查询列表（包含删除功能）
 * @Author zhongzhian
 * 组件使用：
 *  引入：import simpleList from 'component/list/SimpleList';
 *  标签示例：<simple-list :listitem.sync="historySearchDatas" @itemtap="dosomething"></simple-list>
 *  参数：
 *  @param {Array} listitem 列表数据
 *  @param {Function} itemtap 列表选中事件，
 *		参数值为列表项选中的回调函数，dosomething(item),item为列表项的数据，参考上一参数
 * @public
 */
<template>
	<!--下拉刷新容器 -->
	<ul id="OA_task_1" class="mui-table-view searchLists">
		<li v-for="(index, item) in listitem" class="mui-table-view-cell">
			<div class="mui-slider-right mui-disabled">
				<a @tap="itemDelete(index)" class="mui-btn">
					<img src="../../static/img/searchpagedel.png"/>
				</a>
			</div>
			<div @tap="itemTap(item)" class="mui-slider-handle">
				{{*item}}
			</div>
		</li>
	</ul>
</template>

<script>
	export default {
		props:{
			listitem:Array
		},
		methods: {
			itemDelete: function(index){
				this.listitem.splice(index,1);
			},
			itemTap: function(item) {
				this.$dispatch('itemtap', item);
			},
		},
		ready: function() {
		}
	}
</script>

<style scoped>
	.searchLists.mui-table-view:after{
		height: 0;
	}
	.searchLists .mui-table-view-cell{
		padding: 0;
		height: 46px;
	}
	.searchLists .mui-table-view-cell>.mui-slider-handle{
		color: #5a5a5a;
		font-size: 14px;
		text-align: left;
		position: absolute;
	  	text-indent: 16px;
	  	height: 46px;
	  	line-height: 46px;
	  	display: -webkit-box;
    	overflow: hidden;
	    white-space: normal !important;
	    text-overflow: ellipsis;
	    word-wrap: break-word;
	    -webkit-line-clamp: 1;
	    -webkit-box-orient: vertical;
		right: 44px;
		left: 0;
		background-color: #ffffff;
	}
	.searchLists .mui-table-view-cell:after{
		right: 12px;
		left: 12px;
	}
	.searchLists .mui-table-view-cell>.mui-slider-right{
		height: 44px;
		z-index: 1000000;
		top: 0;
		right: 44px;
		position: absolute;
	}
	.searchLists .mui-table-view-cell>.mui-slider-right>.mui-btn{
		padding: 0 11px 0 20px;
		width: auto;
		font-size: 24px;
		color: #cccccc;
		line-height: 44px;
		height: 44px;
		top: -1.5px;
	}
	.mui-btn img{
		width: 12px;
		max-width: 100%;
	}
</style>