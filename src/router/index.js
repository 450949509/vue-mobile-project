import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login',

        },
        {
            path: '/home',
            component: resolve => require(['../components/home/page/index.vue'], resolve),
            name: '福币商城',
        },
        {
            path: '/my',
            component: resolve => require(['../components/info/page/my.vue'], resolve),
            name: '我的',
        },
        {
            path: '/login',
            component: resolve => require(['../components/home/page/login.vue'], resolve),
            name: '登录',
        },
        {
            path: '/shop',
            component: resolve => require(['../components/shop/page/home.vue'], resolve),

            children:[
                {
                    path: '/userinfo',
                    component: resolve => require(['../components/info/page/userinfo.vue'], resolve),
                    name: '个人信息',
                },
                {
                    path: '/register',
                    component: resolve => require(['../components/info/password/register.vue'], resolve),
                    name: '注册',
                },
                {
                    path: '/findPassword',
                    component: resolve => require(['../components/info/password/findPassword.vue'], resolve),
                    name: '找回密码',
                },
                {
                    path: '/buildPhoneLogin',
                    component: resolve => require(['../components/info/phone/buildPhoneLogin.vue'], resolve),
                    name: '绑定手机',
                },
                {
                    path: '/idea',
                    component: resolve => require(['../components/info/page/idea.vue'], resolve),
                    name: '意见反馈',
                },
                {
                    path: '/set',
                    component: resolve => require(['../components/info/page/set.vue'], resolve),
                    name: '设置',
                },
                {
                    path: '/set/buildPhone',
                    component: resolve => require(['../components/info/phone/buildPhone.vue'], resolve),
                    name: '绑定手机',
                },
                {
                    path: '/set/buildNewPhone',
                    component: resolve => require(['../components/info/phone/buildPhone.vue'], resolve),
                    name: '绑定新手机',
                },
                {
                    path: '/set/verifyPhone',
                    component: resolve => require(['../components/info/phone/verifyPhone.vue'], resolve),
                    name: '验证身份',
                },
                {
                    path: '/set/payPsd1',
                    component: resolve => require(['../components/info/password/payPsd.vue'], resolve),
                    name: '设置支付密码',
                },
                {
                    path: '/set/payPsd2',
                    component: resolve => require(['../components/info/password/payPsd.vue'], resolve),
                    name: '修改支付密码',
                },
                {
                    path: '/set/setPassword',
                    component: resolve => require(['../components/info/password/setPassword.vue'], resolve),
                    name: '修改登录密码',
                },
                {
                    path: '/assets/fubiAssets/:accountId',
                    component: resolve => require(['../components/info/assets/fubiAssets.vue'], resolve),
                    name: '福币',
                },
                {
                    path: '/assets/scoreAssets/:accountId',
                    component: resolve => require(['../components/info/assets/scoreAssets.vue'], resolve),
                    name: '点赞积分',
                },
                {
                    path: '/assets/moneyAssets/:accountId',
                    component: resolve => require(['../components/info/assets/moneyAssets.vue'], resolve),
                    name: '现金支出',
                },
                {
                    path: '/shop',
                    component: resolve => require(['../components/shop/index/index.vue'], resolve),
                    meta: { keepAlive: true },
                    name: '福币商城',
                },
                {
                    path: '/shop/goods/:goodsId',
                    component: resolve => require(['../components/shop/goods/index.vue'], resolve),
                    name: '商品详情',
                },
                {
                    path: '/shop/goods2/:goodsId',
                    component: resolve => require(['../components/shop/goods2/index.vue'], resolve),
                    name: '商品详情',
                },
                {
                    path: '/shop/shopCart',
                    component: resolve => require(['../components/shop/orderpay/shopCart.vue'], resolve),
                    name: '购物车',
                },
                {
                    path: '/shop/orderConfim',
                    component: resolve => require(['../components/shop/orderpay/orderConfim.vue'], resolve),
                    meta: { keepAlive: true },
                    name: '确认订单',
                },
                {
                    path: '/shop/orderInvoice',
                    component: resolve => require(['../components/shop/orderpay/orderInvoice.vue'], resolve),
                    name: '发票信息',
                },
                {
                    path: '/shop/other',
                    component: resolve => require(['../components/shop/other/other.vue'], resolve),
                    name: '我的通通狂欢节',
                },
                {
                    path: '/shop/order',
                    component: resolve => require(['../components/shop/order/orderTab.vue'], resolve),
                    name: '我的订单',
                },

                {
                    path: '/shop/site',
                    component: resolve => require(['../components/shop/other/siteList.vue'], resolve),
                    name: '地址管理',
                },
                {
                    path: '/shop/addSite',
                    component: resolve => require(['../components/shop/other/addSite.vue'], resolve),
                    name: '新增地址',
                },
                {
                    path: '/shop/editSite/:id',
                    component: resolve => require(['../components/shop/other/editSite.vue'], resolve),
                    name: '编辑地址',
                },
                {
                    path: '/shop/orderSiteList',
                    component: resolve => require(['../components/shop/orderpay/orderSiteList.vue'], resolve),
                    name: '收货地址',
                },
                {
                    path: '/shop/logistics/:id',
                    component: resolve => require(['../components/shop/order/logistics.vue'], resolve),
                    name: '物流详情',
                },
                {
                    path: '/shop/orderDatails/:id',
                    component: resolve => require(['../components/shop/order/orderDatails.vue'], resolve),
                    name: '订单详情',
                },
                {
                    path: '/shop/about',
                    component: resolve => require(['../components/shop/other/about.vue'], resolve),
                    name: '客服中心',
                },
                {
                    path: '/shop/pay/:orderCode',
                    component: resolve => require(['../components/shop/h5pay/selectPay.vue'], resolve),
                    name: '支付订单',
                },
                {
                    path: '/shop/paySuccess/:orderCode',
                    component: resolve => require(['../components/shop/orderpay/paySuccess.vue'], resolve),
                    name: '付款结果',
                },
                {
                    path: '/shop/category',
                    component: resolve => require(['../components/shop/category/index.vue'], resolve),
                    name: '商品列表',
                },
                {
                    path: '/shop/goodsList/:id/:type',
                    component: resolve => require(['../components/shop/index/goodsList.vue'], resolve),
                    name: '商品列表',
                },
                {
                    path: '/shop/goodsList1/:id/:type',
                    component: resolve => require(['../components/shop/index/goodsList1.vue'], resolve),
                    name: '商品列表',
                },
            ]
        },
        {
            path: '/memorial',
            component: resolve => require(['../components/memorial/page/home.vue'], resolve),

            children:[
                {
                    path: '/memorial',
                    component: resolve => require(['../components/memorial/index/index.vue'], resolve),
                    name: '纪念日',
                },
                {
                    path: '/memorial/birthday',
                    component: resolve => require(['../components/memorial/index/birthday.vue'], resolve),
                    name: '送祝福',
                },
            ]
        },
        {
            path: '/insurance',
            component: resolve => require(['../components/insurance/page/home.vue'], resolve),

            children:[
                {
                    path: '/insurance',
                    component: resolve => require(['../components/insurance/index/index.vue'], resolve),
                    meta: { keepAlive: true },
                    name: '保险体检',
                },
                {
                    path: '/insurance/about/:goodsId',
                    component: resolve => require(['../components/insurance/about/about.vue'], resolve),
                    meta: { keepAlive: true },
                    name: '商品详情',
                },
            ]
        },
        {
            path: '/activity',
            component: resolve => require(['../components/activity/page/home.vue'], resolve),

            children:[
                {
                    path: '/activity',
                    component: resolve => require(['../components/activity/index/index.vue'], resolve),
                    meta: { keepAlive: true },
                    name: '社团活动',
                },
                {
                    path: '/myActivity',
                    component: resolve => require(['../components/activity/index/myActivity.vue'], resolve),
                    name: '我的活动',
                },
                {
                    path: '/detailActivity/:id',
                    component: resolve => require(['../components/activity/index/activity.vue'], resolve),
                    name: '活动详情',
                },
                {
                    path: '/peopleActivity/:id',
                    component: resolve => require(['../components/activity/index/activityPeople.vue'], resolve),
                    name: '活动参与者',
                },
                {
                    path: '/joinActivity/:id',
                    component: resolve => require(['../components/activity/index/joinActivity.vue'], resolve),
                    name: '报名',
                }

            ]
        },
        {
            path: '/card',
            component: resolve => require(['../components/card/page/home.vue'], resolve),

            children:[
                {
                    path: '/card/:id',
                    component: resolve => require(['../components/card/index/index.vue'], resolve),
                    name: '电子卡券',
                },
                {
                    path: '/moreCredit/:id',
                    component: resolve => require(['../components/card/index/moreCredit.vue'], resolve),
                    name: '话费充值',
                }

            ]
        }



    ]
})
