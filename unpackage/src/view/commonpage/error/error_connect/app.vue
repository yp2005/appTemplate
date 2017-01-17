<template>
    <img src="../../../../static/img/404.png"/>
    <p id="info">出错啦~.~</p>
    <!--<div class="button" onclick="history.back()">Retry</div>-->
    <!--<div class="button" @tap="back()">返回</div>-->
    <!--<div class="button" @tap="reflash()">刷新</div>-->
    <div class="button" @tap="back()">返回</div>
    <div class="button" @tap="restart()">重启应用</div>
</template>

<script>
    import muiUtils from 'common/muiUtils';
    import logger from 'common/logUtils';
    export default {
        data: function() {
          url:''  
        },
        methods: {
            back: function() {
                var ws = plus.webview.currentWebview();
                if (history.length == 1) {
                    ws.close();
                } else {
                    ws.back();
                    ws.back();
                }
            },
            reflash: function() {
                var ws = plus.webview.currentWebview();
                ws.close();
            },
            restart: function() {
                plus.runtime.restart()
            }
        },
        ready:function(){
        }
    }
</script>
<style>
	body{
		height: auto;
		text-align: center;
	}
</style>
<style scoped>
    img{
    	display: block;
    	width: 93px;
    	margin: 20% auto 0 auto;
    }
    p{
    	font-size: 15px;
		line-height: 1;
		margin-top: 16px;
		color: #999999;
		text-align: center;
    }
    .button {
        width: 32%;
        font-size: 14px;
        font-weight: normal;
        text-decoration: none;
        text-align: center;
        height: 35px;
        line-height: 35px;
        color: #f04e30;
        background-color: #FFFFFF;
        border: 1px solid #f04e30;
        -webkit-border-radius: 4px;
        border-radius: 4px;
        margin: 20px auto 0 auto;
    }
    .button:nth-of-type(2){
    	margin-bottom: 0;
    }
    .button:active {
        background-color: #f04e30;
        color: #FFFFFF;
    }
</style>