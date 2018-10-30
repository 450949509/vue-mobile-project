<template>
    <div class="head">

            <!--<div style="float:left;position:absolute;" @click="routerBack">
                <i class="iconfont icon-fanhui"></i>
            </div>
            <span class="title">{{title}}</span>-->
            <ul>
                <li @click="routerBack">
                    <i class="iconfont icon-fanhui"></i>
                </li>
                <li v-if="title!='商品详情'">
                    <span class="title">{{title}}</span>
                </li>
                <li v-else class="goods_title">
                    <span :class="{'active':goodsType==1}" @click="checkType(1)">商品</span>
                    <span :class="{'active':goodsType==2}" @click="checkType(2)">详情</span>
                </li>
                <li>
                    <router-link to="/shop/shopCart"  v-if="title=='商品详情'||title=='商品列表'">
                        <div class="head_cart">
                            <span class="cart_num" v-if="cartNum>99">99+</span>
                            <span class="cart_num" v-else-if="cartNum>0&&cartNum<=99">{{cartNum}}</span>
                        </div>
                    </router-link>
                </li>
            </ul>
    </div>

</template>

<script>
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    import Cookie from '../../../config/mUtils';
    import {findCartItemSumByUserId,standardPayCancle} from '../../../api/getData';
    export default{

        data(){
            return {
                title:'',
                goodsType:1,
                cartNum:0
            }
        },
		components: {

		},
        created (){
            this.title = this.$route.name;
            this.cartNum = this.$store.state.shopCartNum;
            if(this.title=='商品详情'||this.title=='商品列表'){
               // this.findCartItemSumByUserId();
            }
        },
        watch:{
            "$route": {
                handler(curVal,oldVal){
                    this.title = curVal.name;
                    this.checkType(1);
                    if(this.title=='商品详情'||this.title=='商品列表'){
                        this.findCartItemSumByUserId();
                    }
                },
                deep:true
            },
            "$store.state.shopCartNum":{
                handler(curVal,oldVal){
                    this.cartNum = this.$store.state.shopCartNum;
                },
                deep:true
            },
            "$store.state.cardTitle": {
                handler(curVal,oldVal){
                    this.title = this.$store.state.cardTitle;
                },
                deep:true
            }
        },
        methods:{
            routerBack(){
                if(this.$route.path == "/shop"){
                    this.$router.push('/home');
                }else if(this.$route.path == "/shop/order" || this.$route.path == "/shop/site"){
                    this.$router.push('/my');
                }else if(/\/shop\/orderDatails/.test(this.$route.path)){
                    this.$router.push('/shop/order');
                }else if(/\/shop\/pay/.test(this.$route.path)){
                    MessageBox({
                        title: '确定要放弃付款',
                        message: '订单创建后会保留30分钟，请尽快支付',
                        showCancelButton: true,
                        confirmButtonText: '放弃支付',
                        cancelButtonText: '继续支付',
                    }).then(action => {
                        if(action=='confirm'){
                            this.standardPayCancle();
                        }
                    });
                }else{
                    if(window.history.length<=1){
                        this.$router.push('/home')
                    }else{
                        this.$router.go(-1);
                    }
                }

            },
            checkType(type){
                this.goodsType = type;
                this.$store.dispatch("setGoodsType",type);
            },
            //放弃支付
            async standardPayCancle() {
                try {
                    const res = await standardPayCancle({orderCode:this.$route.params.orderCode});

                    if (res.data.code == 0) {
                        this.$router.push('/shop/orderDatails/'+this.$route.params.orderCode);
                    } else {
                        MessageBox('', '取消支付失败').then(action => {
                            this.$router.push('/shop/orderDatails/'+this.$route.params.orderCode);
                        });
                    }

                } catch (err) {
                    Toast(err);
                }
            },


            async findCartItemSumByUserId() {
                try {
                    const res = await findCartItemSumByUserId();

                    if (res.data.code == 0) {
                        this.cartNum = res.data.data;
                        this.$store.dispatch("setShopCartNum",res.data.data);
                    } else {

                    }

                } catch (err) {

                }
            },
		},
    }
</script>

<style lang="scss" scoped>
    $baseWidth:750px;
    @function px($val) {
        @return $val/$baseWidth*10+rem;
    }

    .head{
        text-align:center;
        padding:0 px(20px);
        border-bottom:0.5px solid #DCDCDC;
        line-height:px(88px);
        position:fixed;
        width: 100%;
        box-sizing: border-box;
        z-index:999;
        background:#Fff;
        span{
            font-size:px(36px);
        }
    }
    .title{
        font-size:px(36px);
        font-weight:900;
    }

    ul{
        display: flex;
        display: -webkit-flex; /* Safari */
        justify-content:space-between;
        li{
            display: flex;
            display: -webkit-flex; /* Safari */
            align-items:center;
        }
    }

    .head_cart{
        width:px(48px);
        height:px(48px);
        background:url(../../../../static/assets/img/head_cart.png);
        background-size:cover;
        position:relative;
        .cart_num{
            display:block;
            position:absolute;
            line-height:px(24px);
            text-align:center;
            width:px(36px);
            background:#f23030;
            color:#fff;
            font-size:px(18px);
            border-radius:8px;
            right: -5px;
            top: -2px;
        }
    }
    .goods_title{
        display: flex;
        display: -webkit-flex; /* Safari */
        justify-content:space-between;
        span{
            font-size:px(26px);
            margin:0 px(27px);
            color:#323232;
        }
        .active{
            color:#ff8546;
            border-bottom:px(4px) solid #ff8546;
        }
    }
</style>