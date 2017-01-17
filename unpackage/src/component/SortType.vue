/**
 * @file 排序类型组件
 * @Author yupeng
 * 组件使用：
 *  引入：import sortType from 'component/SortType';
 *  标签示例：<sort-type :cur-type.sync="sortTypeValue" :sort-types="sortTypes"></sort-type>
 *  参数：
 *  @param {Array} sortTypes 排序类型数据
 *  @param {String} curType 当前排序类型
 * @public
 */

<template>
    <div class="sort-type">
        <label>排序:</label>
        <div class="sort-types">
            <a href="javascript:void(0);" v-for="sortType in sortTypes" @tap="sort($index)" :class="['type-but', {'mui-active':$index==curIndex?true:false}, {'blue':fromSellerPage?true:fa}]" value="{{sortType.text}}">{{sortType.text}}</a>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            sortTypes: {
                type: Array,
                default: [{
                    text: '按发布时间',
                    value: '1'
                }, {
                    text: '按到期时间',
                    value: '2'
                }, {
                    text: '按人气排行',
                    value: '3'
                }]
            },
            curType: {
                type: String,
                default: '1'
            },
            curIndex: {
                type: Number,
                default: 0
            },
            sortArrow: {
                type: String,
                default: '2'
            },
            fromSellerPage: Boolean
        },
        methods: {
            sort: function(index) {
                if(index == this.curIndex) {
                    if(this.sortArrow === '1') {
                        this.sortArrow = '2';
                    } else {
                        this.sortArrow = '1';
                    }
                } else if(this.sortTypes[index].value === '2') {
                    this.sortArrow = '1';
                } else {
                    this.sortArrow = '2';
                }
                this.curType = this.sortTypes[index].value;
                this.curIndex = index;
                this.$parent.doSearch();
            }
        }
    };
</script>
<style scoped>
    .sort-type label,
    .sort-type> div,
    .sort-type> div a {
        float: left;
        height: 40px;
        line-height: 40px;
    }
    
    .sort-type {
        height: 40px;
        line-height: 40px;
        position: absolute;
        top: 91px;
        width: 100%;
        background: #FFFFFF;
        margin: 0;
        padding: 0;
    }
    
    .sort-type label {
        display: inline-block;
        color: #666666;
        font-size: 16px;
        text-align: center;
        padding-left: 12px;
    }
    
    .sort-type > div {
        position: absolute;
        left: 46px;
        right: 0;
        margin-left: 15px;
    }
    
    .sort-type > div a {
        color: #222222;
        font-size: 13px;
        background: #f5f6fa;
        margin-right: 15px;
        margin-top: 8px;
        border: 1px solid #f5f6fa;
        padding: 5px 8px 4px 8px;
        height: auto;
        line-height: 1;
        float: left;
        -webkit-border-radius: 4px;
        -moz-border-radius: 4px;
        border-radius: 4px;
        display: inline-block;
    }
    .mui-ios .sort-type> div a{
    	padding: 5px 8px;
    	margin-top: 7px;
    }
    .sort-type > div a:nth-child(3) {
        margin-right: 0;
    }
    
    .sort-type > div .mui-active {
        color: #f04e30;
        background: #FFFFFF;
        border: 1px solid #f04e30;
    }
    
    .sort-type> div .mui-active.blue {
        color: #419fdc;
        background: #FFFFFF;
        border: 1px solid #419fdc;
    }
    
    @media (max-width: 320px) {
        .sort-type > div {
            margin-left: 8px;
        }
        .sort-type > div a {
            margin-right: 8px;
            padding: 6px 5px 4px 5px;
        }
    }
</style>