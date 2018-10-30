<template>
    <div class="goods2" :style="'padding-top:'+elementObj.instMargin/750*10+'rem'" v-if="show">
        <div class="title">
            <h3><b></b>{{suList.titleName}}<b></b></h3>
            <span v-if="elementObj.configType==109||elementObj.configType==110" @click="goodsMore(suList.sucId)">更多<i class="iconfont icon-more"></i></span>
        </div>

        <div v-if="elementObj.configType==110||elementObj.configType==111" class="goods_banner" @click="linkSkip(suList.banner)">
            <img :src="suList.banner.imgUrl" v-if="suList.banner.imgUrl!=null" alt="">
            <img src="../../../../static/assets/img/goods_error.png" v-else alt="">
        </div>

        <div class="goodslist" v-if="suList.goodsList.length>0">
            <ul>
                <li v-for="info in suList.goodsList"  @click="goodsSkip(info)">
                    <img :src="info.suImgUrl"  v-if="info.suImgUrl!=null" />
                    <img src="../../../../static/assets/img/goods_error.png" style="border:1px solid #fff" v-else alt="">
                    <h6>{{info.suName}}</h6>
                    <p>福币价:{{info.salePrice.toFixed(2)}}</p>
                    <del>&yen;{{info.marketPrice.toFixed(2)}}</del>
                </li>
            </ul>
        </div>
    </div>

</template>

<script>
  import { Toast } from 'mint-ui';
  import {instContent} from '../../../api/getData';
  export default{
        props: {
            elementObj: {
                type: Object,
                default: function () {
                    return {}
                }
            },
        },
        data(){
            return {
                suList:{},
                show:false,
                instId:''
            }
        },
        mounted() {
            this.instContent();
        },
        methods:{
            async instContent() {
                try {
                    const res = await instContent({elementId:this.elementObj.elementId,instId:this.elementObj.instId});

                    if (res.data.code == 0) {
                        this.suList = res.data.data.inst.suList;
                        this.show = true;
                        this.instId = res.data.data.instId;
                    } else {

                    }

                } catch (err) {
                     Toast('网络错误');

                }
            },
            linkSkip(obj){
                this.$emit('linkSkip',[obj]);
            },
            goodsSkip(obj){
                this.$emit('goodsSkip',[obj]);
            },
            goodsMore(id){
                this.$emit('goodsMore',[id]);
            }
		}
    }
</script>

<style lang="scss" scoped>
    $baseWidth:750px;
    @function px($val) {
        @return $val/$baseWidth*10+rem;
    }
    .goods2{

        background:#f4f4f4;
    }
    .title{
        background:#Fff;
        width:100%;
        height:px(88px);
        position:relative;
        display: flex;
        justify-content:center;
        align-items:center;
        h3{
            width:100%;
            text-align:center;
            font-size:px(28px);
            font-weight:100;
            color:#323232;
            display: inline-flex;
            justify-content:center;
            align-items:center;
            b{
                margin:0 px(40px);
                border-top:px(4px) solid #ff8546;
                width:px(60px);
            }
        }
        span{
            position:absolute;
            right:px(24px);
            top:px(0px);
            line-height:px(88px);
            font-size:px(28px);
            font-weight:100;
            color:#b3b3b3;
            i{
                font-size:px(28px);
                font-weight:100;
                color:#b3b3b3;
            }
        }

    }

    .goodslist{
        padding:0 px(10px);
        background:#f4f4f4;
        ul{
            display: flex;
            display: -webkit-flex; /* Safari */
            flex-wrap:wrap;
            li{
                background:#fff;
                width:px(226px);
                margin:0 px(8px);
                padding-bottom:px(20px);
                margin-top:px(20px);
                img{
                    width:px(226px);
                    height:px(226px);

                }
                h6{

                    font-size:px(28px);
                    color:#323232;
                    margin-left:px(16px);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    line-height:px(52px);
                }
                p{
                    margin-left:px(16px);
                    font-size:px(24px);
                    color:#ff8546;
                    text-overflow:ellipsis;
                    line-height:px(36px);
                }
                del{
                    margin-left:px(16px);
                    font-size:px(20px);
                    color:#969696;
                    display:block;
                }
            }
        }
    }

    .goods_banner{
        width:100%;
        height:px(280px);
        img{
            width:100%;
            height:100%;
        }
    }
</style>