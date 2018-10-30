<template>
    <div class="login" :style="'height:'+wrapperHeight+'px'">
        <div class="form" v-if="loginType==1">
            <div class="cell">
                <span class="mail"></span>
                <input type="text" class="cell_input" placeholder="请输入邮箱" v-model="mailFrom.mail">
            </div>

            <div id="psd">
                <div class="cell">
                    <span class="psd"></span>
                    <input type="password" class="cell_input" placeholder="请输入登录密码" v-model="mailFrom.psd">
                </div>

                <div class="psd_btn" @click="checkLogin(1)">
                    <router-link to="/findPassword"><span>忘记密码？</span></router-link>
                </div>
            </div>



            <div id="yzm_img" v-if="yzmNum>=5">
                <div class="cell">
                    <span class="safety"></span>
                    <input type="number" class="cell_input" placeholder="请输入验证码" v-model="num">
                </div>

                <div class="yzm_img" @click="createYzm">
                    <ul>
                        <li :style="'background-image:url(./static/assets/img/login/'+yzm.one+'.png)'">
                        </li>
                        <li>
                            <img src="../../../../static/assets/img/login/jia.png" v-if="yzm.symbol==0" />
                            <img src="../../../../static/assets/img/login/chen.png" v-else-if="yzm.symbol==1" />
                        </li>
                        <li :style="'background-image:url(./static/assets/img/login/'+yzm.two+'.png)'">
                        </li>
                        <li>
                            <img src="../../../../static/assets/img/login/dy.png" />
                        </li>
                    </ul>
                </div>
            </div>

            <div class="login_btn" :class="{disabled:mailFrom.mail==''||mailFrom.psd==''}" @click="mainLogin">登录</div>
        </div>
        <div class="form" v-else-if="loginType==2">
            <div class="cell">
                <span class="head"></span>
                <input type="number" class="cell_input" placeholder="请输入手机号码"  maxlength="11" v-model="phoneForm.mobile">
            </div>

            <div id="yzm">
                <div class="cell">
                    <span class="yzm"></span>
                    <input type="number" class="cell_input" placeholder="请输入验证码" v-model="phoneForm.code">
                </div>

                <div class="yzm_btn" @click="sendIdentifyingCode" v-if="yzmShow">
                    <span>获取验证码</span>
                </div>
                <div class="yzm_btn disabled" v-else>
                    <span>{{count}}秒</span>
                </div>
            </div>

            <div class="login_btn" :class="{disabled:phoneForm.mobile==''||phoneForm.code==''}"  @click="codeLogin">登录</div>
        </div>

        <div class="login_bottom">
            <div class="phone_login" v-if="loginType==1" @click="checkLogin(2)">
                手机验证码登录
            </div>
            <div class="phone_login" v-else-if="loginType==2" @click="checkLogin(1)">
                邮箱登录
            </div>
            <div class="register" @click="register">
                新用户注册
            </div>
        </div>

    </div>
</template>

<script>
  import CryptoJS from 'crypto-js/core';
  import MD5 from 'crypto-js/md5';
  import { Toast } from 'mint-ui';
  import { MessageBox } from 'mint-ui';
  import { Indicator } from 'mint-ui';
  import {mobileLogin,sendIdentifyingCode,userByUserId,weiXinLogin,userMobileLogin,weiXinLoginByWeiXinOpenId} from '../../../api/getData';
  export default{
        data(){
            return {
                wrapperHeight:0,
                mailFrom:{
                    mail:'',
                    psd:'',
                },
                phoneForm:{
                    mobile:'',
                    code:''
                },
                loginType:1,
                yzmShow:true,
                count:60,
                timer: null,
                openId:'',
                yzm:{
                    one:0,
                    two:0,
                    symbol:0
                },
                num:'',
                yzmNum:0,

            }
        },
        created() {
            this.yzmNum = this.$store.state.Cookie.mutations.getCookie('num');
            if(this.$store.state.Cookie.mutations.fetch('openId').length==0){
                this.weiXinLogin();
                Indicator.open();
            }else{
                this.weiXinLoginByWeiXinOpenId();
                Indicator.open();
            }
            this.createYzm();
            this.wrapperHeight = document.documentElement.clientHeight;
        },
        watch:{
            "$route": {
                handler(curVal,oldVal){
                    this.mailFrom={
                        mail:'',
                        psd:'',
                    };
                    this.phoneForm={
                        mobile:'',
                        code:''
                    };
                    this.loginType=1;
                },
                deep:true
            },
        },
        methods:{
            register(){
                this.$router.push('/register');
            },
            //生成验证码
            createYzm(){
                this.num = '';
                this.yzm.one = parseInt(10*Math.random());
                this.yzm.two = parseInt(10*Math.random());
                this.yzm.symbol = parseInt(2*Math.random());
            },
            //根据微信openid登录接口
            async weiXinLoginByWeiXinOpenId() {
                try {
                    const res = await weiXinLoginByWeiXinOpenId({weiXinOpenId:this.$store.state.Cookie.mutations.fetch('openId')});

                    if (res.data.code == 0) {
                        let thtf = this;
                        this.$store.state.Cookie.mutations.save(res.data.data,'userInfo');
                        window.setTimeout(function(){
                            Indicator.close();
                            thtf.$router.push('/home');
                        },1000);
                    }else{
                        Indicator.close();
                    }

                } catch (err) {
                     Indicator.close();
                     Toast('网络错误');

                }
            },

            async weiXinLogin() {
                try {
                    let se = window.location.search.substr(1);
                    let arr = se.split("&");
                    let obj = {};
                    let newarr = [];
                    $.each(arr, function(i, v){
                        newarr = v.split("=");
                        if(typeof obj[newarr[0]] === "undefined"){
                            obj[newarr[0]] = newarr[1];
                        }
                    });
                    const res = await weiXinLogin({weiXinCode:obj.code});

                    Indicator.close();
                    if (res.data.code == 0) {
                        this.$store.state.Cookie.mutations.save(res.data.data.openId,'openId');
                        this.$store.state.Cookie.mutations.save(res.data.data,'userInfo');
                        this.$router.push('/home');
                    } else if(res.data.code == 185){
                        this.$store.state.Cookie.mutations.save(res.data.data.openId,'openId');
                        return;
                    } else{
                        Toast(res.data.error);
                    }

                } catch (err) {
                     Indicator.close();
                     Toast('网络错误');

                }
            },
            sendIdentifyingCode(){
                if (!this.timer && /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/.test(this.phoneForm.mobile)) {
                    this.count = 60;
                    this.yzmShow = false;
                    this.sendIdentifyingCodeAjax();
                }else{
                    Toast('手机号码格式错误');
                }
            },
            async sendIdentifyingCodeAjax(){
                try {
                    const res = await sendIdentifyingCode({mobile:this.phoneForm.mobile,type:1});

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
                    this.yzmShow = true;
                    Toast(err);
                }
            },
            //切换登录模式
            checkLogin(type){
                this.loginType = type;
                this.mailFrom = {
                    mail:'',
                    psd:'',
                };
                this.phoneForm={
                    mobile:'',
                    code:''
                };
            },
            //邮箱登录
            mainLogin(){
                if(this.yzmNum>=5){

                    let num;
                    if(this.yzm.symbol==0){
                        num = this.yzm.one + this.yzm.two;
                    }else{
                        num = this.yzm.one * this.yzm.two;
                    }
                    if(this.num != num){
                        Toast('请输入正确的验证码');
                        this.createYzm();
                        return;
                    }
                }
                var reg = /^(?!([a-zA-Z]+|\d+)$)[a-zA-Z\d]{6,20}$/;
                if(this.mailFrom.mail==''||this.mailFrom.psd==''){
                    return;
                }else if(!/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(this.mailFrom.mail)){
                    Toast('邮箱格式错误');
                    return;
                }else if(this.mailFrom.psd.match(reg)==null){
                    Toast('密码长度不少于6位，至少包含字母、数字两种类型');
                    return;
                }else{
                    let obj = new Object;
                    obj.name = this.mailFrom.mail;
                    obj.password = CryptoJS.MD5(this.mailFrom.psd).toString();
                    obj.platformId = 7;
                    Indicator.open();
                    this.mobileLogin(obj);
                }
            },
            async mobileLogin(obj) {
                try {
                    const res = await mobileLogin(obj);

                    if (res.data.code == 0) {

                        Indicator.close();
                        this.$store.state.Cookie.mutations.save(res.data.data,'userInfo');
                        this.userByUserId();
                    } else {
                        if(res.data.code == 104){
                            this.$store.state.Cookie.mutations.setCookie('num',++this.yzmNum,1);
                        }
                        Indicator.close();
                        Toast(res.data.error);
                    }

                } catch (err) {

                     Indicator.close();
                     Toast('网络错误');

                }
            },
            //验证码登录
            codeLogin(){
                if(this.phoneForm.mobile==''||this.phoneForm.code==''){
                    return;
                }else if(!/(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/.test(this.phoneForm.mobile)){
                    Toast('手机号码格式错误');
                    return;
                }else{
                    Indicator.open();
                    let obj = new Object;
                    obj.mobile = this.phoneForm.mobile;
                    obj.identityCode = this.phoneForm.code;
                    obj.platformId = 7;
                    this.userMobileLogin(obj);
                }
            },
            async userMobileLogin(obj) {
                try {
                    const res = await userMobileLogin(obj);

                    if (res.data.code == 0) {

                        Indicator.close();
                        this.$store.state.Cookie.mutations.save(res.data.data,'userInfo');
                        this.userByUserId();
                    } else {

                        Indicator.close();
                        Toast(res.data.error);
                    }

                } catch (err) {

                     Indicator.close();
                     Toast('网络错误');

                }
            },

            async userByUserId() {
                try {
                    const res = await userByUserId({weiXinOpenId:this.$store.state.Cookie.mutations.fetch('openId')});

                    if (res.data.code == 0) {
                        if(res.data.data.mobile==null){
                            this.$router.push('/buildPhoneLogin');
                        }else{
                            this.$router.push('/home');
                        }
                    } else {
                        Toast(res.data.error);
                    }

                } catch (err) {
                     Toast('网络错误');

                }
            }
		}
    }
</script>

<style lang="scss" scoped>
   @import "../../../style/home/login.scss";
</style>