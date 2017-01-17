<template>
	<nav class="nav-bar nav-bar-tab {{centerPlus ? 'centerPlusNav' : ''}}">
		<a v-if="centerPlus" class="nav-tab-item centerPlus">
			<span>+</span>
		</a>
		<a v-for="href in hrefes" @tap="switch($index)" class="nav-tab-item {{$index === index ? 'nav-active' : ''}} {{$index === 2 && centerPlus ? 'centerPlusAfter' : ''}}">
			<span class="jxddicon {{href.icon + ($index === index ? 'xuanzhong' : '')}}"></span>
			<span class="mui-tab-label ">{{href.text}}</span>
		</a>
	</nav>
</template>

<script>
	import muiUtils from 'common/muiUtils';
	import CONSTS from 'common/consts';
	import cacheUtils from 'common/cacheUtils';
	import pageUrl from 'api';
	export default {
		props: {
			hrefes: { // 导航的按钮相关信息，包括uri、按钮文字、图标
				type: Array,
				default: [{
					href: '/home',
					text: '首页',
					icon: 'icon-home'
				}, {
					href: '/type',
					text: '分类',
					icon: 'icon-fenlei'
				}, {
					href: '/order',
					text: '采购单',
					icon: 'icon-cart'
				}, {
					href: '/mine',
					text: '我的',
					icon: 'icon-wode'
				}]
			},
			index: { // 导航当前切换的位置
				type: Number,
				default: 0
			},
			hdstyle: Object,
			showHeader: Boolean,
			typeclass: '',
			centerPlus: {
				type: Boolean,
				default: true
			},
			centerPlusAction: Function
		},
		ready: function() {
			var that = this;
			window.addEventListener('home_nav', function(event) {
				var index = event.detail.index;
				that.display({
					index: index,
					self: that
				});
			});
			window.addEventListener(CONSTS.LOGIN_OUT_EVENT, function() {
				that.display({
					index: 0,
					self: that
				});
			});
		},
		methods: {
			switch: function(index) {
				this.display({
					index: index,
					self: this
				});
			},
			display: function(option) { // 导航点击事件处理方法
				if(option.self.index === option.index) {
					return;
				}
				//          plus.navigator.setStatusBarBackground('#FFFFFF');
				//          plus.navigator.setStatusBarStyle('UIStatusBarStyleDefault');
				if(option.self.hrefes[option.index].text === '首页') {
					// 如果是供应商，跳转到卖家首页
					if(muiUtils.getLoginUserInfo() && muiUtils.getLoginUserInfo().user_type === 2) {
						option.self.hdstyle.homeSwitchButton.display = true;
						option.self.typeclass = 'buyHome';
					} else {
						option.self.hdstyle.homeSwitchButton.display = 'none';
						option.self.typeclass = 'buyHomeNoLogin';
					}
					option.self.hdstyle.title.display = 'none';
					option.self.hdstyle.searchBar.display = true;
					option.self.hdstyle.rightButton.display = 'none';
					option.self.hdstyle.rightBarcodeBtn.display = true;
					option.self.showHeader = true;
				}
				if(option.self.hrefes[option.index].text === '分类') {
					option.self.hdstyle.homeSwitchButton.display = 'none';
					option.self.hdstyle.title.display = 'none';
					option.self.hdstyle.searchBar.display = true;
					option.self.hdstyle.rightButton.display = 'none';
					option.self.hdstyle.rightBarcodeBtn.display = 'none';
					option.self.showHeader = true;
					option.self.typeclass = 'base';
				}
				if(option.self.hrefes[option.index].text === '采购单') {
					option.self.hdstyle.homeSwitchButton.display = 'none';
					option.self.hdstyle.title.display = true;
					option.self.hdstyle.searchBar.display = 'none';
					option.self.hdstyle.rightButton.display = true;
					option.self.hdstyle.rightBarcodeBtn.display = 'none';
					option.self.showHeader = true;
					option.self.typeclass = 'base';
				}
				if(option.self.hrefes[option.index].text === '我的') {
					option.self.showHeader = false;
				}
				option.self.index = option.index;
			}

		}
	};
</script>

<style scoped>
	.nav-bar {
		position: fixed;
		z-index: 10;
		right: 0;
		left: 0;
		background-color: #f7f7f7;
		-webkit-backface-visibility: hidden;
	}
	
	.nav-bar-tab,
	.nav-bar-tab .nav-tab-item {
		background: #ffffff;
	}
	
	.nav-bar-tab {
		height: 50px;
		line-height: 1;
		-webkit-box-shadow: 0 0 0 transparent;
		box-shadow: 0 0 0 transparent;
		/*border-top: 1px solid #d7d7d7;*/
		bottom: 0;
		display: table;
		width: 100%;
		padding: 0;
		table-layout: fixed;
		border-bottom: 0;
	}
	
	.nav-bar-tab:before {
		content: '';
		height: 1px;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		background: #d7d7d7;
		-webkit-transform: scaley(.5);
		transform: scaley(.5);
	}
	
	.nav-bar-tab .nav-tab-item .jxddicon~.mui-tab-label {
		display: inline-block;
		overflow: initial;
		font-size: 11px;
		margin-top: 8px;
		text-overflow: ellipsis;
		font-weight: bold;
	}
	
	.nav-bar-tab span {
		font-size: 11px;
		color: #999999;
		line-height: 1;
		margin: 0;
		width: 100%;
		float: left;
	}
	
	.nav-bar-tab .nav-tab-item {
		display: inline-block;
		width: 25%;
		vertical-align: middle;
		height: 100%;
		text-align: center;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	
	.centerPlusNav.nav-bar-tab .nav-tab-item {
		width: 20%;
	}
	
	.nav-bar-tab .nav-tab-item.centerPlusAfter {
		margin-left: 20%;
	}
	
	.nav-bar-tab .nav-tab-item.centerPlus {
		position: absolute;
		left: 50%;
		top: -10px;
		height: 50px;
		width: 50px;
		margin-left: -25px;
		border: 1px solid;
		border-radius: 25px;
	}
	
	.nav-bar-tab .nav-tab-item.centerPlus span {
		color: #fff;
		background-color: #007aff;
		width: 40px;
		height: 40px;
		border-radius: 20px;
		margin-top: 4px;
		margin-left: 4px;
		font-size: 30px;
		text-align: center;
		padding-top: 4px;
	}
	
	.nav-bar-tab .nav-tab-item .jxddicon {
		float: none;
		top: 7px;
		font-size: 26px;
		text-align: center;
		width: 26px;
		height: 26px;
		padding-top: 0;
		padding-bottom: 0;
		position: relative;
		z-index: 20;
	}
	
	.nav-active span {
		color: #f04e30;
	}
	
	.icon-fenlei:before {
		content: "\e61d";
	}
</style>