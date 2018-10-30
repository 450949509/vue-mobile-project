<template>
    <div id="category" class="page-loadmore-wrapper">
        <div id="category_tabbar">
            <ul>
                <li v-for="info in categoryList" :class="{active:info.categoryTreeNodeId==checkId}" @click="checkCategory(info)">
                    <span>{{info.categoryName}}</span>
                </li>
            </ul>
        </div>
        <div id="main">
            <div class="main_top">
                <img @click="bannerClick" :src="bannerUrl" />
            </div>

            <div class="main_bottom" ref="main_bottom" :style="'height:'+wrapperHeight+'px'">
                <goods-list ref="goodsList" v-if="seriesType==1" :category-id="checkId"></goods-list>

                <category ref="goodsList" v-else :category-id="checkId" :category-title="categoryTitle"></category>
            </div>
        </div>
    </div>
</template>

<script>
    import goodsList from './goodsList';
    import category from './category';
    import { MessageBox } from 'mint-ui';
    import { Toast } from 'mint-ui';
    import { Indicator } from 'mint-ui';
    import {findCategoryByType,findSeedCategoryTreeNodeAll} from '../../../api/getData';
    export default{

        data(){
            return {
                categoryList:[],
                checkId:0,
                categoryObj:{},
                bannerUrl:'',
                seriesType:1,
                wrapperHeight:0,
                categoryTitle:'',
                linkObj:{}
            }
        },
		components: {
            'goodsList':goodsList,
            'category':category
        },
        watch:{
        },
        created(){
            this.findCategoryByType();
        },
        mounted(){
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.main_bottom.getBoundingClientRect().top;
        },
        methods:{
            async findCategoryByType() {
                try {
                    const res = await findCategoryByType();

                    if (res.data.code == 0) {
                        this.categoryList = res.data.data.categoryList;
                        this.checkId = this.categoryList[0].categoryTreeNodeId;
                        this.seriesType = res.data.data.seriesType;
                        this.checkCategory(this.categoryList[0]);

                        if(this.seriesType==1){
                            this.$store.dispatch("setCardTitle","商品列表");
                        }else if(this.seriesType==2){
                            this.$store.dispatch("setCardTitle","商品分类");
                        }
                    } else {
                        Toast(res.data.data);
                    }

                } catch (err) {
                    Toast('网络错误');
                }
            },
            checkCategory(obj){
                this.linkObj = obj;
                this.checkId = obj.categoryTreeNodeId;
                this.bannerUrl = obj.bannerUrl;
                this.categoryTitle = obj.categoryName;
                if(this.seriesType == 1){
                    //this.$refs.goodsList.findByCategoryTreeNodeIdOrSUC();
                }else{
                   // this.findSeedCategoryTreeNodeAll();
                }
            },
            bannerClick(){
                console.log(this.linkObj.link_type)
                if(this.linkObj.link_type == 3){
                    MessageBox('', '微信端无法打开该页面，请在福管加App内打开！').then(action => {

                    });
                }else if(this.linkObj.link_type == 1){
                    if(this.linkObj.link_id == 5){
                        this.$router.push('/shop/category');
                    }
                }else if(this.linkObj.link_type == 2){
                    window.location.href = this.linkObj.link_url;
                }else if(this.linkObj.link_type == 4){
                    this.$router.push('/shop/goodsList/'+this.linkObj.link_id+'/2');
                }else if(this.linkObj.link_type == 5){
                    this.$router.push('/shop/goods/'+this.linkObj.link_id);
                }
            }

		}
    }
</script>

<style lang="scss">
@import "../../../style/component/category/category.scss";
</style>