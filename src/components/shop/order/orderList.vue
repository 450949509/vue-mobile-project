<template>
    <div id="order_list">
        <ul
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="loading"
            infinite-scroll-distance="10">
            <li v-for="order in orderData">
                    <router-link :to="'/shop/orderDatails/'+order.orderCode">
                        <div class="order_head">
                            <p>订单编号：{{order.orderCode}}</p>
                            <span v-if="order.orderStatus==0">待付款</span>
                            <span v-else-if="order.orderStatus==1">已付款</span>
                            <span v-else-if="order.orderStatus==2">已发货</span>
                            <span v-else-if="order.orderStatus==4">已完成</span>
                            <span v-else-if="order.orderStatus==10">已取消</span>
                        </div>

                        <div class="order_goods clear" v-for="goods in order.goodsList">
                            <div class="goods_left">
                                <img v-lazy="goods.puImg+'?imageMogr2/size-limit/100k!'">
                            </div>
                            <div class="goods_right">
                                <div class="title">
                                    <h4>{{goods.puName}}</h4><b>×{{goods.num}}</b>
                                </div>
                                <div class="goods_price">
                                    <p>
                                        <span>&yen;{{goods.price.toFixed(2)}}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </router-link>
                    <div class="allGoods">
                        <b>共{{order.goodsAccount}}件商品</b>
                        <span>合计:&yen{{order.orderAmount.toFixed(2)}}</span>
                    </div>

                    <div class="orderBtn">
                        <div v-if="order.operateStatus == 0">
                            <mt-button size="small" plain @click.native="unfreezeSoFubi(order.orderCode)" class="parm_btn">取消订单</mt-button>
                            <mt-button size="small" plain type="danger" @click.native="createOrder(order.orderCode,0)" class="danger_btn">其它支付</mt-button>
                            <mt-button size="small" plain type="danger" @click.native="createOrder(order.orderCode,1)" class="danger_btn">福币支付</mt-button>
                        </div>

                        <div v-if="order.operateStatus == 1">
                            <mt-button size="small" plain @click.native="unfreezeSoFubi(order.orderCode)" class="parm_btn">取消订单</mt-button>
                        </div>

                        <div v-if="order.operateStatus == 2">
                            <mt-button size="small" plain v-if="!order.unitExist" @click.native="logistics(order.orderCode)" class="parm_btn">查看物流</mt-button>
                            <mt-button size="small" plain type="danger" @click.native="affirmOrderBySoId(order.orderCode)" class="parm_btn">确认收货</mt-button>
                        </div>

                        <div v-if="order.operateStatus == 3">
                            <mt-button size="small" plain v-if="!order.unitExist" @click.native="logistics(order.orderCode)" class="parm_btn">查看物流</mt-button>
                            <mt-button size="small" plain @click.native="deleteBySoId(order.orderCode)" class="parm_btn">删除订单</mt-button>
                        </div>

                        <div v-if="order.operateStatus == 4">
                            <mt-button size="small" plain @click.native="deleteBySoId(order.orderCode)" class="parm_btn">删除订单</mt-button>
                        </div>
                    </div>

            </li>
        </ul>
    </div>

</template>

<script>
    import {unfreezeSoFubi,deleteBySoId,affirmOrderBySoId,findAwaitQueueByOrderCode,standardOrderQueryAtPayInvoke,standardPayCancle} from '../../../api/getData';
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    import { payUrl } from '../../../config/env'
    export default{
        props:{
            orderData: {
                type: Array,
                default: function () {
                    return []
                }
            },
            loading: {
                type: Boolean,
                default: function () {
                    return ''
                }
            },
            navCheck: {
                type: Number,
                default: function () {
                    return ''
                }
            },
        },
        data(){
            return {
                orderCode:''
            }
        },
        watch:{

        },
        created(){

        },
        methods:{
            loadMore(){
                this.$emit('findOrderByUserAndStatus');
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
                            this.$emit('navClick',this.navCheck);
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
                        this.$emit('navClick',this.navCheck);
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
                        this.$emit('navClick',this.navCheck);
                    } else {
                        Toast(res.data.data);
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },

            //去支付
            async createOrder(orderCode,type) {
                try {
                    this.orderCode = orderCode;
                    const res = await standardOrderQueryAtPayInvoke({orderCode:orderCode});
                    if (res.data.code == 0) {
                        if(type == 0){
                            this.$router.push("/shop/pay/"+orderCode)
                        }else if(type == 1){
                            if(res.data.data.fubiBalance>0){
                                this.orderCode = orderCode;
                                this.$emit('openPopop');
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
                        this.$router.push('/shop/orderDatails/'+this.orderCode);
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
@import "../../../style/component/order/orderList.scss";
</style>