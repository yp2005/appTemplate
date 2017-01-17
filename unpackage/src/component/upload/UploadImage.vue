<template>

<template v-if="uploadtype == 'default'">
    <ul class="mui-table-view mui-grid-view">
        <template v-for="num in imagecount">
            <li class="mui-table-view-cell mui-col-xs-3 {{uploadIndex < num+1?'li-hide':''}}">
                <div id="uploadImageProgress{{num+1}}_{{dataid}}">
                    <p class="div-p"></p>
                </div>
                <img :src="this['uploadImagePath'+(num+1)]" tt="{{this['uploadImagePath'+(num+1)]}}" id="uploadImg{{num+1}}" @tap="showActionSheet(num+1)">
                <a v-if="uploadIndex > num+1" href="javascript:void(0);" @tap="delUpload(num+1)" class="mui-btn mui-btn-primary mui-btn-outlined"><span class="mui-icon mui-icon-trash"></span></a>
            </li>
        </template>
    </ul>
</template>
<template v-if="uploadtype == 'userhead'">
    <img class="head-img" :src="showimage" @tap="showActionSheet(1)">
</template>

<div id="upload_edit_div_{{dataid}}">
    <div class="spinner-div" id="spinner">
        <div class="spinner-div-div">
            <div class="spinner-div-div-1">
                <span class="mui-spinner spinner-div-div-span"></span>
            </div>
            <div class="spinner-div-div-2">请稍等...</div>
            <div class="clear"></div>
        </div>
    </div>
    <!-- 用于防止tap事件点击影响下层页面 -->
    <div id="showEditBg_{{dataid}}" style="width:100%;height: 100%;position: fixed;top:0;left: 0;display: none;z-index: 22;background-color: gray;">
    </div>
    <div id="showEdit_{{dataid}}" style="width:100%;height: {{resolutionHeight}};position: fixed;top:0;left: 0;display: none;z-index: 23;background-color: gray;">
        <div id="report_{{dataid}}" class="edit-div-report">
            <img id="readyimg_{{dataid}}" class="edit-div-readyimg">
        </div>
        <div class="mui-content-padded edit-div-content">
            <div class="flex-container" style="">
                <a href="javascript:void(0);" @tap="rotateimgleft()">
                    <span class="mui-icon mui-icon-undo"></span>
                </a>
                <a href="javascript:void(0);" @tap="rotateimg()">
                    <span class="mui-icon mui-icon-redo"></span>
                </a>
                <a href="javascript:void(0);" @tap="confirm()">
                    <span class="mui-icon mui-icon-checkmarkempty"></span>
                </a>
                <a href="javascript:void(0);" @tap="exit()">
                    <span class="mui-icon mui-icon-closeempty"></span>
                </a>
            </div>
        </div>
    </div>
</div>

</template>

<script>

import cropper from 'cropper';
import $ from 'jquery';
import api from 'api';
import log from 'common/logUtils';
import cacheUtils from 'common/cacheUtils';
import CONSTS from 'common/consts';

var files = [];
/*eslint-disable camelcase*/
var upload_empty = require('../../static/img/upload_empty.jpg');
//var empty = require('../../static/img/empty.png');
var img_size = 500;
export default {
    // 定义全局变量
    data: function() {
        log.log('imagecount:' + this.imagecount);
        let obj = {
            upload_empty: upload_empty,
            uploadIndex: 1,
            resolutionHeight: plus.screen.resolutionHeight + 'px'
        };
        for (let i = 0; i < this.imagecount; i++) {
            obj['uploadImagePath' + (i + 1)] = upload_empty;
        }
        return obj;
    },
    // 传入参数定义
    props: {
        dataid: {
            type: String,
            default: 'dataid'
        },
        pictures: {
            type: Array,
            default: []
        },
        cropperratio: {
            type: Number,
            default: 1
        },
        callback: Function,
        imagecount: {
            type: Number,
            default: 3
        },
        uploadtype: {
            type: String,
            default: 'default'
        },
        showimage: {
            type: String,
            default: '../../static/img/mine/nohp.png'
        },
        // imageWidth: {
        //     type: String,
        //     default: '66px'
        // },
        // imageHeight: {
        //     type: String,
        //     default: '66px'
        // },
        businessType: {
            type: String,
            default: '1'
        }
    },
    ready: function() {
        log.log('uploadtype:' + this.uploadtype + ';imagecount:' + this.imagecount);
        $('#upload_edit_div_' + this.dataid).appendTo($('.mui-content'));
    },
    watch: {
        /**
         * 组件清空
         * @type {Object}
         */
        pictures: {
            handler: function(val, oldVal) {
                if (this.pictures.length === 0) {
                    for (let i = 0; i < this.imagecount; i++) {
                        this['uploadImagePath' + (i + 1)] = upload_empty;
                    }
                    this.uploadIndex = 1;
                }
            },
            deep: true
        }
    },
    // 方法集合
    methods: {
        // 显示弹出选择菜单
        showActionSheet: function(obj) {
            log.log('showActionSheet dataid:' + this.dataid);
            var id = this.dataid;
            var cropperratio = this.cropperratio;
            if (obj === this.uploadIndex) {
                var btnArray = [{
                    title: '拍照'
                }, {
                    title: '相册'
                }];
                plus.nativeUI.actionSheet({
                    title: '选择照片',
                    cancel: '取消',
                    buttons: btnArray
                }, function(e) {
                    var index = e.index;
                    if (index === 1) choiceCamera(id, cropperratio);
                    if (index === 2) choicePic(id, cropperratio);
                });
            }
        },
        // 删除已经上传图片
        delUpload: function(obj) {
            for (let i = 0; i < this.uploadIndex; i++) {
                if (this.uploadIndex === 1) {
                    this.uploadImagePath1 = upload_empty;
                } else {
                    this['uploadImagePath' + (obj + i)] = this['uploadImagePath' + (obj + i + 1)];
                }
            }
            this.pictures.splice(obj - 1, 1);
            this.uploadIndex--;
        },
        // 图片旋转
        rotateimgleft: function() {
            $('#readyimg_' + this.dataid).cropper('rotate', -90);
        },
        // 图片旋转
        rotateimg: function() {
            $('#readyimg_' + this.dataid).cropper('rotate', 90);
        },
        // 退出图片截取
        exit: function() {
            $('#showEdit_' + this.dataid).fadeOut();
            var $image = $('#report_' + this.dataid + ' > img');
            var that = this;
            $image.cropper('destroy');
            setTimeout(function() {
                // 去掉关闭动画
                $('#showEditBg_' + that.dataid).hide();
            }, 500);
        },
        // 确认图片截取
        confirm: function() {
            $('#showEdit_' + this.dataid).hide();
            var $image = $('#report_' + this.dataid + ' > img');
            var readyimg_path = $image.attr('src');
            log.log('readyimg_path:' + readyimg_path);
            var dataURL = $image.cropper('getCroppedCanvas');
            /* 换成下边的方法，转成jpeg，但是把质量降低，
            经测试51k的png，转成0.3质量，大小为3k多，0.5质量大小为4k多，
            这回应该不会出现卡的情况了，
            既然差别1k多，还是用0.5的质量，还是要兼顾下显示效果的。
            var imgurl = dataURL.toDataURL("image/jpeg", 0.5);*/
            var imgurl = dataURL.toDataURL('image/png', 0.3);
            log.log('confirm uploadtype:' + this.uploadtype);
            log.log('confirm dataid:' + this.dataid);
            // log.log("截取处理图片路径:"+imgurl);

            var b = new plus.nativeObj.Bitmap();
            var path = '';
            var relativePath = '_doc/camera/u_'+new Date().getTime()+ readyimg_path.substring(readyimg_path.lastIndexOf('/') + 1, readyimg_path.length);

            var that = this;
            // 异步函数同步执行
            var p1 = new Promise(function(resolve, reject) {
                b.loadBase64Data(imgurl, function() {
                    b.save(relativePath, {
                        overwrite: true
                    }, function() {
                        path = plus.io.convertLocalFileSystemURL(relativePath);
                        log.log('cropper image save success');

                        resolve('file://' + path);
                    }, function() {
                        log.log('cropper image save error!!!');
                    });
                }, function() {});
            });

            p1.then(function(val) {
                // 输出一段信息和一个值
                if (val !== '') {
                    files.push({
                        name: 'uploadkey0',
                        path: val
                    });
                }
                $image.cropper('destroy');
                // 用户头像上传单独处理
                if (that.uploadtype === 'userhead') {
                    that.showimage = val;
                } else { // 商品图片上传、采购信息图片上传
                    let container = null;
                    let index = that.uploadIndex;
                    that['uploadImagePath' + index] = val;
                    that['uploadImagePath' + (index + 1)] = upload_empty;
                    that.uploadIndex++;
                    container = mui('#uploadImageProgress' + index + '_' + that.dataid + ' p');
                    if (container && container.progressbar(
                        {
                            progress: 0
                        }).show()) {
                        simulateLoading(container, 0);
                    }
                }
                that.uploadImage(that.pictures, that.callback);
                setTimeout(function() {
                    // 去掉关闭动画
                    $('#showEditBg_' + that.dataid).hide();
                }, 500);
            });
        },
        // 上传图片
        uploadImage: function(pictures, callback) {
            var server = api.PUBLIC_API.upload_image;
            // var server = 'http://192.168.2.61:8888/zqb/api/facade/test_upload/upload_image1';
            log.log('上传图片:' + server);
            if (files.length <= 0) {
                plus.nativeUI.alert('没有添加上传文件！');
                return;
            }
            var wt = plus.nativeUI.showWaiting();
            var that = this;
            var task = plus.uploader.createUpload(server,
                {
                    method: 'POST'
                },
                function(t, status) { // 上传完成
                    files = [];
                    if (status === 200) {
                        log.log('上传成功：' + t.responseText);
                        wt.close();
                        // var result = eval("(" + t.responseText + ")");
                        let result = JSON.parse(t.responseText || '{}');
                        var callbackpath = (result.result_data || {}).site_url;
                        log.log('upload callbackpath：' + callbackpath);
                        if (callback) {
                            callback(callbackpath);
                            plus.nativeUI.toast('上传成功');
                        }
                        if (pictures) {
                            pictures.push(callbackpath);
                        }
                    } else {
                        log.log('t.responseText:' + t.responseText);
                        log.log('上传失败：' + status);

                        wt.close();
                        plus.nativeUI.toast('上传失败');
                        // callback(status);
                        that.delUpload(that.uploadIndex - 1);
                    }
                }
            );
            let token = cacheUtils.localStorage(CONSTS.PREFIX_LOGIN).get(CONSTS.LOGIN_ACCESS_TOKEN);
            let instanceId = cacheUtils.localStorage(CONSTS.PREFIX_LOGIN).get(CONSTS.APP_INSTANCE_ID);
            task.setRequestHeader('instance_id',instanceId);
            task.setRequestHeader('access_token',token);
            task.addData('business_type', that.businessType);
            task.addData('type', 'jpg');
            for (var i = 0; i < files.length; i++) {
                var f = files[i];
                log.log('add file path:' + f.path);
                task.addFile(f.path, {
                    key: f.name
                });
            }
            log.log('开始上传：');
            task.start();
        }
    }
};

/**
 * 通过随机数模拟业务进度，真实业务中需根据实际进度修改
 * @param {Object} container
 * @param {Object} progress
 */
function simulateLoading(container, progress) {
    if (typeof container === 'number') {
        progress = container;
        container = 'body';
    }
    setTimeout(function() {
        progress += Math.random() * 20;
        mui(container).progressbar().setProgress(progress);
        if (progress < 100) {
            simulateLoading(container, progress);
        } else {
            mui(container).progressbar().hide();
        }
    }, Math.random() * 200 + 200);
}

/**
 * 选择照相机拍照
 */
function choiceCamera(id, cropperratio) {
    var cmr = plus.camera.getCamera();
    cmr.captureImage(function(p) {
        plus.io.resolveLocalFileSystemURL(p, function(entry) {
            var localurl = entry.toLocalURL();
            log.log('camera image path:' + localurl);
            // 判断图片大小压缩比例
            plus.io.resolveLocalFileSystemURL(localurl, function(entry) {
                entry.file(function(file) {
                    // 计算需要压缩的比例
                    var size = file.size / 1024;
                    log.log('file size :' + size);
                    if (size > img_size) {
                        // 大于指定大小，进行压缩
                        var dstlocalurl = localurl.replace('.jpg', '_1.jpg');
                        plus.zip.compressImage({
                            src: localurl,
                            dst: dstlocalurl,
                            width: '50%' // 缩小到原来的50%
                        }, function() { // 压缩成功，使用压缩后的图片
                            log.log('camera zip image path:' + dstlocalurl);
                            localurl = dstlocalurl;
                            // 打印图片大小
                            plus.io.resolveLocalFileSystemURL(localurl, function(entry) {
                                entry.file(function(file) {
                                    var size = file.size / 1024 + 'kb';
                                    log.log('zip file size :' + size);
                                }, function(e) {});
                            });

                            $('#readyimg_' + id).attr('src', localurl);
                            // files.push({name:"uploadkey0",path:localurl});
                            cutImg(id, cropperratio);
                            mui('#picture').popover('toggle');
                        }, function(error) { // 压缩失败，使用压缩前的图片
                            log.log('camera zip compress error!!!' + error.stack);
                            $('#readyimg_' + id).attr('src', localurl);
                            // files.push({name:"uploadkey0",path:localurl});
                            cutImg(id, cropperratio);
                            mui('#picture').popover('toggle');
                        });
                    } else {
                        // 小于指定大小，不用压缩
                        $('#readyimg_' + id).attr('src', localurl);
                        // files.push({name:"uploadkey0",path:localurl});
                        cutImg(id, cropperratio);
                        mui('#picture').popover('toggle');
                    }
                }, function(e) {});
            });
        }, function(e) {});
    }, function(e) {}, {
        index: 1,
        filename: '_doc/camera/'
    });
}

/**
 * 选择相机图片
 */
function choicePic(id, cropperratio) {
    plus.gallery.pick(function(path) {
        log.log('select image path:' + path);
        // 判断图片大小压缩比例
        plus.io.resolveLocalFileSystemURL(path, function(entry) {
            entry.file(function(file) {
                // 计算需要压缩的比例
                var size = file.size / 1024;
                log.log('file size :' + size);
                if (size > img_size) {
                    // 大于指定大小，进行压缩
                    var relativePath = '_doc/camera/' + path.substring(path.lastIndexOf('/') + 1, path.length);
                    var dstlocalurl = plus.io.convertLocalFileSystemURL(relativePath);
                    // 判断压缩的图片是否存在，存在不再压缩
                    plus.io.resolveLocalFileSystemURL(relativePath, function(entry) {
                        entry.file(function(file) {
                            var size = file.size / 1024;
                            log.log('zip file size :' + size);
                        }, function(e) {});
                        // 文件存在
                        // files.push({name:"uploadkey0",path:dstlocalurl});
                        $('#readyimg_' + id).attr('src', dstlocalurl);
                        cutImg(id, cropperratio);
                        mui('#picture').popover('toggle');
                    }, function(e) {
                        // 文件不存在
                        var dstlocalurl = plus.io.convertLocalFileSystemURL(relativePath);
                        log.log('dstlocalurl:' + dstlocalurl);
                        plus.zip.compressImage({
                            src: path,
                            dst: dstlocalurl,
                            width: '50%'
                        }, function() {
                            // 压缩成功，使用压缩后的图片
                            log.log('camera zip image path:' + dstlocalurl);
                            // 打印图片大小
                            plus.io.resolveLocalFileSystemURL(dstlocalurl, function(entry) {
                                entry.file(function(file) {
                                    var size = file.size / 1024;
                                    log.log('zip file size :' + size);
                                }, function(e) {});
                            });
                            // files.push({name:"uploadkey0",path:dstlocalurl});
                            $('#readyimg_' + id).attr('src', dstlocalurl);
                            cutImg(id, cropperratio);
                            mui('#picture').popover('toggle');
                        }, function(error) { // 压缩失败，使用压缩前的图片
                            log.log('camera zip compress error!!!' + error.stack);
                            // files.push({name:"uploadkey0",path:path});
                            $('#readyimg_' + id).attr('src', path);
                            cutImg(id, cropperratio);
                            mui('#picture').popover('toggle');
                        });
                    });
                } else {
                    // 小于指定大小，不用压缩
                    // files.push({name:"uploadkey0",path:path});
                    $('#readyimg_' + id).attr('src', path);
                    cutImg(id, cropperratio);
                    mui('#picture').popover('toggle');
                }
            }, function(e) {});
        });
    }, function(e) {}, {
        filter: 'image'
    });
}

// 照片裁剪类
function cutImg(id, cropperratio) {
    $('#showEditBg_' + id).show();
    $('#showEdit_' + id).show();
    var $image = $('#report_' + id + ' > img');
    var ratio = 1 / 1;
    if (cropperratio) {
        if (cropperratio === 2) {
            ratio = 2 / 3;
        } else if (cropperratio === 4) {
            ratio = 4 / 3;
        } else if (cropperratio === 16) {
            ratio = 16 / 9;
        }
    }
    $image.cropper({
        //      strict：类型：Boolean，默认值true。在strict模式中，canvas不能小于容器，剪裁容器不能再canvas之外。
        //      responsive：类型：Boolean，默认值true。是否在窗口尺寸改变的时候重置cropper。
        //      background：类型：Boolean，默认值true。是否在容器上显示网格背景。
        //      modal：类型：Boolean，默认值true。是否在剪裁框上显示黑色的模态窗口。
        //      guides：类型：Boolean，默认值true。是否在剪裁框上显示虚线。
        //      highlight：类型：Boolean，默认值true。是否在剪裁框上显示白色的模态窗口。
        //      autoCrop：类型：Boolean，默认值true。是否在初始化时允许自动剪裁图片。
        //      autoCropArea：类型：Number，默认值0.8（图片的80%）。0-1之间的数值，定义自动剪裁区域的大小。
        //      dragCrop：类型：Boolean，默认值true。是否允许移除当前的剪裁框，并通过拖动来新建一个剪裁框区域。
        //      movable：类型：Boolean，默认值true。是否允许移动剪裁框。
        //      resizable：类型：Boolean，默认值true。是否允许改变剪裁框的大小。
        //      zoomable：类型：Boolean，默认值true。是否允许放大缩小图片。
        //      mouseWheelZoom：类型：Boolean，默认值true。是否允许通过鼠标滚轮来缩放图片。
        //      touchDragZoom：类型：Boolean，默认值true。是否允许通过触摸移动来缩放图片。
        //      rotatable：类型：Boolean，默认值true。是否允许旋转图片。
        //      minContainerWidth：类型：Number，默认值200。容器的最小宽度。
        //      minContainerHeight：类型：Number，默认值100。容器的最小高度。
        //      minCanvasWidth：类型：Number，默认值0。canvas 的最小宽度（image wrapper）。
        //      minCanvasHeight：类型：Number，默认值0。canvas 的最小高度（image wrapper）。
        //      build：类型：Function，默认值null。build.cropper事件的简写方式。
        //      built：类型：Function，默认值null。built.cropper事件的简写方式。
        //      dragstart：类型：Function，默认值null。dragstart.cropper事件的简写方式。
        //      dragmove：类型：Function，默认值null。dragmove.cropper事件的简写方式。
        //      dragend：类型：Function，默认值null。dragend.cropper事件的简写方式。
        //      zoomin：类型：Function，默认值null。zoomin.cropper事件的简写方式。
        //      zoomout：类型：Function，默认值null。zoomout.cropper事件的简写方式。
        guides: false,
        aspectRatio: ratio,
        dragMode: 'move',
        cropBoxResizable: false, // 是否允许改变剪裁框的大小
        cropBoxMovable: false // 是否允许移动剪裁框
    });
}

// 产生一个随机数 scoped
function getUid() {
    return Math.floor(Math.random() * 100000000 + 10000000).toString();
}

</script>

<style>

.li-hide {
    display: none !important;
}

.flex-container {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-flex-flow: row wrap;
    justify-content: space-between;
    text-align: center;
}

.mui-content-padded {
    padding: 10px;
}

.mui-content-padded a {
    margin: 3px;
    width: 50px;
    height: 50px;
    display: inline-block;
    text-align: center;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 25px;
    background-clip: padding-box;
}

.mui-content-padded a .mui-icon {
    margin-top: 12px;
}

.mui-spinner,
.mui-spinner-white {
    margin-top: 12px
}

.active .mui-spinner-indicator {
    background: #007AFF;
}

.mui-content a {
    color: #8F8F94;
}

.mui-content a.active {
    color: #007aff;
}

.head-img {
    width: 80px;
    height: 80px;
}


/*!
 * Cropper v2.3.0
 * https://github.com/fengyuanchen/cropper
 *
 * Copyright (c) 2014-2016 Fengyuan Chen and contributors
 * Released under the MIT license
 *
 * Date: 2016-02-22T02:13:13.332Z
 */

.cropper-container {
    font-size: 0;
    line-height: 0;
    position: relative;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    direction: ltr !important;
    -ms-touch-action: none;
    touch-action: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
}

.cropper-container img {
    display: block;
    width: 100%;
    min-width: 0 !important;
    max-width: none !important;
    height: 100%;
    min-height: 0 !important;
    max-height: none !important;
    image-orientation: 0deg !important;
}

.cropper-wrap-box,
.cropper-canvas,
.cropper-drag-box,
.cropper-crop-box,
.cropper-modal {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
}

.cropper-wrap-box {
    overflow: hidden;
}

.cropper-drag-box {
    opacity: 0;
    background-color: white;
    filter: alpha(opacity=0);
}

.cropper-modal {
    opacity: .5;
    background-color: white;
    filter: alpha(opacity=50);
}

.cropper-view-box {
    display: block;
    overflow: hidden;
    width: 100%;
    height: 100%;
    outline: 1px solid #39f;
    outline-color: rgba(51, 153, 255, .75);
}

.cropper-dashed {
    position: absolute;
    display: block;
    opacity: .5;
    border: 0 dashed #eee;
    filter: alpha(opacity=50);
}

.cropper-dashed.dashed-h {
    top: 33.33333%;
    left: 0;
    width: 100%;
    height: 33.33333%;
    border-top-width: 1px;
    border-bottom-width: 1px;
}

.cropper-dashed.dashed-v {
    top: 0;
    left: 33.33333%;
    width: 33.33333%;
    height: 100%;
    border-right-width: 1px;
    border-left-width: 1px;
}

.cropper-center {
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 0;
    height: 0;
    opacity: .75;
    filter: alpha(opacity=75);
}

.cropper-center:before,
.cropper-center:after {
    position: absolute;
    display: block;
    content: ' ';
    background-color: #eee;
}

.cropper-center:before {
    top: 0;
    left: -3px;
    width: 7px;
    height: 1px;
}

.cropper-center:after {
    top: -3px;
    left: 0;
    width: 1px;
    height: 7px;
}

.cropper-face,
.cropper-line,
.cropper-point {
    position: absolute;
    display: block;
    width: 100%;
    height: 100%;
    opacity: .1;
    filter: alpha(opacity=10);
}

.cropper-face {
    top: 0;
    left: 0;
    background-color: #fff;
}

.cropper-line {
    background-color: #39f;
}

.cropper-line.line-e {
    top: 0;
    right: -3px;
    width: 5px;
    cursor: e-resize;
}

.cropper-line.line-n {
    top: -3px;
    left: 0;
    height: 5px;
    cursor: n-resize;
}

.cropper-line.line-w {
    top: 0;
    left: -3px;
    width: 5px;
    cursor: w-resize;
}

.cropper-line.line-s {
    bottom: -3px;
    left: 0;
    height: 5px;
    cursor: s-resize;
}

.cropper-point {
    width: 5px;
    height: 5px;
    opacity: .75;
    background-color: #39f;
    filter: alpha(opacity=75);
}

.cropper-point.point-e {
    top: 50%;
    right: -3px;
    margin-top: -3px;
    cursor: e-resize;
}

.cropper-point.point-n {
    top: -3px;
    left: 50%;
    margin-left: -3px;
    cursor: n-resize;
}

.cropper-point.point-w {
    top: 50%;
    left: -3px;
    margin-top: -3px;
    cursor: w-resize;
}

.cropper-point.point-s {
    bottom: -3px;
    left: 50%;
    margin-left: -3px;
    cursor: s-resize;
}

.cropper-point.point-ne {
    top: -3px;
    right: -3px;
    cursor: ne-resize;
}

.cropper-point.point-nw {
    top: -3px;
    left: -3px;
    cursor: nw-resize;
}

.cropper-point.point-sw {
    bottom: -3px;
    left: -3px;
    cursor: sw-resize;
}

.cropper-point.point-se {
    right: -3px;
    bottom: -3px;
    width: 20px;
    height: 20px;
    cursor: se-resize;
    opacity: 1;
    filter: alpha(opacity=100);
}

.cropper-point.point-se:before {
    position: absolute;
    right: -50%;
    bottom: -50%;
    display: block;
    width: 200%;
    height: 200%;
    content: ' ';
    opacity: 0;
    background-color: #39f;
    filter: alpha(opacity=0);
}

@media (min-width: 768px) {
    .cropper-point.point-se {
        width: 15px;
        height: 15px;
    }
}

@media (min-width: 992px) {
    .cropper-point.point-se {
        width: 10px;
        height: 10px;
    }
}

@media (min-width: 1200px) {
    .cropper-point.point-se {
        width: 5px;
        height: 5px;
        opacity: .75;
        filter: alpha(opacity=75);
    }
}

.cropper-invisible {
    opacity: 0;
    filter: alpha(opacity=0);
}


/*
.cropper-bg {
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC');
}
*/

.cropper-hide {
    position: absolute;
    display: block;
    width: 0;
    height: 0;
}

.cropper-hidden {
    display: none !important;
}

.cropper-move {
    cursor: move;
}

.cropper-crop {
    cursor: crosshair;
}

.cropper-disabled .cropper-drag-box,
.cropper-disabled .cropper-face,
.cropper-disabled .cropper-line,
.cropper-disabled .cropper-point {
    cursor: not-allowed;
}

.div-p {
    height: 2px;
}

.upload-image {
    width: 88px;
    height: 88px;
}

.spinner-div {
    text-align: center;
    z-index: 99;
    width: 100%;
    height: 2000px;
    background-color: #f2f2f2;
    position: absolute;
    top: 40px;
    left: 0px;
    display: none;
}

.spinner-div-div {
    width: 90px;
    padding-top: 200px;
    margin: 0 auto;
    height: 100%;
}

.spinner-div-div-1 {
    width: 30px;
    float: left;
}

.spinner-div-div-2 {
    width: 60px;
    float: left;
}

.spinner-div-div-span {
    height: 20px;
}

.edit-div-report {
    width: 100%;
    height: 100%;
    z-index: 10;
}

.edit-div-content {
    width: 100%;
    height: 100px;
    z-index: 110;
    position: absolute;
    top: 60px;
    left: 0px;
}

.edit-div-readyimg {
    width: 100%;
}

.mui-input-row .mui-btn {
    float: none;
    width: auto;
    margin: 10px;
} 

.mui-icon-trash {
    font-size: 20px !important;
    background-color: red;
    border-radius: 50%;
    color: #ffffff;
}

.mui-table-view-cell a {
    border: 0;
    border-radius: 0;
}

.mui-table-view-cell img {
    width: 100%;
    max-height: 76px;
}

.mui-table-view-cell>.mui-btn {
    top: 14px;
    right: -12px;
}

.mui-table-view.mui-grid-view .mui-table-view-cell {
    padding-top: 10px !important;
    padding-left: 5px !important;
    padding-right: 5px !important;
    margin-right: 0;
}

</style>
