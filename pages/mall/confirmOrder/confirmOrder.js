import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();



Page({
  data: {

    mainData:[],
    addressData:[],
    userInfoData:[],
    idData:[],
    orderData:[],
    couponData:[],
    couponId:[],
    searchItem:{
      isdefault:1
    },
    submitData:{
      passage1:''
    },
    searchItemTwo:{
      thirdapp_id:getApp().globalData.mall_thirdapp_id,
      user_no:wx.getStorageSync('mall_info').user_no
    },
    buttonClicked:true,
    order_id:'',
    complete_api:[],
    buyType:'delivery',
    isFirstLoadAllStandard:['getMainData','getAddressData'],
    pay:{}

  },

  onLoad(options) {

    const self = this;
    api.commonInit(self);
    if(options.order_id){
      self.data.order_id = options.order_id;
    }else{
      api.showToast('数据传递有误','error');
    };
    self.setData({
      fonts:app.globalData.font,
      img:app.globalData.img,
      web_buyType:self.data.buyType
    });
    getApp().globalData.address_id = '';
    self.getMainData();

  },

 

  onShow(){

    const self = this;
    self.data.searchItem = {};
    if(getApp().globalData.address_id){
      self.data.searchItem.id = getApp().globalData.address_id;
    }else{
      self.data.searchItem.isdefault = 1;
    };
    for (var i = 0; i < self.data.mainData.length; i++) {
      self.data.idData.push(self.data.mainData[i].id)
    };
    console.log(self.data.idData)
    self.getAddressData();

  },

  onUnload(){
    const self = this;
    wx.removeStorageSync('payPro');
  },


  getMainData(isNew){

    const self = this;
    if(isNew){
      api.clearPageIndex(self);
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.tokenFuncName = 'getMallToken';
    postData.searchItem = {
      id:self.data.order_id
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });     
      self.countPrice();
    };
    api.orderGet(postData,callback);

  },  

  getCouponData(isNew){

    const self = this;
    if(isNew){
      api.clearPageIndex(self);
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.tokenFuncName = 'getMallToken';
    postData.searchItem = api.cloneForm(self.data.searchItemTwo)
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.couponData.push.apply(self.data.couponData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      }
      self.setData({
        web_couponData:self.data.couponData,
      });  
      self.countPrice();
    };
    api.orderGet(postData,callback);

  },






  getAddressData(){
    const self = this;
    const postData = {}
    postData.tokenFuncName = 'getMallToken';
    postData.searchItem = {isdefault:1};
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.addressData = res.info.data[0]; 
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getAddressData',self);
      self.setData({
        web_addressData:self.data.addressData,
      });
    };
    api.addressGet(postData,callback);
  },




  pay(order_id){

    const self = this;
    const postData = self.data.pay;
    postData.tokenFuncName = 'getMallToken';
    postData.searchItem = {
      id:self.data.order_id
    };

    const callback = (res)=>{

      if(res.solely_code==100000){
        if(res.info){
          const payCallback=(payData)=>{
            if(payData==1){
              const cc_callback=()=>{
                api.pathTo('/pages/mall/order/order','redi');
              };
              api.showToast('支付成功','none',1000,cc_callback);
            };   
          };
          api.realPay(res.info,payCallback); 
        }else{
          api.showToast('支付成功','none',1000,function(){
            api.pathTo('/pages/mall/order/order','redi');
          }); 
        };
      }else{
        api.showToast(res.msg,'none');
      };
      api.buttonCanClick(self,true);

    };
    api.pay(postData,callback);

  },

  checkLoadComplete(){

    const self = this;
    var complete = api.checkArrayEqual(self.data.complete_api,['getMainData','getOrderData']);
    if(complete){
      wx.hideLoading();
      self.data.buttonClicked = false;
    };

  },

  chooseBuyWay(e){

    const self = this;
    console.log(e)
    var buyType = api.getDataSet(e,'buytype');
    self.data.buyType = buyType;
    console.log(self.data.buyType)
    self.setData({
      web_buyType:self.data.buyType
    });

  },

  checkboxChange(e) {
    const self = this;
    self.data.id = e.detail.value;
    console.log(self.data.id);
    self.data.searchItemTwo.id=6;
    self.getCouponData()
  },



  
  countPrice(){

    const self = this;
    var totalPrice = 0;
    var couponPrice = 0;
    var productsArray = self.data.mainData.products;
    self.data.price = self.data.mainData.price;
    self.data.pay.wxPay = self.data.price;

    self.setData({
      web_couponPrice:couponPrice.toFixed(2),
      web_price:self.data.price,
      web_pay:self.data.pay
    });

  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },


  changeBind(e){
    const self = this;
    api.fillChange(e,self,'submitData');
    console.log(self.data.submitData);
    self.setData({
      web_submitData:self.data.submitData,
    });  
  },


  submit(e){

    const self = this;
    api.buttonCanClick(self);
    if(self.data.buyType=='delivery'&&!self.data.addressData){
      api.showToast('请选择收货地址','error');
      api.buttonCanClick(self,true);
      return;
    };
    self.pay();
  },


})
