<template>
    <div id="set">


        <div class="cell_list">
            <div>
                <router-link to="/set/setPassword"  class="cell">
                    <span class="cell_title">修改登录密码</span>
                    <i class="iconfont icon-more"></i>
                </router-link>
            </div>

            <div>
                <router-link to="/set/verifyPhone" class="cell" v-if="userInfo.mobile!=null">
                    <span class="cell_title">修改手机号码</span>
                    <b>{{userInfo.mobile}}<i class="iconfont icon-more"></i></b>
                </router-link>

                <router-link to="/set/buildPhone" class="cell" v-else>
                    <span class="cell_title">绑定手机号码</span>
                    <b><i class="iconfont icon-more"></i></b>
                </router-link>
            </div>


            <div>
                <router-link to="/set/payPsd1"  class="cell" v-if="userInfo.isPaymentCode==0">
                    <span class="cell_title">启用支付密码</span>
                    <i class="iconfont icon-more"></i>
                </router-link>
                <router-link to="/set/payPsd2"  class="cell" v-else>
                    <span class="cell_title">修改支付密码</span>
                    <i class="iconfont icon-more"></i>
                </router-link>
            </div>
        </div>
        <div class="cell" id="cancel" @click="cancel">
            <span>退出登录</span>
        </div>

    </div>


</template>

<script>
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    import {userByUserId,weixinLogOut} from '../../../api/getData';
    export default{

        data(){
            return {
                userInfo:{},
            }
        },
		components: {

        },
        created(){
            this.userByUserId();
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
            cancel(){
                MessageBox({
                    title: '提示',
                    message: '确定退出当前账号？',
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(action => {
                    if(action=='confirm'){
                        this.weixinLogOut();
                    }else{

                    }
                });
            },
            async weixinLogOut() {
                try {
                    const res = await weixinLogOut();

                    if (res.data.code == 0) {
                        this.$store.state.Cookie.mutations.delete('userInfo');
                        this.$router.push('/');
                    } else {
                        Toast(res.data.data);
                    }

                } catch (err) {
                    Toast(err);
                }
            },



		}
    }
</script>

<style lang="scss" scoped>
$baseWidth:750px;
@function px($val) {
    @return $val/$baseWidth*10+rem;
}
#set{
    background:#f4f4f4;
    height:100%;
}
.cell{
    background-color:#fff;
    height: px(88px);
    padding:0 px(24px);
    display: -ms-flexbox;
    display: flex;
    justify-content:space-between;
    align-items:center;
    border-bottom:1px solid #dcdcdc;
    span{
        display: inline-flex;
        align-items:center;
        font-size:px(28px);
        color:#323232;
    }
    b{
        font-size:px(28px);
        color:#323232;
    }

    i{
        margin-left:px(10px);
        color:#d4d4d4;;
    }
}
#cancel{
    text-align:center;
    margin-top:px(35px);
    border-bottom:none;
    span{
        display:block;
        width:100%;
        text-align:center;
        color:#ff8546;
    }
}
</style>