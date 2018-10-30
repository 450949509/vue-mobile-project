import Vue from 'vue';
import Vuex from 'vuex';
import Cookie from './localtion';


Vue.use(Vuex);

let store = new Vuex.Store({
	state : {
        skuObj:{},
        selected:'',
        cartNum:'',
        Cookie,
        siteId:0,
        invoiceId:0,
        invoiceType:'',
        cardTitle:'',
        goodsType:1,
        shopCartNum:0,
        checkActivity:[],
        checkMemorial:[]
    },
	mutations: {
        setSkuObj (state,obj) {
            state.skuObj = obj;
        },
        setSelected (state,str) {
            state.selected = str;
        },
        setCartNum (state,num) {
            state.cartNum = num;
        },
        setSiteId (state,num) {
            state.siteId = num;
        },
        setInvoiceId (state,num) {
            state.invoiceId = num;
        },
        setInvoiceType (state,num) {
            state.invoiceType = num;
        },
        setCardTitle (state,num) {
            state.cardTitle = num;
        },
        setGoodsType (state,num) {
            state.goodsType = num;
        },
        setShopCartNum (state,num) {
            state.shopCartNum = num;
        },
        setCheckActivity (state,num) {
            state.checkActivity = num;
        },
        setCheckMemorial (state,num) {
            state.checkMemorial = num;
        },

    },
	actions: {
        setSkuObj (context,obj) {
           context.commit('setSkuObj',obj)
        },
        setSelected (context,str) {
            context.commit('setSelected',str)
        },
        setCartNum (context,num) {
            context.commit('setCartNum',num)
        },
        setSiteId (context,num) {
            context.commit('setSiteId',num)
        },
        setInvoiceId (context,num) {
            context.commit('setInvoiceId',num)
        },
        setInvoiceType (context,num) {
            context.commit('setInvoiceType',num)
        },
        setCardTitle (context,num) {
            context.commit('setCardTitle',num)
        },
        setGoodsType (context,num) {
            context.commit('setGoodsType',num)
        },
        setShopCartNum (context,num) {
            context.commit('setShopCartNum',num)
        },
        setCheckActivity (context,num) {
            context.commit('setCheckActivity',num)
        },
        setCheckMemorial (context,num) {
            context.commit('setCheckMemorial',num)
        },
    }


})

export default store
