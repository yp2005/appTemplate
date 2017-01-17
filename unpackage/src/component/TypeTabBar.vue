/**
 * @file 类型选择组件
 * @Author yupeng
 * 组件使用：
 *  引入：import typeTabBar from 'component/TypeTabBar';
 *  标签示例：<type-tab-bar :cur-value.sync="typeValue" :type-datas="typeDatas"></type-tab-bar>
 *  参数：
 *  @param {Array} typeDatas 类型数据，参考default，应该从服务器请求
 *  @param {String} curValue 当前类型值
 * @public
 */

<template>
    <div id="component_type_tab_bar" class="mui-scroll-wrapper mui-slider-indicator mui-segmented-control mui-segmented-control-inverted">
        <div class="mui-scroll">
            <a href="javascript:void(0);" @tap="queryType($index)" class="mui-control-item queryTypeDFull {{curIndex === -1 ? 'mui-active' : ''}} {{fromSellerPage ? 'blue' : ''}}" value="">
                全部
            </a>
            <a href="javascript:void(0);" v-for="typeData in typeDatas" value="{{typeData.g1_code}}" @tap="queryType($index)" class="mui-control-item {{curIndex === $index ? 'mui-active' : ''}} {{fromSellerPage ? 'blue' : ''}}">
                {{typeData.g1_name}}
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            typeDatas: {
                type: Array,
                default: [{
                    g1_image: '',
                    g1_name: '中西餐调料',
                    g1_code: 10000,
                    description: ''
                }, {
                    g1_image: '',
                    g1_name: '干果',
                    g1_code: 20000,
                    description: ''
                }, {
                    g1_image: '',
                    g1_name: '休闲食品/冲饮',
                    g1_code: 30000,
                    description: ''
                }, {
                    g1_image: '',
                    g1_name: '地方特产',
                    g1_code: 40000,
                    description: ''
                }, {
                    g1_image: '',
                    g1_name: '粮油/干货',
                    g1_code: 50000,
                    description: ''
                }, {
                    g1_image: '',
                    g1_name: '糖酒茶',
                    g1_code: 60000,
                    description: ''
                }, {
                    g1_image: "",
                    g1_name: '酒店用品',
                    g1_code: 70000,
                    description: ''
                }, {
                    g1_image: '',
                    g1_name: '厨房设备',
                    g1_code: 80000,
                    description: ''
                }]
            },
            curValue: {
                type: Number,
                default: 0
            },
            curIndex: {
                type: Number,
                default: -1
            },
            fromSellerPage: Boolean
        },
        methods: {
            queryType: function(index) {
                if(index != undefined) {
                    this.curValue = this.typeDatas[index].g1_code;
                    this.curIndex = index;
                } else {
                    this.curValue = 0;
                    this.curIndex = -1;
                }
            }
        },
        ready: function() {
            var deceleration = mui.os.ios ? 0.003 : 0.0009;
            mui('#component_type_tab_bar').scroll({
                bounce: false,
                indicators: true, //是否显示滚动条
                deceleration: deceleration
            });
        }
    };
</script>
<style scoped>
    .mui-plus-pullrefresh .mui-scroll-wrapper {
        overflow: hidden;
    }
    
    .mui-scroll-wrapper.mui-slider-indicator .mui-scroll,
    .mui-slider-indicator.mui-segmented-control {
        height: 46px;
    }
    
    .mui-scroll-wrapper.mui-slider-indicator .mui-scroll {
        position: absolute;
    }
    .mui-scroll-wrapper.mui-slider-indicator .mui-scroll:after{
    	content: '';
    	position: absolute;
    	left: 0;
    	right: 0;
    	bottom: 0;
    	height: 1px;
    	background: #D7D7D7;
    	-webkit-transform: scaleY(.5);
    	transform: scaleY(.5);
    }
    .mui-slider-indicator.mui-segmented-control {
        position: absolute;
        width: 100%;
        top: 45px;
        z-index: 1;
        background: #FFFFFF;
        line-height: 1;
    }
    
    .mui-slider-indicator.mui-segmented-control a {
        color: #222222;
        font-size: 17px;
        font-weight: normal;
        padding: 0;
        line-height: 38px;
        margin: 5px 0;
    }
    
    .mui-slider-indicator.mui-segmented-control a:last-child {
        padding: 0 12px 0 10px;
    }
    
    .mui-segmented-control.mui-segmented-control-inverted .mui-control-item {
        border-bottom: 2px solid transparent;
    }
    
    .mui-segmented-control.mui-segmented-control-inverted .mui-control-item.mui-active {
        border-bottom: 2px solid #f04e30;
        color: #f04e30;
    }
    
    .mui-segmented-control.mui-segmented-control-inverted .mui-control-item.mui-active.blue {
        border-bottom: 2px solid #419fdc;
        color: #419fdc;
    }
    
    .mui-segmented-control.mui-segmented-control-inverted .mui-control-item {
        padding: 0 10px;
    }
    
    .mui-segmented-control.mui-segmented-control-inverted .mui-control-item.queryTypeDFull {
        padding: 0 10px 0 12px;
        border-left: 0;
    }
</style>