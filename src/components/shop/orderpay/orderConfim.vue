<template>
    <div class="orderConfim" v-if="showState">
        <div class="orderConfim_warpper">
            <div class="order_1">
                <div v-if="objData.receiverInfo!=null">
                    <div class="clear receiverInfo1">
                        <p>收货人：<span>{{objData.receiverInfo.receiverName}}</span></p>
                        <p>{{objData.receiverInfo.phoneNo}}</p>
                    </div>
                    <router-link to="/shop/orderSiteList">
                        <div class="clear receiverInfo2">
                            <span><i class="icon-location_light iconfont"></i>收货地址：</span>
                            <b>{{objData.receiverInfo.address}}</b>
                            <i class="icon-more iconfont"></i>
                        </div>
                    </router-link>
                </div>
                <div v-else class="receiverInfo_null">
                    <router-link to="/shop/orderSiteList">
                        <i class="icon-location_light iconfont"></i>
                        <span>请选择收货地址</span>
                        <i class="icon-more iconfont"></i>
                    </router-link>
                </div>
            </div>

            <div class="order_2">
                <ul>
                    <li class="page-loadmore-listitem clear" v-for="item in objData.goodsList">

                        <div class="goods_left">
                            <img v-lazy="item.puImg+'?imageMogr2/size-limit/100k!'">
                        </div>
                        <div class="goods_right">
                            <h4>{{item.puName}}</h4>
                            <p class="goods_price">
                                <span>{{item.price.toFixed(2)}}<b>福币</b></span>
                                <b>x{{item.num}}</b>
                            </p>

                        </div>
                    </li>
                </ul>

                <div class="cell">
                    <span class="cell_title">运费</span>
                    <b>&yen;{{objData.deliveryPrice.toFixed(2)}}</b>
                </div>

                <div v-if="!isFb || (isFb&&objData.cashPay>0)">
                    <router-link to="/shop/orderInvoice"  class="cell">
                        <span class="cell_title">发票</span>
                        <b v-if="invoiceId==0">不开发票<i class="iconfont icon-more"></i></b>
                        <b v-else-if="invoiceType==0">纸质发票-个人<i class="iconfont icon-more"></i></b>
                        <b v-else-if="invoiceType==1">纸质发票-单位<i class="iconfont icon-more"></i></b>
                    </router-link>
                </div>



                <div class="cell">
                    <span class="cell_title">买家留言</span>
                    <input type="text" class="cell_input" v-model="form.remark" placeholder="请输入对本次交易的说明">
                </div>

                <div class="allPrice">
                    共{{objData.goodsAccount}}件商品 合计:
                    <span v-if="isFb">{{objData.orderAmount.toFixed(2)}}<b>福币</b></span>
                    <span v-else>{{objData.orderAmount.toFixed(2)}}<b>元</b></span>
                </div>




            </div>

            <div class="selectPay">
                <div class="cell_title">选择支付方式</div>
                <div class="payStatus">
                    <div><b class="fbpay"></b><p v-if="objData.fubiBalance>0"><span>福币支付</span></p><p v-else style="color:#969696"><span>福币支付(无可用福币)</span></p></div>
                    <i :class="{'icon-round':!isFb,'icon-roundcheckfill':isFb}" v-if="objData.fubiBalance>0" @click="checkIsFb(0)" class="iconfont"></i>
                </div>
                <div class="payStatus">
                    <div><b class="otherpay"></b><p><span>其它支付</span><span>支持微信支付</span></p></div>
                    <i :class="{'icon-round':isFb,'icon-roundcheckfill':!isFb}"  @click="checkIsFb(1)" class="iconfont"></i>
                </div>
            </div>

            <div class="hint" v-if="isFb&&objData.cashPay>0">
                <b></b>
                <p>福币余额{{objData.fubiBalance.toFixed(2)}},抵扣后需支付{{objData.cashPay.toFixed(2)}}元</p>
            </div>
        </div>




        <div class="order_bottom">
            <p>实付款:
                <template v-if="isFb">
                    <span v-if="objData.cashPay>0">&yen;{{objData.cashPay.toFixed(2)}}<b>元</b></span>
                    <span v-else>&yen;{{objData.orderAmount.toFixed(2)}}<b>福币</b></span>
                </template>
                <template v-else>
                    <span>&yen;{{objData.orderAmount.toFixed(2)}}<b>元</b></span>
                </template>

            </p>
            <div @click="createOrder">
                提交订单
            </div>
        </div>

        <mt-popup
            v-model="popupError"
            class="mint-popup-1"
            popup-transition="popup-fade"
            closeOnClickModal>
            <div id="popup_error">
                <div class="popup_error_title">您已经提交过一次，请勿重复提交，您可以选择支付已提交订单，或者返回首页。</div>
                <div class="popup_error_btn">
                    <div class="error_btn_home error_btn"><router-link to="/home">返回首页</router-link></div>
                    <div class="error_btn_order error_btn"><router-link to="/shop/order">查看订单</router-link></div>

                </div>
            </div>
        </mt-popup>

        <mt-popup
        v-model="popupVisible"
        position="bottom" class="mint-popup-4" :closeOnClickModal="false">
            <pay-key :order-code="orderCode" v-if="popupVisible" v-on:closePopop="closePopop"></pay-key>
        </mt-popup>
    </div>
</template>

<script>
            window.addEventListener('resize', function () {
				if (document.activeElement.tagName == 'INPUT' || document.activeElement.tagName == 'TEXTAREA') {
					window.setTimeout(function () {
						document.activeElement.scrollIntoViewIfNeeded();
					}, 0);
				}
			})
    import Cookie from '../../../config/mUtils'
    import {orderConfirm,createOrder,userPayInfo,standardOrderQueryAtPayInvoke,standardPayCancle} from '../../../api/getData';
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    import payKey from './payKey';
    import { payUrl } from '../../../config/env'
    export default{

        data(){
            return{
                objData:{

                },

                showState:false,
                popupVisible1:false,
                popupVisible2:false,
                popupError:false,


                form:{
                    receiveAddressId:'',
                    remark:'',
                    taxNo:'',
                },
                isFb:true,
                invoiceId:0,
                invoiceType:'',
                popupVisible:false,
                havePpwd:'',
                orderCode:''
            }
        },
        activated () {
            this.invoiceId = this.$store.state.invoiceId;
            this.invoiceType = this.$store.state.invoiceType;
            this.userPayInfo();
            this.orderConfirm();
            this.popupError = false;
            Indicator.open();
        },
        mounted(){

        },
        watch : {
            '$store.state.invoiceId': {
                handler(curVal,oldVal){
                    this.invoiceId = this.$store.state.invoiceId;
                    this.invoiceType = this.$store.state.invoiceType;
                }
            },
            '$store.state.siteId': {
                handler(curVal,oldVal){
                    //this.orderSite();
                    this.form = {
                        receiveAddressId:'',
                        remark:'',
                        taxNo:'',
                    };
                }
            },
            "$route" : {
                handler(curVal,oldVal){
                    if((/\/shop\/goods/.test(oldVal.path)&&/\/shop\/orderConfim/.test(curVal.path))||/\/shop\/shopCart/.test(oldVal.path)){
                       // this.userPayInfo();
                       // this.orderConfirm();
                    }
                },
                deep:true
            },

        },
		components: {
            payKey
		},
        methods:{
            async orderConfirm() {
                try {
                    var obj = JSON.parse(JSON.stringify(this.$store.state.skuObj));
                    obj.addrId = this.$store.state.siteId;
                    const res = await orderConfirm(obj);
                    if (res.data.code == 0) {
                         Indicator.close();
                         this.objData = res.data.data;
                         if(res.data.data.receiverInfo!=null){
                            this.form.receiveAddressId = res.data.data.receiverInfo.id;
                         }


                        this.showState = true;
                        if(this.objData.fubiBalance<=0 || !this.havePpwd){
                            this.isFb = false;
                        }else{
                            //this.isFb = true;
                        }
                    }else{
                        Indicator.close();
                        MessageBox('提示', res.data.error).then(action => {
                            this.$router.go(-1);
                        });
                    }
                } catch (err) {
                    Indicator.close();
                    Toast('网络错误');
                }
            },

            async orderSite() {
                try {
                    var obj = JSON.parse(JSON.stringify(this.$store.state.skuObj));
                    obj.addrId = this.$store.state.siteId;
                    const res = await orderConfirm(obj);
                    if (res.data.code == 0) {

                        this.objData.receiverInfo = res.data.data.receiverInfo;
                        this.form.receiveAddressId = res.data.data.receiverInfo.id;
                    }else{
                        Indicator.close();
                        MessageBox('提示', res.data.error).then(action => {
                            this.$router.go(-1);
                        });
                        this.popupError = true;
                    }
                } catch (err) {
                    Indicator.close();
                    Toast('网络错误');
                    this.popupError = true;
                }
            },

            checkInvoice(){
                this.invoiceCheck = !this.invoiceCheck;
            },

            //选择是否使用福币
            async checkIsFb(type){
                try {
                    const res = await userPayInfo();
                    if (res.data.code == 0) {
                        this.havePpwd = res.data.data.havePpwd;
                        if(type==0 && this.objData.fubiBalance>0){
                            if(this.havePpwd){
                                this.isFb = true;
                            }else{
                                this.$router.push('/set/payPsd1');
                            }
                        }else if(type==0 && this.objData.fubiBalance<=0){
                            Toast('福币余额不足');
                        }else{
                            this.isFb = false;
                        }
                        }else  {
                            Indicator.close();
                            Toast(res.data.error);
                        }
                } catch (err) {
                        Toast('网络错误');
                        Indicator.close();
                }


            },

            //提交创建订单
            async createOrder() {
                try {
                    var obj = new Object();
                    if(this.$store.state.skuObj.type==0){
                         obj.puId = this.$store.state.skuObj.puId;
                         obj.num = this.$store.state.skuObj.num;
                    }else{
                         obj.cartItemIds = this.$store.state.skuObj.cartItemIds
                    }
                    if(this.$store.state.skuObj.phone){
                        obj.phone = this.$store.state.skuObj.phone;
                    }
                    if(this.form.receiveAddressId==""||this.form.receiveAddressId==null){
                        obj.receiveAddressId = 0;
                    }else{
                        obj.receiveAddressId = this.form.receiveAddressId;
                    }
                    obj.type = this.$store.state.skuObj.type;

                    obj.remark = this.form.remark;
                    obj.invoiceId = this.$store.state.invoiceId;
                    obj.useFubi = this.isFb ? 1 : 0;

                    const res = await createOrder(obj);
                    if (res.data.code == 0) {
                        this.standardOrderQueryAtPayInvoke(res.data.data.orderCode);
                        if(this.isFb){
                            this.orderCode = res.data.data.orderCode;
                            if(this.havePpwd){
                                this.popupVisible = true;
                            }else{
                                this.$router.push('/set/payPsd1');
                            }
                        }else{
                            this.$router.push('/shop/pay/'+res.data.data.orderCode);
                        }

                    }else if (res.data.code == 131) {
                        MessageBox('提示', '该商品已下架').then(action => {
                            this.$router.go(-1);
                        });
                    }else if (res.data.code == 133) {
                        MessageBox('提示', '库存不足').then(action => {
                            this.$router.go(-1);
                        });
                    }else if (res.data.code == 134) {
                        this.popupError = true;
                    }else {
                        Toast(res.data.error);
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },
            async standardOrderQueryAtPayInvoke(orderCode) {
                try {
                    const res = await standardOrderQueryAtPayInvoke({orderCode:orderCode});
                    if (res.data.code == 0) {

                    }else{
                        Indicator.close();
                        if(res.data.code == 180){
                            MessageBox({
                                title: '',
                                message: '订单正在处理中，是否继续等待？',
                                showCancelButton: true,
                                confirmButtonText: '取消支付',
                                cancelButtonText: '继续等待',
                            }).then(action => {
                                if(action=='cancel'){
                                    this.$router.push('/shop/orderDatails/'+this.orderCode);
                                }else{
                                    this.standardPayCancle();
                                }
                            });
                        }else if(res.data.code == 181){
                            MessageBox('', '订单已经支付成功').then(action => {
                                this.$router.push('/shop/orderDatails/'+this.orderCode);
                            });
                        }else if(res.data.code == 182){
                            MessageBox('', '订单已取消').then(action => {
                                this.$router.push('/shop/orderDatails/'+this.orderCode);
                            });
                        }else if(res.data.code == 183){
                            MessageBox('', '订单已退款').then(action => {
                                this.$router.push('/shop/orderDatails/'+this.orderCode);
                            });
                        }else if(res.data.code == 184){
                            MessageBox('', '支付超时，订单已取消').then(action => {
                                this.$router.push('/shop/orderDatails/'+this.orderCode);
                            });
                        }
                    }
                } catch (err) {
                    Toast('网络错误');
                }
            },

            //放弃支付
            async standardPayCancle() {
                try {
                    const res = await standardPayCancle({orderCode:this.orderCode});

                    if (res.data.code == 0) {
                        this.$router.push('/shop/orderDatails/'+this.$route.params.orderCode);
                    } else {
                        MessageBox('', '取消支付失败').then(action => {
                            this.$router.push('/shop/orderDatails/'+this.orderCode);
                        });
                    }

                } catch (err) {
                    Toast(err);
                }
            },
            //关闭键盘
            closePopop(){
                this.popupVisible = false;
            },
            //判断用户是否有支付密码
            async userPayInfo(){
                try {

                    const res = await userPayInfo();
                    if (res.data.code == 0) {
                        this.havePpwd = res.data.data.havePpwd;

                    }else  {
                        Indicator.close();
                        Toast(res.data.error);
                    }
                } catch (err) {
                        Toast('网络错误');
                        Indicator.close();
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
 @import "../../../style/component/orderpay/orderConfim.scss";
</style>