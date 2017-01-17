/**
 * @file 无网络提示信息组件
 * @Author yupeng
 * 组件使用：
 *  引入：import nonetworkmask from 'component/mask/NoNetWorkMask';
 *  标签示例：<nonetworkmask :disnonetworkmask.sync="disnonetworkmask" :top="45" :bottom="0"></nonetworkmask>
 *  回调函数：每个引用此组件的页面需要在自己的组件的methods里面实现一个“reload”方法实现刷新页面的逻辑
 *  参数：
 *  @param {Number} top 提示页距离顶部的高度
 *  @param {Number} bottom 提示页距离底部的高度
 *  @param {Boolean} disnonetworkmask 是否显示提示页，通过修改此值来控制提示页是否显示
 * @public
 */
<template>
    <div class="NoNetWorkMask" style="top: {{top}}px;bottom: {{bottom}}px;display: {{disnonetworkmask ? true : 'none'}};">
    	<p><img src="../../static/img/nowifi.png"/></p>
    	<p>网络请求失败</p>
    	<p>请检查您的手机是否联网</p>
    	<p><a href="javascript:void(0)" @tap="reload">重新加载</a></p>
    </div>
</template>

<script>
    import muiUtils from 'common/muiUtils';
    import CONSTS from 'common/consts';
    
    export default {
        props: {
            top: {
                type: Number,
                default: 45
            },
            bottom: {
                type: Number,
                default: 0
            },
            disnonetworkmask: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            reload() {
                if(plus.networkinfo.getCurrentType() !== 1) {
                    this.disnonetworkmask = false;
                    this.$parent.reload();
                } else {
                    mui.toast('亲，您的网络有问题！');
                }
            }
        }
    };
</script>
<style scoped>
    .NoNetWorkMask {
        width: 100%;
        position: fixed;
        z-index: 999;
        padding-top: 30%;
        background-color: #fff;
        text-align: center;
    }
    
    .NoNetWorkMask img {
        width: 120px;
    }
    
    .NoNetWorkMask p {
        text-align: center;
        color: #999999;
        font-size: 14px;
        line-height: 1;
    }
    .NoNetWorkMask p:nth-child(2) {
        color: #222222;
        font-size: 15px;
        margin: 15px 0 12px 0;
        text-align: center;
    }
    .NoNetWorkMask p:nth-child(3){
        margin-bottom: 32px;
    }
    .NoNetWorkMask p a {
        color: #222222;
        border: solid 1px #999999;
        line-height: 36px;
        height: 36px;
        padding: 0 20px;
        -webkit-border-radius: 4px;
        border-radius: 4px;
    }
</style>