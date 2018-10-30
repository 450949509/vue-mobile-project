<template>
    <div id="invoice">
        <div class="invoice_1">
            <h3>发票类型</h3>
            <ul>
                <li :class="{active:invoiceForm.invoiceForm<0}" @click="invoiceForm.invoiceForm=-1">不开发票</li>
                <li :class="{active:invoiceForm.invoiceForm>=0}" @click="invoiceForm.invoiceForm=0">普通发票</li>
            </ul>
        </div>

        <div class="invoice_2" v-if="invoiceForm.invoiceForm>=0">
            <h3>发票信息</h3>
            <ul>
                <li @click="invoiceForm.invoiceTitleType=0">
                    <i :class="{'icon-round':invoiceForm.invoiceTitleType!=0,'icon-roundcheckfill':invoiceForm.invoiceTitleType==0}" class="iconfont"></i>
                    <span>个人</span>
                </li>
                <li @click="invoiceForm.invoiceTitleType=1">
                    <i :class="{'icon-round':invoiceForm.invoiceTitleType==0,'icon-roundcheckfill':invoiceForm.invoiceTitleType!=0}" class="iconfont"></i>
                    <span>单位</span>
                </li>
            </ul>
        </div>

        <div class="invoice_3" v-if="invoiceForm.invoiceForm>=0">
            <span class="cell_title">发票抬头</span>
            <input type="text" class="cell_input" v-if="invoiceForm.invoiceTitleType==0" v-model="invoiceForm.title" placeholder="请输入“个人”或姓名">
            <input type="text" class="cell_input" v-if="invoiceForm.invoiceTitleType!=0" v-model="invoiceForm.title" placeholder="请输入单位名称">
            <b v-if="invoiceForm.invoiceTitleType!=0" @click="popupOpen"></b>
        </div>

        <div class="invoice_3 tpid" v-if="invoiceForm.invoiceTitleType==1&&invoiceForm.invoiceForm>=0">
            <span class="cell_title">纳税人识别号</span>
            <input type="text" class="cell_input" v-model="invoiceForm.tpid" placeholder="请输入纳税人识别号">
        </div>

        <div class="invoice_4"  v-if="invoiceForm.invoiceForm>=0">
            <div>
                <h3>发票内容<span>发票内容选项已根据税法调整，具体请以展示为准</span></h3>

            </div>

            <ul class="clear">
                <li :class="{active:invoiceForm.contentType==0}" @click="invoiceForm.contentType=0">商品明细</li>
                <li :class="{active:invoiceForm.contentType==1}" @click="invoiceForm.contentType=1">商品分类</li>
            </ul>

            <p>发票内容将显示详细商品名称与价格信息</p>
        </div>

        <mt-popup
        v-model="popupVisible"
        position="bottom" class="mint-popup-4">
            <i class="popup_close icon-close iconfont" @click="popupVisible=false"></i>
            <div id="propertyTable">
                <h4>发票类型</h4>
                <ul>
                    <li v-for="item in invoiceList" @click="invoiceCheck = item" :class="{active:invoiceCheck.tpid==item.tpid}">
                        {{item.title}}
                    </li>
                </ul>
                <div class="close_btn" :class="{close_btn_disabled:invoiceCheck.tpid==''}" @click="closePopupVisible">
                    确 定
                </div>
            </div>
        </mt-popup>

        <div class="btn" @click="updataInvoice">确 定</div>
    </div>
</template>

<script>

    import { invoiceHint,saveInvoice,invoiceById } from '../../../api/getData';
    import { Toast } from 'mint-ui';
    import { MessageBox } from 'mint-ui';
    export default{

        data(){
            return {
                invoiceForm:{
                    invoiceForm:-1,
                    invoiceTitleType:0,
                    title:'',
                    tpid:'',
                    contentType:0
                },
                popupVisible:false,
                invoiceList:[],
                invoiceCheck:{
                    title:'',
                    tpid:''
                }
            }
        },
		components: {

        },
        watch:{

        },
        created(){
            this.invoiceHint();
            if(this.$store.state.invoiceId != 0){
                this.invoiceById();
            }
        },
        methods:{
            //获取发票提示
            async invoiceHint() {
                try {
                    const res = await invoiceHint();
                    if (res.data.code == 0) {
                        this.invoiceList = res.data.data.hints;

                    } else {


                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },
            //根据发票ID查询详情
            async invoiceById() {
                try {
                    const res = await invoiceById({id:this.$store.state.invoiceId});
                    if (res.data.code == 0) {
                        this.invoiceForm = {
                            invoiceForm:res.data.data.invoice.invoiceForm,
                            invoiceTitleType:res.data.data.invoice.invoiceTitleType,
                            title:res.data.data.invoice.invoiceTitleContent,
                            tpid:res.data.data.invoice.tpic,
                            contentType:res.data.data.invoice.invoiceContentType
                        };

                    } else {


                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },
            //保存发票
            updataInvoice(){
                if(this.invoiceForm.invoiceForm<0){
                    this.$store.dispatch("setInvoiceId",0);
                    this.$router.push({path: '/shop/orderConfim'});
                }else{
                    this.saveInvoice();
                }
            },
            async saveInvoice() {
                try {
                    const res = await saveInvoice(this.invoiceForm);
                    if (res.data.code == 0) {
                        this.$store.dispatch("setInvoiceId",res.data.data.invoiceId);
                        this.$store.dispatch("setInvoiceType",this.invoiceForm.invoiceTitleType);
                        this.$router.push({path: '/shop/orderConfim'});
                    } else {
                        Toast({
                            message: res.data.error,
                            position: 'middle',
                            duration: 3000
                        });
                    }
                } catch (err) {
                     Toast('网络错误');
                }
            },

            //打开发票提示
            popupOpen(){
                this.popupVisible = true;
                this.invoiceCheck = {
                    title:'',
                    tpid:''
                }
            },

            closePopupVisible(){
                if(this.invoiceCheck.tpid==''){
                    return;
                }else{
                    this.invoiceForm.title = this.invoiceCheck.title;
                    this.invoiceForm.tpid = this.invoiceCheck.tpid;
                    this.popupVisible = false;
                }

            }
        }
    }
</script>

<style lang="scss" scoped>
@import "../../../style/component/orderpay/orderInvoice.scss";
</style>