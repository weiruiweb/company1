import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
    tabCurrent:0,
    isChoose:0,
    isFirstLoadAllStandard:['getMainData','getStoreData'],
    storeArray: [],
    array1: ['60分钟', '90分钟', '120分钟', '150分钟'],
    index: 0,
    index1:0,
    count:1,
    multiArray: [],
    mainData:[]
  },
  
  onLoad(options) {
    const self = this;
    api.commonInit(self);
    self.data.id = options.id;
    self.setData({
      web_count:self.data.count,
      img:app.globalData.hair,
    });
    self.getMainData();
  },

  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.hair_thirdapp_id,
      id:self.data.id
    };
    postData.getAfter = {
      sku:{
        tableName:'sku',
        middleKey:'product_no',
        key:'product_no',
        searchItem:{
          status:1
        },
        condition:'='
      }
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
        self.data.choosed_skuData = api.cloneForm(self.data.mainData[0].sku[0]);
        self.data.choosed_skuData.count = 1
      }else{
        api.showToast('没有更多了','none');
      }
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      console.log(self.data.mainData)
      self.setData({
        web_choosedSkuId:self.data.choosed_skuData.id,
        web_mainData:self.data.mainData
      });  
      self.getStoreData();
      self.countTotalPrice()
    };
    api.productGet(postData,callback);
  },

  getStoreData(){
    const self = this;
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      thirdapp_id:getApp().globalData.hair_thirdapp_id
    };
    postData.getBefore = {
      store:{
        tableName:'label',
        middleKey:'menu_id',
        key:'id',
        searchItem:{
          title:['=',['门店']]
        },
        condition:'in'
      }
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        for (var i = 0; i < res.info.data.length; i++) {
          self.data.storeArray.push(res.info.data[i].title+':'+res.info.data[i].description)
        }
      }
      console.log(self.data.storeArray)
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getStoreData',self);
      self.setData({
        web_storeArray:self.data.storeArray,
      });  
    };
    api.articleGet(postData,callback);
  },

   counter(e){

    const self = this;

    if(JSON.stringify(self.data.choosed_skuData)!='{}'){
      if(api.getDataSet(e,'type')=='+'){
        self.data.count++;
      }else if(self.data.choosed_skuData.count > '1'){
        self.data.count--;
      }
      self.data.choosed_skuData.count = self.data.count;
    }else{
      self.data.count = 1;
    };
    self.countTotalPrice();

  },

  //计算总价
  countTotalPrice(){  
    const self = this;
    var totalPrice = 0;
    if(JSON.stringify(self.data.choosed_skuData)!='{}'){
      totalPrice += self.data.count*parseFloat(self.data.choosed_skuData.price);
      self.data.totalPrice = totalPrice.toFixed(2);
    };
    self.data.totalPrice = totalPrice;
    self.setData({
      web_count:self.data.count,
      web_totalPrice:self.data.totalPrice
    });
  },

  bindManual(e) {
    const self = this;
    var count = e.detail.value;
    self.setData({
      web_count:count
    });
  },

 
  addOrder(){

    const self = this;
    api.buttonCanClick(self);
   
    const c_postData = {
      tokenFuncName:'getHairToken',
      sku:[
        {
          id:self.data.choosed_skuData.id,
          count:self.data.count
        }
      ],
      type:1
    };
    const c_callback = (res)=>{
      if(res&&res.solely_code==100000){
        api.pay(res.info.id)        
      }else{
        api.showToast(res.msg,'none');
      };
    };
    api.addOrder(c_postData,c_callback);
  },

  pay(order_id){

    const self = this;
    const postData = {
      pay:{
        wxPay:{
          price:self.data.totalPrice
        }
      },
      tokenFuncName:'getHairToken',
      searchItem:{
        id:order_id
      }
    };
    const callback = (res)=>{
      if(res.solely_code==100000){
        if(res.info){
          const payCallback=(payData)=>{
            if(payData==1){
            
              api.showToast('预约成功','none');
            };   
          };
          api.realPay(res.info,payCallback); 
        }else{
          api.showToast('支付成功','none'); 
        };
      }else{
        api.showToast(res.msg,'none');
      };
      api.buttonCanClick(self,true);

    };
    api.pay(postData,callback);

  },


  chooseSku(e){
    const self = this
    var id = api.getDataSet(e,'id');
    var index = api.getDataSet(e,'index');
    self.data.choosedSkuId = id;
    self.data.choosed_skuData = self.data.mainData[0].sku[index];
    self.data.count = 1;
    self.setData({
      web_count:self.data.count,
      web_choosedSkuId:self.data.choosedSkuId
    })
    self.countTotalPrice()
  },

  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  bindPickerChange1: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index1: e.detail.value
    })
  },

})
