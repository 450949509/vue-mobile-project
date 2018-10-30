<template>
    <div class="cart">
        <div class="cart_top" v-if="cartType || shopCartList.length > 0">
            <div class="page-loadmore-wrapper">
                <ul>
                    <li v-for="(item,key) in shopCartList">
                        <div class="goods_1">
                            <template v-if="item.status==3 && item.realStockNum!=0 && item.isVendible==1">
                                <input type="checkbox" class="mint-checkbox-input" v-model="item.check">
                                <i :class="{'icon-round':!item.check,'icon-roundcheckfill':item.check}" class="iconfont" @click="checkGoods(key)"></i>
                            </template>
                            <template v-if="item.status!=3 || item.isVendible == 0">
                                <i class="sold_no"></i>
                            </template>
                            <template v-if="item.status==3 && item.realStockNum==0">
                                <i class="sold_out"></i>
                            </template>
                        </div>
                        <div class="goods_2">
                            <img v-lazy="item.puPicUrl+'?imageMogr2/size-limit/100k!'">
                        </div>
                        <div class="goods_3">
                            <div class="goods_title"><h5>{{item.productUnitName}}</h5><i class="iconfont icon-delete_light" @click="deleteGoodsSku(item.cartItemId)"></i></div>
                            <div class="goods3_price">
                                <span>&yen;{{item.salePrice.toFixed(2)}}</span>
                                <p>
                                    <i class="cart_del" v-if="item.num>1" @click="setReductPayNum(key,item.cartItemId,item.isVendible,item.status)"></i>
                                    <i class="cart_del" v-else-if="item.num<=1"></i>
                                    <b>{{item.num}}</b>
                                    <i class="cart_add" v-if="item.num<item.realStockNum" @click="setAddPayNum(key,item.cartItemId,item.isVendible,item.status)"></i>
                                    <i class="cart_add" v-else-if="item.num>=item.realStockNum"></i>
                                </p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="cart_bottom">
                <div>
                    <input type="checkbox" class="mint-checkbox-input" v-model="allCheck">
                    <i :class="{'icon-round':!allCheck,'icon-roundcheckfill':allCheck}" class="iconfont" @click="checkAllGoods()"></i>
                    <span>全选</span>
                </div>
                <div>
                    <p><span>合计：</span><b>&yen;{{allPrice.toFixed(2)}}</b><span>福币</span></p>
                    <h6>实付金额以结算页面为准</h6>
                </div>
                <div @click="orderConfirm">
                    去结算
                </div>
            </div>
        </div>
        <div class="cart_error" v-else>
            <img src="../../../../static/assets/img/cart_error.png" alt="">
            <p>去添加点什么吧～</p>
        </div>
    </div>
</template>

<script>
    import {findPageCartItem,cartDeleteById,cartItemNumPlusById,cartItemNumSubtractById} from '../../../api/getData';
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    export default{

        data(){
            return {
                pageNo:1,
                shopCartList:[],
                allCheck:false,
                allPrice:0,
                selected:"shopCart",
                cartHeight:0,
                loading:false,
                cartType:true,
            }
        },
        created () {

        },
        mounted() {
            this.findPageCartItem();
        },
		watch : {
            'shopCartList': {
                handler(curVal,oldVal){
                    var status = false;
                    $.each(curVal,function(key,info){
                        if(info.check||info.isVendible==0){
                            status = true;
                        }else{
                            return status = false;;
                        }
                    })
                    this.allCheck = status;
                },
                deep:true
            },
        },
        methods:{
            async findPageCartItem() {
                try {
                    const res = await findPageCartItem();
                    if (res.data.code == 0) {
                        this.cartType = true;
                        Indicator.close();

                        this.computePrice();
                        if(res.data.data.list.length == 0){
                            this.cartType = false;
                            this.loading = true;
                            this.shopCartList = this.shopCartList.concat(res.data.data.list);
                        }else{
                            this.pageNo++;
                            this.shopCartList = this.shopCartList.concat(res.data.data.list);
                            $.each(this.shopCartList,function(key,info){
                                info.check = false;
                            })
                        }
                    } else {
                        this.cartType = false;
                        Indicator.close();
                    }
                } catch (err) {
                     Toast('网络错误');
                     this.cartType = false;
                     Indicator.close();
                }
            },
            loadMore(){
                this.findPageCartItem();
                Indicator.open();
            },
            checkGoods(key){
                this.shopCartList[key].check = !this.shopCartList[key].check;
                this.$set(this.shopCartList, key, this.shopCartList[key]);
                this.computePrice();
            },
            //增加数量
            setAddPayNum(key,skuId,isVendible,status){
                if(this.shopCartList[key].num<this.shopCartList[key].realStockNum  && status==3 && isVendible==1){
                    this.cartItemNumPlusById(key,skuId);
                }else{
                    return;
                }
            },
            async cartItemNumPlusById(key,skuId) {
                try {
                    const res = await cartItemNumPlusById({cartItemId:skuId});
                    if (res.data.code == 0) {
                        this.shopCartList[key].num++;
                        this.computePrice();
                        this.$set(this.shopCartList, key, this.shopCartList[key]);
                    } else {
                        Toast(res.data.error);
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },
            //减少数量
            setReductPayNum(key,skuId,isVendible,status){
                if(this.shopCartList[key].num>1 && status==3 && isVendible==1){
                    this.cartItemNumSubtractById(key,skuId);
                }else{
                    return;
                }
            },
            async cartItemNumSubtractById(key,skuId) {
                try {
                    const res = await cartItemNumSubtractById({cartItemId:skuId});
                    if (res.data.code == 0) {
                        this.shopCartList[key].num--;
                        this.computePrice();
                        this.$set(this.shopCartList, key, this.shopCartList[key]);
                    } else {
                        Toast(res.data.error);
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },
            //删除
            deleteGoodsSku(skuId){
                MessageBox.confirm('确定执行此操作?').then(action => {
                    this.cartDeleteById(skuId)
                    this.checkAllGoods();
                },() => {

                });
            },

            async cartDeleteById(skuId) {
                try {
                    const res = await cartDeleteById({id:skuId});
                    if (res.data.code == 0) {
                        this.pageNo = 1;
                        this.shopCartList = [];
                        this.findPageCartItem();
                    } else {
                        Toast(res.data.error);
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },
            //全选
            checkAllGoods(){
                var thtf = this;
                this.allCheck = !this.allCheck;
                $.each(this.shopCartList,function(key,info){
                    if(info.realStockNum<=0||info.isVendible==0){
                        return;
                    }else{
                        info.check = thtf.allCheck;
                        thtf.$set(this, key, this[key]);
                    }
                })
                this.computePrice();
            },
            //计算合计金额
            computePrice(){
                var thtf = this;
                this.allPrice = 0;
                var cartNum = 0;
                $.each(this.shopCartList,function(key,info){
                    if(info.realStockNum<=0||info.status!=3){
                        return;
                    }else{
                        thtf.cartNum += info.num;
                        if(info.check == true){
                            thtf.allPrice+=info.salePrice*info.num;
                        }
                    }
                })
                this.$store.dispatch("setCartNum",cartNum);
            },

            //生成订单
            orderConfirm() {
                var arr = new Array();
                $.each(this.shopCartList,function(key,info){
                    if(info.check == true){
                        arr.push(info.cartItemId);
                    }
                })
                var obj = new Object();
                obj.cartItemIds = JSON.stringify(arr);
                obj.type = 1;
                if(arr.length == 0){
                    Toast('请选择商品~');
                }else{
                    this.$store.dispatch("setSkuObj",obj);
                    this.$router.push({path: '/shop/orderConfim'});
                }

            },
        }
    }
</script>

<style lang="scss" scoped>
 @import "../../../style/component/orderpay/shopCart.scss";
</style>