<template>
    <div class="head">

            <!--<div style="float:left;position:absolute;" @click="routerBack">
                <i class="iconfont icon-fanhui"></i>
            </div>
            <span class="title">{{title}}</span>-->
            <ul>
                <li>

                </li>
                <li>
                    <div class="logo" v-if="showCooperator && showFgj">
                        <img src="../../../../static/assets/img/logo.png" />
                        <span></span>
                        <img :src="userInfo.companyLogo" />
                    </div>
                    <div class="logo" v-if="!showCooperator && showFgj">
                        <img src="../../../../static/assets/img/logo.png" />
                    </div>
                    <div class="logo" v-if="showCooperator && !showFgj">
                        <img :src="userInfo.companyLogo" />
                    </div>

                </li>
                <li>
                    <router-link to="/shop/shopCart">
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
    import Cookie from '../../../config/mUtils';
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    import {findCartItemSumByUserId,userByUserId} from '../../../api/getData';
    export default{
        props: {
            showCooperator: {
                type: Boolean,
                default: function () {
                    return false
                }
            },
            showFgj: {
                type: Boolean,
                default: function () {
                    return false
                }
            },
        },
        data(){
            return {
                title:'',
                goodsType:1,
                cartNum:0,
                userInfo:{}
            }
        },
		components: {

		},
        created (){
            this.title = this.$route.name;
            this.findCartItemSumByUserId();
            this.userByUserId();
        },
        methods:{
            routerBack(){
                if(this.$route.path == "/shop" || this.$route.path == "/shop/site" || this.$route.path == "/shop/order"){
                    this.$router.go(-1);
                }else if(/\/shop\/orderDatails/.test(this.$route.path)){
                    this.$router.push('/shop/order');
                }else{
                    if(window.history.length<=1){
                        Cookie.mutations.closeWebView();
                    }else{
                        this.$router.go(-1);
                    }
                }

            },

            async findCartItemSumByUserId() {
                try {
                    const res = await findCartItemSumByUserId();

                    if (res.data.code == 0) {
                        this.cartNum = res.data.data;
                        this.$store.dispatch("setShopCartNum",res.data.data);
                    } else {
                        Toast(res.data.data);
                    }

                } catch (err) {
                    Toast(err);
                }
            },
            async userByUserId() {
                try {
                    const res = await userByUserId();

                    if (res.data.code == 0) {
                        this.userInfo = res.data.data;
                    } else {
                        Toast(res.data.data);
                    }

                } catch (err) {
                    Toast(err);
                }
            },

		},
        watch:{
            "$route": {
                handler(curVal,oldVal){
                    this.title = curVal.name;
                    this.cartNum = this.$store.state.shopCartNum;
                },
                deep:true
            },
            "$store.state.shopCartNum":{
                handler(curVal,oldVal){
                    this.cartNum = this.$store.state.shopCartNum;
                },
                deep:true
            }
        }
    }
</script>

<style lang="scss" scoped>
    $baseWidth:750px;
    @function px($val) {
        @return $val/$baseWidth*10+rem;
    }

    .head{
        padding:0 px(20px);
        border-bottom:0.5px solid #DCDCDC;
        height:px(88px);
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
        height:100%;
        display: flex;
        display: -webkit-flex; /* Safari */
        justify-content:space-between;
        li{
            display: flex;
            display: -webkit-flex; /* Safari */
            align-items:center;
        }
        li:nth-child(1){
            width:px(100px);
        }
        li:nth-child(2){
            flex-grow:2;
            justify-content:center;
        }
        li:nth-child(3){
            width:px(100px);
            justify-content:flex-end;
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

    .logo{
        display: flex;
        display: -webkit-flex; /* Safari */
        justify-content:center;
        align-items:center;
        width:100%;
        height:px(68px);
        img{
            width:px(180px);
            height:100%;
        }
        span{
            width:1px;
            height:px(36px);
            background:#ff8546;
        }
    }
</style>