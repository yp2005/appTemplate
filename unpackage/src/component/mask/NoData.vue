<!--
	作者：yvan
	时间：2016-08-25
	描述：列表数据为空时展示页面
	1. 通过myClass属性传递一个class自定义样式
	2. 可以对象形式传参给info属性
	3. 也可以简单属性形式传参单个需要定制的属性，注意此时属性名应转换成kebab-case
-->

<template>
    <div :class="['nd-base', myClass]">
        <div>
            <img class="myclassimg" :src="imgSrc" :alt="imgAlt" />
        </div>
        <div class="nd-msg">
            <p v-for="p of paragraph">
                {{p}}
            </p>
        </div>
        <div class="nd-btn">
            <button @tap.stop="btnHandler">{{btnValue}}</button>
        </div>
    </div>
</template>
<style scoped>
    .nd-base {
        position: absolute;
        z-index: 999;
        top: 44px;
        width: 100%;
        height: 100%;
        padding: 30% 0 0;
        background-color: #fff;
        text-align: center;
    }
    
    .nd-base img {
        width: 30%;
    }
    
    .nd-msg {
    	line-height: 2;
    	margin: 12px auto;
    }
</style>
<script>
    import muiUtils from 'common/muiUtils';
    var self = null;

    export default {
        init() {
            self = this;
        },
        props: {
            info: Object,
            myClass: String,
            imgSrc: {
                type: String,
                default: '../../static/img/data-less.png'
            },
            imgAlt: {
                type: String,
                default: '无数据'
            },
            textContent: {
                type: String,
                default: '您还没有收藏过商品\n何不去逛逛'
            },
            btnValue: {
                type: String,
                default: '去首页逛逛'
            },
            btnHandler: {
                type: Function,
                default(){
                    muiUtils.openIndexWindow();
                }
            }
        },
        computed: {
              paragraph() {
                  return this.textContent.split('\n');
              }
        },
        beforeCompile() {
            if (typeof this.info === 'object') {
                let propKeys = Object.keys(this.$options.props).splice(1);
                Object.keys(this.info).forEach(key => {
                    if (propKeys.indexOf(key) !== -1) {
                        self[key] = self.info[key];
                    }
                });
            }
        }
    }
</script>