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
    sForm:{
      score:0,
      balance:0 
    },
     
    searchItemTwo:{
      thirdapp_id:getApp().globalData.mall_thirdapp_id,
      user_no:wx.getStorageSync('mall_info').user_no,
      type:['in',[3,4]]
    },
    order_id:'',
    order_array:[],
    buyType:'delivery',
    isFirstLoadAllStandard:['getMainData','getAddressData','getUserData'],
    pay:{
      coupon:[]
    }

  },

  onLoad(options) {

    const self = this;
    api.commonInit(self);
    if(options.order_id){
      self.data.order_id = options.order_id;
      self.data.order_array = options.order_id.split(',');
    }else{
      api.showToast('数据传递有误','error');
    };
    self.setData({
      web_buyType:self.data.buyType
    });
    getApp().globalData.address_id = '';
    self.getMainData();
    self.getUserData();
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
    self.getCouponData(true)

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
      id:['in',self.data.order_array]
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data;
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });     
      self.countPrice();
    };
    api.orderGet(postData,callback);

  }, 

  getUserData(){
    const self = this;
    const postData = {};
    postData.tokenFuncName = 'getMallToken';
    const callback = (res)=>{
      if(res.solely_code==100000){
        if(res.info.data.length>0){
          self.data.userData = res.info.data[0]; 
        }
        self.setData({
          web_userData:self.data.userData,
        });  
      }else{
        api.showToast('网络故障','none')
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getUserData',self);
    };
    api.userInfoGet(postData,callback);   
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

  useCoupon(e){

    const self = this;
    var id = api.getDataSet(e,'id');
    var count = api.getDataSet(e,'count');
    var findItem = api.findItemInArray(self.data.pay.coupon,'id',id);
    if(findItem){
      self.data.pay.coupon.splice(findItem[0],1);
    }else{
      self.data.pay.coupon.push({
        id:id,
        price:count
      });
    };
    self.setData({
      web_pay:self.data.pay
    });
    console.log('self.data.pay',self.data.pay); 
    self.countPrice();
    

  },

  inputBind(e){
    const self = this;

    api.fillChange(e,self,'sForm');
    if(api.getDataSet(e,"key")=='score'){
      if(self.data.sForm.score>self.data.userData.score||self.data.sForm.score>self.data.mainData[0].score)
      api.showToast('积分不符合规则','none',function(self){
        self.data.sForm.score = '';
        self.setData({
          web_sForm:self.data.sForm
        })
      })  
    };
    console.log(self.data.sForm);
    self.setData({
      web_sForm:self.data.sForm,
    }); 
    self.countPrice(); 
  },


  
  countPrice(){

    const self = this;
    var totalPrice = 0;
    var couponPrice = 0;
    var productsArray = self.data.mainData.products;
    self.data.price = 0;
    for (var i = 0; i < self.data.mainData.length; i++) {

      self.data.price += parseInt(self.data.mainData[i].price)
    };
    if(self.data.pay.coupon.length>0){
      var couponPrice = 0;
      for (var i = 0; i < self.data.pay.coupon.length; i++) {
        couponPrice += self.data.pay.coupon[i].price
      };
    };
    if(self.data.sForm.score>0){
      self.data.pay.score = self.data.sForm.score
    };
    if(self.data.sForm.balance>0){
      self.data.pay.balance = self.data.sForm.balance
    };
    self.data.pay.wxPay = self.data.price - couponPrice - parseInt(self.data.sForm.score) -parseInt(self.data.sForm.balance) ;
    console.log('countPrice',self.data.pay)
    self.setData({
      web_couponPrice:couponPrice.toFixed(2),
      web_price:self.data.price,
      web_pay:self.data.pay
    });

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
  },



  
/*  countPrice(){

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

  },*/


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
    if(self.data.buyType=='delivery'&&self.data.addressData.length==0){
      api.showToast('请选择收货地址','error');
      api.buttonCanClick(self,true);
      return;
    };
    self.pay();
  },


})
