<template>
    <home v-show="index === 0" v-ref:home></home>
    <!--<type v-show="index === 1" v-ref:type></type>
    <order v-show="index === 2" v-ref:order></order>
    <mine v-show="index === 3" v-ref:mine></mine>-->
</template>
<script>
    import home from '../../../bizcomponent/Home';
    //import type from '../../type/bizcomponent/Type';
    //import order from '../../order/bizcomponent/Order';
    //import mine from '../../mine/bizcomponent/Mine';
    export default {
        data() {
            return {
                index: 0
            };
        },
        watch: {
            /*index() {
                if(this.index === 0) {
                    this.$refs.home.loadData();
                }
                else if(this.index === 1) {
                    this.$refs.type.loadData();
                }
                else if(this.index === 2) {
                    this.$refs.order.loadData();
                }
                else if(this.index === 3) {
                    this.$refs.mine.loadData();
                }
            }*/
        },
        components: {
            home,
            /*type,
            order,
            mine*/
        }
    }
</script>
