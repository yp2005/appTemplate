/** 
 * @file 二维码扫描页面主组件 
 * @Author yupeng 
 * @public 
 */

<template>
    <div id="bcid">
        <div class="barcode-content"></div>
        <p class="tip">...载入中...</p>
    </div>
    <footer>
        <div class="fbt" style="background-color: {{color}};" @tap="back">取　 消</div>
        <div class="fbt" style="background-color: {{color}};" @tap="scanPicture">从相册选择</div>
        <div class="fbt more" style="background-color: {{color}};" @tap="flashSwitch()">
            <a href="javascript:void(0)" class="flash">
                <img v-show="flash"  src="../../../../static/img/flash-on.svg">
                <img v-else src="../../../../static/img/flash-off.svg">
            </a>
        </div>
    </footer>
</template>

<script>
    import muiUtils from 'common/muiUtils';

    export default {
        data() {
            return {
                color: plus.webview.currentWebview().fromSeller ? '#419fdc' : '#f04e30',
                scan: undefined,
                flash: false
            };
        },
        methods: {
            initScan() {
                this.scan && this.scan.close();
                this.scan = new plus.barcode.Barcode('bcid', [plus.barcode.QR, plus.barcode.EAN8, plus.barcode.EAN13, plus.barcode.AZTEC, plus.barcode.DATAMATRIX, plus.barcode.UPCA, plus.barcode.UPCE, plus.barcode.CODABAR, plus.barcode.CODE39, plus.barcode.CODE93, plus.barcode.CODE128, plus.barcode.ITF, plus.barcode.MAXICODE, plus.barcode.PDF417, plus.barcode.RSS14, plus.barcode.RSSEXPANDED], {
                    frameColor: this.color,
                    scanbarColor: this.color
                });
                this.scan.onmarked = this.onmarked;
                this.scan.start();
            },
            reset() {
                this.scan.cancel();
                this.scan.start();
            },
            onmarked(type, result, file) {
                //console.log('code type is: ' + type);
                result = result.replace(/\n/g, '');
                var that = this;
                var reg = /^https?:\/\/(\S+)\.jinxiudadi\.com\/(\S+?)(\d+)/i;
                //console.log(result);
                if(reg.exec(result) != null) {
                    //console.log(RegExp.$1 + ' ' + RegExp.$2 + ' ' + RegExp.$3);
                    if(RegExp.$1 === 'detail' && RegExp.$2 === 'detail/') {
                        that.setFullscreen();
                        muiUtils.openWindow('../../buyer/supplier/product.html', 'buyer_supplier_product.html', {
                            extras: {
                                'goods_common_id': RegExp.$3,
                                'fromSeller': plus.webview.currentWebview().fromSeller
                            },
                            createNew: true,
                            isClose: true
                        });
                    }
                    else if(RegExp.$1 === 'store' && RegExp.$2 === 'store/home/') {
                        that.setFullscreen();
                        muiUtils.openWindow('../../buyer/store/index.html', 'buyer_store_index.html', {
                            extras: {
                                'store_id': RegExp.$3,
                                'fromSeller': plus.webview.currentWebview().fromSeller
                            },
                            createNew: true,
                            isClose: true
                        });
                    }
                    
                }
                else if (result.indexOf('jinxiudadi\.com') !== -1) {
                    that.setFullscreen();
                    muiUtils.openWindow(result, result, {
                        extras: {
                            'fromSeller': plus.webview.currentWebview().fromSeller
                        },
                        isClose: true
                    });
                }
                else if(result.indexOf('http:') === 0 || result.indexOf('https:') === 0) {
                    mui.confirm(result + '\n这是一个外站链接，是否打开？', '扫码提示', ['否', '是'], function(e) {
                        if(e.index === 1) {
                            plus.runtime.openURL(result);
                        }
                        setTimeout(that.reset, 100);
                    });
                }
                else {
                    plus.nativeUI.alert(result + '\n暂未处理此类条码.');
                    setTimeout(that.reset, 200);
                }
            },
            scanPicture() {
                var that = this;
                plus.gallery.pick(function(path) {
                    plus.barcode.scan(path, that.onmarked, function(error) {
                        plus.nativeUI.alert("无法识别此图片");
                        setTimeout(that.reset, 200);
                    });
                }, that.reset);
            },
            back() {
                this.setFullscreen();
                var ani = mui.os.ios ? 'slide-out-bottom' : 'pop-out';
                setTimeout(() => {
                    plus.webview.currentWebview().close(ani);
                }, 10);
            },
            flashSwitch() {
                this.flash = !this.flash;
                this.scan.setFlash(this.flash);
            },
            setFullscreen() {
                if (mui.os.ios) {
                    plus.navigator.setFullscreen(false);
                }
            }
        },
        ready: function() {
            this.initScan();
            if (mui.os.ios) {
                plus.navigator.setStatusBarBackground(this.color);
                plus.navigator.setStatusBarStyle('UIStatusBarStyleBlackOpaque');
            }
        }
    };
</script>
<style>
    body {
        background-color: #000000;
    }
    
    .barcode-content {
        height: 80%;
    }
    
    #bcid {
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 49px;
        text-align: center;
    }
    
    .tip {
        color: #FFFFFF;
        font-weight: bold;
        text-shadow: 0px -1px #103E5C;
    }
    
    footer {
        width: 100%;
        height: 49px;
        position: fixed;
        bottom: 0px;
        line-height: 49px;
        text-align: center;
        color: #FFF;
    }
    
    .fbt {
        width: 45%;
        height: 100%;
        float: left;
    }
    
    .fbt.more {
        width: 10%;
    }
    
    .fbt:active {
        -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.5);
        box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.5);
    }
    
    .flash {
        position: relative;
        height: 49px;
        width: 100%;
    }
    
    .flash img {
        width: 21px;
        position: absolute;
        top: 13px;
        left: 50%;
        margin-left: -10px;
    }
</style>