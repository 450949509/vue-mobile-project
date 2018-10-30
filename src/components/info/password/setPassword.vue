<template>
    <div class="main">
        <div class="form">
            <div class="cell">
                <span class="mail"></span>
                <p  class="cell_input">{{mail}}</p>
            </div>

            <div id="yzm">
                <div class="cell">
                    <span class="yzm"></span>
                    <input type="number" class="cell_input" placeholder="请输入验证码" v-model="code">
                </div>

                <div class="yzm_btn" @click="sendIdentifyingCode" v-if="yzmShow">
                    <span>获取验证码</span>
                </div>
                <div class="yzm_btn disabled" v-else>
                    <span>{{count}}秒</span>
                </div>
            </div>

            <div class="cell">
                <span class="psd"></span>
                <input type="password" class="cell_input" placeholder="请输入新密码" v-model="password">
            </div>

            <div class="cell">
                <span class="psd"></span>
                <input type="password" class="cell_input" placeholder="请再次输入密码" v-model="confirmPassword">
            </div>

            <div class="tip">
                *密码长度不少于6位，至少包含字母、数字两种类型
            </div>
        </div>

        <div class="btn" :class="{disabled:mail==''||code==''||password==''||confirmPassword==''}" @click="findUserPassword">
            提交
        </div>
    </div>
</template>

<script>
    import CryptoJS from 'crypto-js/core';
    import MD5 from 'crypto-js/md5';
    import {findUserPassword,gainVerificationode,userByUserId} from '../../../api/getData';
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    export default{

        data(){
            return{
                yzmShow:true,
                count:60,
                timer: null,
                mail:'',
                code:'',
                password:'',
                confirmPassword:''
            }
        },
        created () {
            this.userByUserId();
        },
        mounted(){

        },
        watch : {

        },
		components: {

		},
        methods:{
            sendIdentifyingCode(){
                if (!this.timer && /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(this.mail)) {
                    this.count = 60;
                    this.yzmShow = false;
                    this.gainVerificationode();
                }else{
                    Toast('邮箱格式错误');
                }
            },
            async userByUserId() {
                try {
                    const res = await userByUserId();

                    if (res.data.code == 0) {
                        this.mail = res.data.data.mail;
                    } else {
                        Toast(res.data.data);
                    }

                } catch (err) {
                    Toast(err);
                }
            },
            async gainVerificationode(){
                try {
                    const res = await gainVerificationode({mail:this.mail,type:0});

                    if (res.data.code == 0) {
                        Toast(res.data.data);
                        this.timer = setInterval(() => {
                        if (this.count > 0 && this.count <= 60) {
                                this.count--;
                            } else {
                                this.yzmShow = true;
                            clearInterval(this.timer);
                                this.timer = null;
                            }
                        }, 1000)
                    } else {
                        this.yzmShow = true;
                        Toast(res.data.error);
                    }

                } catch (err) {
                    Toast(err);
                }
            },
            async findUserPassword(){
                try {
                    if(this.mail==''||this.code==''||this.password==''||this.confirmPassword==''){
                        return;
                    }
                    let password = CryptoJS.MD5(this.password).toString();
                    let confirmPassword = CryptoJS.MD5(this.confirmPassword).toString();
                    const res = await findUserPassword({mail:this.mail,verificationCode:this.code,password:password,confirmPassword:confirmPassword});
                    if (res.data.code == 0) {
                        Toast('修改登录密码成功');
                        this.$router.go(-1);
                    } else {
                        Toast(res.data.error);
                    }

                } catch (err) {
                    Toast(err);
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
@import "../../../style/info/buildPhone.scss";
</style>