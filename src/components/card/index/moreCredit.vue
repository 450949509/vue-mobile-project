<template>
    <div class="index page-loadmore-wrapper">
        <div class="card_input">
            <div class="card_input_box">
                <input type="number" placeholder="请输入手机号码" oninput="if(value.length>11)value=value.slice(0,11)" v-model="checkInfo.phoneNumber" />
            </div>
        </div>
        <div class="card_list">
            <h3>请选择购买的商品</h3>
            <ul>
                <li v-for="info in puAttNames" @click="checkCard(info)" :class="{'active' : checkInfo.productUnitId==info.productUnitId,'no_check' : info.realStockNum <= 0||info.status == 4}">
                    <h5>{{info.attValue}}</h5>
                    <p>售价：{{info.salePrice}}福币</p>
                </li>
            </ul>
        </div>

       <!-- <div class="card_num">
            <h3>选择数量</h3>
            <div>
                <span @click="setReductPayNum" :class="{disabled : payNum <= 1}"><i class="iconfont icon-jianhao"></i></span>
                <b>{{payNum}}</b>
                <span @click="setAddPayNum" :class="{disabled : checkInfo.productUnitId == ''}"><i class="iconfont icon-jiahao1"></i></span>
            </div>
        </div> -->

        <div class="card_bottom">
            <div class="pay_btn" @click="buy" :class="{disabled : this.goodsData.status != 3}">立即购买</div>
            <div class="prompt">
                <h5>温馨提示</h5>
                <p>月末月初为充值高峰，话费到账可能会延迟或失败。</p>
            </div>
        </div>

    </div>
</template>

<script>

    var myScroll=null;
    import { Indicator } from 'mint-ui';
    import { Toast } from 'mint-ui';
    import { findMerchantProdetails ,skuByMerchantProductId} from '../../../api/getData';
    export default{

        data(){
            return {
                payNum:1,
                goodsData:{},
                puList:{},
                puAttNames:[],
                checkInfo:{
                    realStockNum:1,
                    productUnitId:'',
                    phoneNumber:''
                }
            }
        },

		components: {

		},
        created() {
            this.findMerchantProdetails();
            this.skuByMerchantProductId();
        },
        methods:{
            //获取商品详情
            async findMerchantProdetails() {
                try {
                    Indicator.open();
                    const res = await findMerchantProdetails({standardUnitId:this.$route.params.id});
                    if (res.data.code == 0) {
                        Indicator.close();
                        this.goodsData = res.data.data;
                        this.$store.dispatch("setCardTitle",res.data.data.standardUnitName);
                    } else {
                        Indicator.close();
                        Toast(res.data.error);
                    }
                } catch (err) {
                     Toast('网络错误');
                     this.cartType = false;
                     Indicator.close();
                }
            },
            //获取商品SKU
            async skuByMerchantProductId() {
                try {
                    const res = await skuByMerchantProductId({standardUnitId:this.$route.params.id});

                    if (res.data.code == 0) {
                        this.puList = res.data.data.pu;
                        this.puAttNames = res.data.data.puAttNames[0].attValue;
                        var thtf = this;
                        $.each(this.puAttNames,function(key,info){
                            info.isVendible = thtf.puList[info.attValueId].isVendible;
                            info.productUnitId = thtf.puList[info.attValueId].productUnitId;
                            info.realStockNum = thtf.puList[info.attValueId].realStockNum;
                            info.salePrice = thtf.puList[info.attValueId].salePrice;
                        })
                    } else {
                        Toast(res.data.data);
                    }

                } catch (err) {
                     Toast('网络错误');

                }
            },
            //增减数量
            setAddPayNum(){

                if(this.payNum<this.checkInfo.realStockNum){
                    this.payNum++;
                }else{
                    return;
                }
            },
            setReductPayNum(){

                if(this.payNum>1){
                    this.payNum--;
                }else{
                    return;
                }
            },

            checkCard(obj){
                if(obj.realStockNum > 0 && obj.status == 3){
                    this.checkInfo.productUnitId = obj.productUnitId;
                }else{
                    return;
                }
            },

            //立即购买
            buy(){
                if(this.goodsData.status == 3){
                    if(this.checkInfo.productUnitId==""){
                        Toast('请选择面值');
                    }else if(!/(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/.test(this.checkInfo.phoneNumber)){
                        Toast('请输入正确的手机号码');
                    }else{
                        var obj = new Object;
                        obj.puId = this.checkInfo.productUnitId;
                        obj.num = this.payNum;
                        obj.phone = this.checkInfo.phoneNumber;
                        obj.type = 0;
                        this.$store.dispatch("setSkuObj",obj);
                        this.$router.push({path: '/shop/orderConfim'});
                    }
                }else{
                   return;
               }
            }

		}
    }
</script>

<style lang="scss" scoped>
@import "../../../style/card/card.scss";
</style>