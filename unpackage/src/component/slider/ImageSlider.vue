<template>

<div id="slider" class="mui-slider">
    <div class="mui-slider-group mui-slider-loop">
        <!-- 额外增加的一个节点(循环轮播：第一个节点是最后一张轮播) -->
        <div class="mui-slider-item mui-slider-item-duplicate">
            <a href="{{iszoom ? 'javascript: void(0)' : images[(images.length-1)].banner_url}}">
                <img @tap="itemTap(img)" :src="images[images.length-1].banner_img_url | imageSizeFilter 720" id="{{images[images.length-1].banner_order}}">
                <p class="mui-slider-title">{{images[images.length-1].banner_name}}</p>
            </a>
        </div>
        <div v-for="img in images" class="mui-slider-item">
            <a href="{{iszoom ? 'javascript: void(0)' : img.banner_url}}">
                <img @tap="itemTap(img)" :src="img.banner_img_url ? img.banner_img_url : '../../static/img/placehold.png' | imageSizeFilter 720" id="{{img.banner_order}}" data-preview-src="" data-preview-group="1">
                <p class="mui-slider-title">{{img.banner_name}}</p>
            </a>
        </div>
        <!-- 额外增加的一个节点(循环轮播：最后一个节点是第一张轮播) -->
        <div class="mui-slider-item mui-slider-item-duplicate">
            <a href="{{iszoom ? 'javascript: void(0)' : images[0].banner_url}}">
                <img @tap="itemTap(img)" :src="images[0].banner_img_url | imageSizeFilter 720" id="{{images[0].banner_order}}">
                <p class="mui-slider-title">{{images[0].banner_name}}</p>
            </a>
        </div>
    </div>
    <div class="mui-slider-indicator mui-text-right" style="display: {{indicatorDisplay}};">
        <div v-for="(index, img) in images" class="mui-indicator {{index == 0 ? 'mui-active':''}}"></div>
    </div>
</div>

</template>

<script>

/*!
 * ImageSlider v1.0.0
 * 图片轮播组件
 *
 * Author: liyubai
 * Date: 2016-06-08
 *
 * 标签引用: <slider :images="images"></slider>
 *
 * @param images 图文轮播图片集合
 *         banner_img_url	String	栏目图片URL
 *         banner_url	String	栏目跳转URL
 *         banner_name	String	栏目名称
 *         banner_order	int	栏目顺序
 *
 */
/*eslint-disable no-unused-vars */
import zoom from 'static/js/mui.zoom.js';
import previewimage from 'static/js/mui.previewimage.js';
import {imageSizeFilter4Home} from 'filter/commonFilter';
import 'static/css/imgpreview.css';
export default {
    // 定义全局变量
    data: function() {
        return {
            indicatorDisplay: true
        };
    },
    // 传入参数定义
    props: {
        images: Array,
        iszoom: {
            type: Boolean,
            default: false
        },
        itemTap: {
            type: Function,
            default: function() {
                console.log('default itemTap!');
            }
        }
    },
    // 方法集合
    methods: {
        loadImage: function() {
            // console.log('this.images.length:' + this.images.length);
            if (this.images.length > 1) {
                var slider = mui('#slider');
                slider.slider({
                    interval: 1000
                });
                this.indicatorDisplay = true;
            } else {
                this.indicatorDisplay = 'none';
            }
        },
        gotoPage: function(item) {
            this.itemTap(item);
        }
    },
    ready: function() {
        this.loadImage();
        if (this.iszoom) {
            mui.previewImage();
        }
    },
    watch: {
        images: {
            handler: function() {
                this.loadImage();
            },
            deep: true
        }
    },
    filters: {
        imageSizeFilter: imageSizeFilter4Home
    }
};

</script>

<style scoped>

.mui-slider-indicator {
    background: transparent;
    bottom: 0;
}

.mui-slider-indicator.mui-text-right {
    text-align: center !important;
}

.mui-slider-indicator .mui-indicator {
    width: 4px;
    height: 4px;
    margin: 1px 1px 6px 1px;
    background: #FFFFFF;
    border: none;
    border: 0;
    -webkit-box-shadow: 0 0 transparent;
    box-shadow: 0 0 transparent;
}

.mui-slider-indicator .mui-indicator.mui-active {
    background: #bd3c26;
}

.mui-slider-title {
    display: none;
    background: transparent;
}

</style>
