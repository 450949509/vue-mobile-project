<template>
    <div class="goodsList">
        <ul class="nav">
            <li :class="{active:goodsObj.orderByType == 1}" @click="checkSale">
                <span>销量</span>
            </li>
            <li class="price" :class="{active:goodsObj.orderByType == 2}" @click="checkPrice">
                <span>价格</span>
                <b class="price_top" v-if="goodsObj.sortRegulation==1"></b>
                <b class="price_bottom" v-else-if="goodsObj.sortRegulation==2"></b>
                <b class="price" v-else></b>
            </li>
            <li class="list" :class="{active:goodsObj.orderByType == 2}" @click="checkList">
                <b class="list_check" v-if="listType"></b>
                <b class="list_check_out" v-else-if="!listType"></b>
            </li>
            <li class="screen" @click="checkScreen">
                <span>筛选</span><b></b>

            </li>
        </ul>

        <div class="goods" ref="goods_list" :style="'height:'+listHeight+'px;'" v-if="goodsType || goodsList.length > 0">
            <ul
            class="list1"
            v-if="listType"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="goodsloading"
            infinite-scroll-distance="10">
                <li v-for="goods in goodsList" class="page-loadmore-listitem clear">

                    <div class="goods_box" @click="goodsSkip(goods.standardUnitId,goods.commodityTemplateId)">
                        <div class="goods_left">
                            <img v-lazy="goods.pictureUrl+'?imageMogr2/size-limit/500k!'">
                        </div>
                        <div class="goods_right">
                            <h6>{{goods.name}}</h6>
                            <p>福币价:{{goods.salePrice.toFixed(2)}}</p>
                            <del>&yen;{{goods.marketPrice.toFixed(2)}}</del>

                        </div>
                    </div>
                </li>
            </ul>

            <ul
            class="list2"
            v-else
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="goodsloading"
            infinite-scroll-distance="10">
                <li v-for="goods in goodsList" class="page-loadmore-listitem clear">

                    <div class="goods_box" @click="goodsSkip(goods.standardUnitId,goods.commodityTemplateId)">
                        <img v-lazy="goods.pictureUrl+'?imageMogr2/size-limit/500k!'">
                        <h6>{{goods.name}}</h6>
                        <p>福币价:{{goods.salePrice.toFixed(2)}}</p>
                        <del>&yen;{{goods.marketPrice.toFixed(2)}}</del>
                    </div>
                </li>
            </ul>
        </div>

        <div class="error" v-else>
            <img src="../../../../static/assets/img/goodsList_error.png" alt="">
            <p>暂时没有商品</p>
        </div>

        <mt-popup
        v-model="popupVisible"
        pop-transition="popup-fade">
            <div class="pop"  @click="checkFubipay" :class="{active:goodsObj.fubiPay == 1}">
                <i :class="{'icon-round':this.goodsObj.fubiPay==0,'icon-roundcheckfill':this.goodsObj.fubiPay==1}" class="iconfont"></i>
                <span>低于福币余额</span>
            </div>
        </mt-popup>
    </div>
</template>

<script>
    import { MessageBox } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    import { Toast } from 'mint-ui';
    import { findByCategoryTreeNodeIdOrSUC } from '../../../api/getData';
    export default{
        props: {
            categoryId:{
                type:Number,
                default: function () {
                    return ''
                }
            }
        },
        data(){
            return {
                goodsObj:{
                    categoryTreeNodeId:'',
                    fubiPay:0,
                    orderByType:0,
                    sortRegulation:0,
                    type:1,
                    pageNo:1,
                    pageSize:10
                },
                goodsList:[],
                goodsloading:false,
                listType:true,
                popupVisible:false,
                listHeight:0,
                goodsType:true
            }
        },
        watch:{
            'categoryId':{
                handler(curVal,oldVal){
                    if(curVal==0){
                        return;
                    }
                    this.goodsList = [];
                    this.goodsObj = {
                        categoryTreeNodeId:'',
                        fubiPay:0,
                        orderByType:0,
                        sortRegulation:0,
                        type:1,
                        pageNo:1,
                        pageSize:10
                    };
                    this.findByCategoryTreeNodeIdOrSUC();
                }
            }
        },
        mounted() {
            this.listHeight = document.documentElement.clientHeight - this.$refs.goods_list.getBoundingClientRect().top;
            //this.findByCategoryTreeNodeIdOrSUC();
        },
        methods:{
            loadMore(){
                if(this.categoryId==0){
                    return;
                }
                this.findByCategoryTreeNodeIdOrSUC();
                Indicator.open();
            },
            async findByCategoryTreeNodeIdOrSUC() {
                try {
                    const obj = new Object();
                    this.goodsObj.categoryTreeNodeId = this.categoryId;
                    $.each(this.goodsObj, function (key, info) {
                        if (info !== "") {
                            obj[key] = info;
                        }
                    })
                    const res = await findByCategoryTreeNodeIdOrSUC(obj);
                    if (res.data.code == 0) {
                        this.goodsType = true;
                        Indicator.close();
                        if(res.data.data.list.length == 0){
                            this.goodsType = false;
                            this.goodsloading = true;
                            this.goodsList = this.goodsList.concat(res.data.data.list);
                        }else{
                            this.goodsObj.pageNo++;
                            this.goodsList = this.goodsList.concat(res.data.data.list);
                        }
                    } else {
                        this.goodsType = false;
                        Indicator.close();
                    }
                } catch (err) {
                    Toast('网络错误');
                }
            },

            //销量排序
            checkSale(){
                this.goodsList = [];
                this.goodsObj.pageNo = 1;
                this.goodsObj.orderByType = this.goodsObj.orderByType==1 ? 0:1;
                this.findByCategoryTreeNodeIdOrSUC();
            },
            goodsSkip(id,type){
                if(type==1){
                    this.$router.push('/card/'+id);
                }else if(type==2){
                    this.$router.push('/shop/goods/'+id);
                }else if(type==3){
                    this.$router.push('/shop/goods2/'+id);
                }

            },
            //价格排序
            checkPrice(){
                this.goodsList = [];
                this.goodsObj.pageNo = 1;
                this.goodsObj.orderByType = this.goodsObj.orderByType==2&&this.goodsObj.sortRegulation==2 ? 0:2;
                if(this.goodsObj.sortRegulation==0){
                    this.goodsObj.sortRegulation=1
                }else if(this.goodsObj.sortRegulation==1){
                    this.goodsObj.sortRegulation=2
                }else if(this.goodsObj.sortRegulation==2){
                    this.goodsObj.sortRegulation=0
                }
                this.findByCategoryTreeNodeIdOrSUC();
            },
            //切换显示方式
            checkList(){
                this.listType = !this.listType;
            },
            checkScreen(){
                this.popupVisible = true;
            },
            checkFubipay(){
                this.goodsList = [];
                this.goodsObj.pageNo = 1;
                this.goodsObj.fubiPay = this.goodsObj.fubiPay==1 ? 0:1;
                this.popupVisible = false;
                this.findByCategoryTreeNodeIdOrSUC();
            }

		}
    }
</script>

<style lang="scss" scoped>
@import "../../../style/component/category/goodsList.scss";
</style>