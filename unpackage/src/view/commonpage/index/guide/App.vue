<template lang="html">

<div class="mui-content">
    <div class="mui-slider mui-fullscreen">
        <div class="mui-slider-group">
            <div class="mui-slider-item">
                <a href="javascript:;">
                    <img class="guide-img" src="./static/img/guide-1.jpg">
                </a>
            </div>
            <div class="mui-slider-item">
                <a href="javascript:;">
                    <img class="guide-img" src="./static/img/guide-2.jpg">
                </a>
            </div>
            <div class="mui-slider-item">
                <a href="javascript:;">
                    <img @tap="start" class="guide-img" src="./static/img/guide-3.jpg">
                    <!-- <button class="mui-btn mui-btn-blue mui-btn-outlined" type="button" id="start">开始体验</button> -->
                </a>
            </div>
        </div>
    </div>
</div>

</template>

<script>

export default {
    methods: {
        start: function() {
            plus.storage.setItem('launchFlag', 'true');
            mui.openWindow({
                url: '../../buyer/index/main.html',
                id: 'main',
                show: {
                    aniShow: 'none'
                },
                waiting: {
                    autoShow: false // 自动显示等待框，默认为true
                }
            });
            plus.navigator.setFullscreen(false);
            setTimeout(function() {
                plus.webview.currentWebview().close('none');
                if (plus.webview.getWebviewById('HBuilder')) {
                    plus.webview.getWebviewById('HBuilder').close('none');
                }
            }, 300);
        }
    },
    ready: function() {
        plus.navigator.setFullscreen(true);
        mui('.mui-slider').slider();
        // var sh = plus.navigator.getStatusbarHeight();
        var h = plus.screen.resolutionHeight + 2; // +2解决android显示白边的问题
        var w = plus.screen.resolutionWidth + 2;
        /**
         * 设置图片高度，这里图片并不规范；
         * 实际开发中，建议大家制作iphone6plus规格的图片；
         */
        var imgs = document.querySelectorAll('.guide-img');
        for (var i = 0, len = imgs.length; i < len; i++) {
            // imgs[i].style.height = (h - sh) + 'px';
            imgs[i].style.width = w + 'px';
            imgs[i].style.height = h + 'px';
        }
        setTimeout(function() {
            plus.navigator.closeSplashscreen();
        }, 100);
    }
};

</script>

<style lang="css">

body {
    background-color: rgb(255, 255, 255);
}

.guide-img {
    width: 100%;
    /*height: 100%;*/
}

</style>
