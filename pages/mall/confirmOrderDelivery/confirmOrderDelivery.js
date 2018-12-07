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
   
    searchItem:{
      isdefault:1
    },
    submitData:{
      passage1:''
    },
    order_id:'',
    buttonCanClicked:false,
    pay:{
      coupon:[]
    },
    isFirstLoadAllStandard:['getMainData'],
  },

  onLoad() {
    const self = this;
    api.commonInit(self);
    getApp().globalData.address_id = '';
  },

  onShow(){
    const self = this;
    self.data.searchItem = {};
    if(getApp().globalData.address_id){
      self.data.searchItem.id = getApp().globalData.address_id;
    }else{
      self.data.searchItem.isdefault = 1;
    };
    for (var i = 0; i < wx.getStorageSync('payPro').length; i++) {
      self.data.idData.push(wx.getStorageSync('payPro')[i].id)
    }
    self.getMainData();
    console.log(self.data.idData)
    self.getAddressData();
    self.getCouponData();
  },




  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      id:['in',self.data.idData]
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
        self.countTotalPrice(); 
        
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      }
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });
      console.log(self.data.mainData)
      for (var i = 0; i < wx.getStorageSync('payPro').length; i++) {
        for (var j = 0; j < self.data.mainData.length; j++) {
          if(self.data.mainData[j].id == wx.getStorageSync('payPro')[i].id){
            self.data.countData={};
            self.data.countData.count = wx.getStorageSync('payPro')[i].count
            console.log(self.data.countData)
            self.data.mainData[j].push(self.data.countData)
          }
        }
      };
    };
    api.skuGet(postData,callback);
  },

  getCouponData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);
    }
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.tokenFuncName = 'getProjectToken';
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      user_no:wx.getStorageSync('info').user_no,
      type:['in',[3,4]],
    };
    postData.order = {
      create_time:'desc'
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.orderData.push.apply(self.data.orderData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getOrderData',self);
      self.setData({
        buttonClicked:false,
      });
      console.log(self.data.orderData);
      self.setData({
        web_orderData:self.data.orderData,
      });     
    };
    api.orderGet(postData,callback);
  },  

  getAddressData(){
    const self = this;
    const postData = {}
    postData.tokenFuncName = 'getMallToken';
    postData.searchItem = api.cloneForm(self.data.searchItem);
    const callback = (res)=>{
      self.data.addressData = res;
      self.setData({
        web_addressData:self.data.addressData,
      });
    };
    api.addressGet(postData,callback);
  },


 

  addOrder(){
    const self = this;
    self.buttonCanClick(self);
    if(!self.data.order_id){
      self.data.buttonClicked = false;
      const postData = {
        tokenFuncName : 'getMallToken',
        sku:[
          {id:self.data.id,count:self.data.count}
        ],
        pay:{wxPay:self.data.totalPrice.toFixed(2)},
        type:1
      };
      if(self.data.addressData.info.data[0]){
        postData.snap_address = self.data.addressData.info.data[0];
      };
      const callback = (res)=>{
        if(res&&res.solely_code==100000){
         self.data.order_id = res.info
          self.pay(self.data.order_id);          
        };     
      };
      api.addOrder(postData,callback);
    }else{
      self.pay(self.data.order_id)
    }   
  },



  pay(order_id){
    const self = this;
    var order_id = self.data.order_id;
    const postData = {
      tokenFuncName : 'getMallToken',
      searchItem:{
        id:order_id
      },
      wxPay:self.data.totalPrice.toFixed(2),
      wxPayStatus:0
    };
    const callback = (res)=>{
      wx.hideLoading();
      api.showToast('订单已兑换','none')
      if(res.solely_code==100000){
        setTimeout(function(){
          api.pathTo('/pages/userOrder/userOrder','redi');
        },800) 
      }else{
        api.showToast('支付失败','none')
      }
      api.buttonCanClick(self,true)    
    };
    api.pay(postData,callback);
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


  countPrice(){
    const self = this;
    var totalPrice = 0;
    var couponPrice = 0;
    var productsArray = self.data.mainData.products;
    self.data.price = self.data.mainData.price;
    if(self.data.pay.coupon.length>0){
      var couponPrice = 0;
      for (var i = 0; i < self.data.pay.coupon.length; i++) {
        couponPrice += self.data.pay.coupon[i].price
      };
    };
    self.data.pay.wxPay = self.data.price - couponPrice;
    console.log('countPrice',self.data.pay)
    self.setData({
      web_couponPrice:couponPrice.toFixed(2),
      web_price:self.data.price,
      web_pay:self.data.pay
    });

  },



  countTotalPrice(){  
    const self = this;
    var totalPrice = 0;
    totalPrice += self.data.count*parseFloat(self.data.mainData[0].price);
    self.data.totalPrice = totalPrice;
    self.setData({
      web_totalPrice:self.data.totalPrice.toFixed(2)
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
})
