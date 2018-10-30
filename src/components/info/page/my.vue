<template>
    <div id="my">
        <div class="head">
            <div class="btn">
                <b class="set" @click="setUserInfo"></b>
                <b class="msg"></b>
            </div>

            <div class="info">
                <div class="head_img">
                    <img v-if="userInfo.headPicUrl!=null" :src="userInfo.headPicUrl" />
                    <img v-else src="../../../../static/assets/img/my/head_error.png" />
                </div>

                <div class="user_info">
                    <p class="username" @click="userinfoClick">
                        <span>{{userInfo.name}}</span><b></b>
                    </p>
                    <p class="companyname">{{userInfo.companyName}}</p>
                </div>
            </div>
        </div>

        <div class="asset" v-if="balanceShow">
            <div class="cell cell_border">
                <span class="cell_title"><b></b>资产</span>
            </div>
            <div class="asste_tab">
                <ul>
                    <li>
                        <router-link :to="'/assets/fubiAssets/'+userAsset.fb.accountId">
                            <h6>{{userAsset.fb.balance.toFixed(2)}}</h6>
                            <p>福币余额</p>
                        </router-link>
                    </li>

                    <li>
                        <router-link :to="'/assets/scoreAssets/'+userAsset.pp.accountId">
                            <h6>{{userAsset.pp.balance.toFixed(2)}}</h6>
                            <p>点赞积分</p>
                        </router-link>
                    </li>

                    <li>
                        <router-link :to="'/assets/moneyAssets/'+userAsset.cp.accountId">
                            <h6>{{userAsset.cp.balance.toFixed(2)}}</h6>
                            <p>现金支出</p>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>

        <div class="cell_list">
            <div class="order cell_border">
                <router-link to="/shop/order"  class="cell">
                    <span class="cell_title"><b></b>我的订单</span>
                    <i class="iconfont icon-more"></i>
                </router-link>
            </div>
        <!--    <div class="ticket">
                <router-link to="/shop/orderInvoice"  class="cell">
                    <span class="cell_title"><b></b>我的优惠券</span>
                    <i class="iconfont icon-more"></i>
                </router-link>
            </div> -->
            <div class="site cell_border">
                <router-link to="/shop/site"  class="cell">
                    <span class="cell_title"><b></b>地址管理</span>
                    <i class="iconfont icon-more"></i>
                </router-link>
            </div>
            <div class="idea cell_border">
                <router-link to="/idea"  class="cell">
                    <span class="cell_title"><b></b>意见反馈</span>
                    <i class="iconfont icon-more"></i>
                </router-link>
            </div>
            <div class="service cell_border">
                <div class="cell" @click="service">
                    <span class="cell_title"><b></b>客服中心</span>
                    <i class="iconfont icon-more"></i>
                </div>
            </div>
        </div>


        <tabbar></tabbar>
    </div>


</template>

<script>
    import tabbar from '../../home/page/tabbar';
    import { MessageBox } from 'mint-ui';
    import {userByUserId,userAssets} from '../../../api/getData';
    export default{

        data(){
            return {
                userInfo:{},
                userAsset:{},
                balanceShow:false
            }
        },
		components: {
            'tabbar':tabbar
        },
        created(){
            this.userByUserId();
            this.userAssets();
        },
        methods:{
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

            userinfoClick(){
                this.$router.push('/userinfo');
            },

            async userAssets() {
                try {
                    const res = await userAssets();

                    if (res.data.code == 0) {
                        this.userAsset = res.data.data;
                        this.balanceShow = true;
                    } else {
                        Toast(res.data.data);
                    }

                } catch (err) {
                    Toast(err);
                }
            },

            service(){
                MessageBox('客服电话', '400-1111-360').then(action => {

                });
            },

            setUserInfo(){
                this.$router.push('/set');
            }
		}
    }
</script>

<style lang="scss" scoped>
$baseWidth:750px;
@function px($val) {
    @return $val/$baseWidth*10+rem;
}
#my{
    background-color:#f4f4f4;
}
.head{
    width:100%;
    padding-top:px(22px);
    height:px(298px);
    background-image:url(../../../../static/assets/img/my/bg.png);
    .btn{
        height:px(88px);
        padding:0 px(24px);
        margin-bottom:px(30px);
        display: -webkit-flex; /* Safari */
        display: flex;
        justify-content: flex-end;
        align-items:center;
        b{

            width:px(48px);
            height:px(48px);
            background-size:100%;
        }
        .set{
            background-image:url(../../../../static/assets/img/my/set.png);
        }
        .msg{
            display:none;
            background-image:url(../../../../static/assets/img/my/msg.png);
        }
    }
}

.info{
    padding:0 px(24px);
    display: -webkit-flex; /* Safari */
    display: flex;
    img{
        width:px(120px);
        height:px(120px);
        border-radius:50%;

    }
    .user_info{
        margin-left:px(22px);
        margin-top:px(10px);
        p{
            color:#fff;
            span{
                margin-right:px(34px);
            }
            b{
                display:inline-block;
                width:px(32px);
                height:px(32px);
                background-image:url(../../../../static/assets/img/my/edit.png);
                background-size:100%;
            }
        }
        .username{
            font-size:px(32px);
            line-height:px(48px);
        }
        .companyname{
            font-size:px(28px);
            line-height:px(48px);
        }
    }
}

.cell_list{
    margin-top:px(20px);
}

.cell_border{
    border-bottom:1px solid #dcdcdc;
}
.cell{
    background-color:#fff;
    height: px(88px);
    padding:0 px(24px);
    display: -ms-flexbox;
    display: flex;
    justify-content:space-between;
    align-items:center;
    span{
        display: inline-flex;
        align-items:center;
        font-size:px(28px);
        color:#323232;
    }
    b{
        width:px(36px);
        height:px(36px);
        background-size:100%;
        margin-right:px(10px);
    }
    i{
        margin-left:px(10px);
        color:#d4d4d4;;
    }
}

.asset{
    background-color:#fff;
    b{
        background-image:url(../../../../static/assets/img/my/asset.png);
    }
    ul{

        padding:px(16px) 0;
        display: -ms-flexbox;
        display: flex;
        justify-content:space-between;
        align-items:center;
        height:px(88px);
        li{
            flex:auto;
            height:100%;
            text-align:center;
            border-right:1px solid #dcdcdc;
            h6{
                font-size:px(28px);
                color:#ff8546;
                line-height:px(44px);
            }
            p{
                font-size:px(28px);
                color:#323232;
                line-height:px(44px);
            }
        }
        li:nth-child(3){
            border:none;
        }
    }
}
.order{
    b{
        background-image:url(../../../../static/assets/img/my/order.png);
    }
}
.idea{
    b{
        background-image:url(../../../../static/assets/img/my/idea.png);
    }
}
.service{
    b{
        background-image:url(../../../../static/assets/img/my/service.png);
    }
}
.site{
    b{
        background-image:url(../../../../static/assets/img/my/site.png);
    }
}
.ticket{
    b{
        background-image:url(../../../../static/assets/img/my/ticket.png);
    }
}
</style>