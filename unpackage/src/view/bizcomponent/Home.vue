<template>
	<div class="home">
		首页
	</div>
</template>

<script>
	export default {
		data: function() {

		},
		filters: {

		},
		created: function() {

		},
		components: {

		},
		methods: {},
		ready: function() {
			if(plus.webview.getWebviewById('HBuilder')) {
				plus.webview.getWebviewById('HBuilder').close('none');
			}
			setTimeout(function() {
				var launchFlag = plus.storage.getItem('launchFlag');
				if(launchFlag) {
					plus.navigator.closeSplashscreen();
					// plus.webview.currentWebview().show('none');
				}
			}, 10);
		}
	};
</script>

<style scoped>
	.home {
		position: absolute;
		top: 45px;
		bottom: 50px;
		width: 100%;
	}
</style>