<template>
    <div class="orderDatails">
        <div class="orderConfim_warpper page-loadmore-wrapper" v-if="showState">
            <div class="order_1">
                <div>
                    <div class="clear receiverInfo1">
                        <p>收货人：<span>{{objData.addressInfo.receiverName}}</span></p>
                        <p>{{objData.addressInfo.phoneNo}}</p>
                    </div>

                    <div class="clear receiverInfo2">
                        <i class="icon-location_light iconfont"></i>
                        <span>收货地址：</span><b>{{objData.addressInfo.address}}</b>
                    </div>

                </div>

            </div>

            <div class="order_2">
                <div class="order_status">
                    {{objData.orderInfo.statusStr}}
                </div>
                <div class="order_goods clear" v-for="goods in objData.goodsList">
                    <div class="goods_left">
                        <img v-lazy="goods.puImg+'?imageMogr2/size-limit/100k!'">
                    </div>
                    <div class="goods_right">
                        <div class="title">
                            <h4>{{goods.puName}}</h4>
                        </div>
                        <div class="goods_price">
                            <p>
                                <span>{{goods.price}}福币</span>
                                <b>×{{goods.num}}</b>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="order_unit" v-if="objData.orderInfo.unitExist">
                    <h4>卡密码信息</h4>
                    <ul>
                        <li v-for="info in objData.cardList">
                            <p>卡号：{{info.cardNumber}}</p>
                            <p>卡密：{{info.cardThick}}</p>
                        </li>
                    </ul>
                </div>
                <div class="order_code">
                    <p>订单编号：{{objData.orderInfo.orderCode}}</p>
                    <p>下单时间：{{objData.orderInfo.createTime}}</p>
                </div>
                <div class="order_code" v-if="objData.invoiceInfo != null">
                    <p>发票类型：普通发票</p>
                    <p>发票抬头：{{objData.invoiceInfo.invoiceBaseInfo.title}}</p>
                    <p>发票内容：
                        <span v-if="objData.invoiceInfo.invoiceBaseInfo.invoiceContentType==0">商品明细</span>
                        <span v-else-if="objData.invoiceInfo.invoiceBaseInfo.invoiceContentType==1">商品类别</span>
                    </p>
                </div>
                <div class="order_code">
                    <p>是否福币支付：{{objData.orderInfo.useFubi?'是':'否'}}</p>
                    <p>现金支付方式：{{objData.orderInfo.payCashMethodStr}}</p>
                    <p>商品合计：&yen;{{objData.orderInfo.goodsAmount}}</p>
                    <p>运费：&yen;{{objData.orderInfo.deliveryFee}}</p>
                </div>
                <div class="order_price">
                    <p v-if="objData.orderInfo.status!=0">福币实付：&yen;{{objData.orderInfo.paidByFubi}}</p>
                    <p v-if="objData.orderInfo.status!=0">现金实付：&yen;{{objData.orderInfo.paidByCash}}</p>
                    <h4>实付合计：<span>&yen;{{objData.orderInfo.orderAmount}}</span></h4>
                </div>
                <div class="orderBtn">
                    <div v-if="objData.orderInfo.operateStatus == 0">
                        <mt-button size="small" plain @click.native="unfreezeSoFubi(objData.orderInfo.orderCode)" class="parm_btn">取消订单</mt-button>
                        <mt-button size="small" plain type="danger" @click.native="createOrder(objData.orderInfo.orderCode,0)" class="danger_btn">其它支付</mt-button>
                        <mt-button size="small" plain type="danger" @click.native="createOrder(objData.orderInfo.orderCode,1)" class="danger_btn">福币支付</mt-button>
                    </div>

                    <div v-if="objData.orderInfo.operateStatus == 1">
                            <mt-button size="small" plain @click.native="unfreezeSoFubi(objData.orderInfo.orderCode)" class="parm_btn">取消订单</mt-button>
                        </div>

                    <div v-if="objData.orderInfo.operateStatus == 2">
                        <mt-button size="small" plain v-if="!objData.orderInfo.unitExist" @click.native="logistics(objData.orderInfo.orderCode)" class="parm_btn">查看物流</mt-button>
                        <mt-button size="small" plain type="danger" @click.native="affirmOrderBySoId(objData.orderInfo.orderCode)" class="danger_btn">确认收货</mt-button>
                    </div>

                    <div v-if="objData.orderInfo.operateStatus == 3">
                        <mt-button size="small" plain v-if="!objData.orderInfo.unitExist" @click.native="logistics(objData.orderInfo.orderCode)" class="parm_btn">查看物流</mt-button>
                        <mt-button size="small" plain @click.native="deleteBySoId(objData.orderInfo.orderCode)" class="parm_btn">删除订单</mt-button>
                    </div>

                    <div v-if="objData.orderInfo.operateStatus == 4">
                        <mt-button size="small" plain @click.native="deleteBySoId(objData.orderInfo.orderCode)" class="parm_btn">删除订单</mt-button>
                    </div>

                </div>
            </div>


        </div>
        <mt-popup
        v-model="popupVisible"
        position="bottom" class="mint-popup-4" :closeOnClickModal="false" id="mint-popup-4">
            <pay-key :order-code="orderCode" v-if="popupVisible" v-on:closePopop="closePopop"></pay-key>
        </mt-popup>
    </div>
</template>

<script>
    import {orderDetail,unfreezeSoFubi,deleteBySoId,affirmOrderBySoId,findAwaitQueueByOrderCode,standardPayCancle,standardOrderQueryAtPayInvoke} from '../../../api/getData';
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    import { payUrl } from '../../../config/env'
    import payKey from '../orderpay/payKey';
    export default{

        data(){
            return{
                objData:{

                },
                popupVisible:false,
                orderCode:'',
                showState:false,
            }
        },
        created () {
           this.orderDetail();
        },
        watch : {

        },
		components: {
            payKey
		},
        methods:{
            async orderDetail() {
                try {
                    const res = await orderDetail({orderCode:this.$route.params.id});
                    if (res.data.code == 0) {
                        this.orderCode = this.$route.params.id;
                        this.objData = res.data.data;
                        this.showState = true;
                    }else {
                        Toast(res.data.error);
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },
            //取消订单
            unfreezeSoFubi(id){
                MessageBox.confirm('确定要取消订单吗?').then(action => {
                    this.cacelOrderAjax(id)
                },() => {

                });
            },
            async cacelOrderAjax(id) {
                try {
                    const res = await unfreezeSoFubi({orderCode:id});
                    if (res.data.code == 0) {
                        MessageBox.alert('已支付福币与现金将原路返还到您的账户，现金预计3个工作日内到账，请您注意查收。','').then(action => {
                            this.orderDetail();
                        });

                    } else {
                        Toast(res.data.data);
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },

            //删除订单
            deleteBySoId(id){
                MessageBox.confirm('确定要删除订单吗?').then(action => {
                    this.deleteBySoIdAjax(id)
                },() => {

                });
            },
            async deleteBySoIdAjax(id) {
                try {
                    const res = await deleteBySoId({orderCode:id});
                    if (res.data.code == 0) {
                        Toast("删除订单成功");
                        this.$router.push('/shop/order');
                    } else {
                        Toast(res.data.data);
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },
              //确认收货
            affirmOrderBySoId(id){
                MessageBox.confirm('确定执行此操作?').then(action => {
                    this.affirmOrderBySoIdAjax(id)
                },() => {

                });
            },
            async affirmOrderBySoIdAjax(id) {
                try {
                    const res = await affirmOrderBySoId({orderCode:id});
                    if (res.data.code == 0) {
                        Toast("确认收货成功");
                        this.orderDetail();
                    } else {
                        Toast(res.data.data);
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },
            //关闭键盘
            closePopop(){
                this.popupVisible = false;
            },
            //去支付
            async createOrder(orderCode,type) {
                try {
                    const res = await standardOrderQueryAtPayInvoke({orderCode:orderCode});
                    if (res.data.code == 0) {
                        if(type == 0){
                            this.$router.push("/shop/pay/"+orderCode)
                        }else if(type == 1){
                            if(res.data.data.fubiBalance>0){
                                this.orderCode = orderCode;
                                this.popupVisible = true;
                            }else{
                                Toast('无可用福币，请选择其他支付方式');
                            }
                        }

                    }else if(res.data.code == 180){
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
                    } else {
                        Toast(res.data.data);
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

            //查看物流
            logistics(id) {
                this.$router.push("/shop/logistics/"+id)
            },
        }
    }
</script>

<style lang="scss" scoped>
 @import "../../../style/component/order/orderDatails.scss";
</style>