import {Api} from '../../utils/api.js';
var api = new Api();
var app = getApp();
import {Token} from '../../utils/token.js';
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
    buttonClicked:true,
    order_id:'',
    complete_api:[]
  },

  onLoad() {
    const self = this;
    wx.showLoading();
    if(!wx.getStorageSync('token')){
      var token = new Token();
      token.getUserInfo();
    };
    this.setData({
      fonts:app.globalData.font
    });
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
    self.data.mainData = api.jsonToArray(wx.getStorageSync('payPro'),'unshift');
    wx.removeStorageSync('payPro');
    for (var i = 0; i < self.data.mainData.length; i++) {
      self.data.idData.push(self.data.mainData[i].id)
    }
    self.getMainData();
    console.log(self.data.idData)
    self.getAddressData();
  },




  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      id:['in',self.data.idData]
    }
    const callback = (res)=>{
      for (var i = 0; i < self.data.mainData.length; i++) {
        for (var j = 0; j < res.info.data.length; j++) {
          if(self.data.mainData[i].id == res.info.data[j].id){
            self.data.mainData[i].product = res.info.data[j]
          }
        }
      };
      self.data.complete_api.push('getMainData')
      self.setData({
        web_mainData:self.data.mainData,
      });
      console.log(self.data.mainData)
      self.countTotalPrice();
      self.checkLoadComplete()   
    };
    api.skuGet(postData,callback);
  },

  getAddressData(){
    const self = this;
    const postData = {}
    postData.token = wx.getStorageSync('token');
    postData.searchItem = api.cloneForm(self.data.searchItem);
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.addressData = res.info.data[0]; 
      };
      console.log('getAddressData',self.data.addressData)
      self.setData({
        web_addressData:self.data.addressData,
      });
    };
    api.addressGet(postData,callback);
  },


 

  addOrder(){
    const self = this;
    if(self.data.buttonClicked){
      api.showToast('数据有误请稍等','none');
      setTimeout(function(){
        wx.showLoading();
      },800)   
      return;
    }else if(!self.data.order_id){
      self.data.buttonClicked = true;
      for (var i = 0; i < self.data.mainData.length; i++) {
        self.data.payData={};
        self.data.payData.id=self.data.mainData[i].id,
        self.data.payData.count=self.data.mainData[i].count,
        console.log(self.data.payData)
      };
      const postData = {
        token:wx.getStorageSync('token'),
        sku:[
          {id:self.data.payData.id,count:self.data.payData.count}
        ],
        pay:{wxPay:self.data.totalPrice.toFixed(2)},
        type:1
      };
      if(self.data.addressData){
        postData.snap_address = self.data.addressData;
      };
      const callback = (res)=>{
        if(res&&res.solely_code==100000){
          setTimeout(function(){
            self.data.buttonClicked = false;
          }, 1000)         
        }; 
        self.data.order_id = res.info
        self.pay(self.data.order_id);     
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
      token:wx.getStorageSync('token'),
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
         
    };
    api.pay(postData,callback);
  },

  checkLoadComplete(){
    const self = this;
    var complete = api.checkArrayEqual(self.data.complete_api,['getMainData']);
    if(complete){
      wx.hideLoading();
      self.data.buttonClicked = false;
    };
  },



  
  countTotalPrice(){
    const self = this;
    var totalPrice = 0;
    var productsArray = self.data.mainData;
    for(var i=0;i<productsArray.length;i++){
      totalPrice += productsArray[i].product.price*productsArray[i].count;
    };
    /*if(JSON.stringify(self.data.coupon) != "{}"){
      if(self.data.coupon.passage1=='deduction'){
        totalPrice -= self.data.coupon.deduction
      }else if(self.data.coupon.passage1=='discount'){
        totalPrice = totalPrice*self.data.coupon.discount/10;
      };
    };*/

    self.data.totalPrice = totalPrice;
    self.setData({
      web_totalPrice:totalPrice.toFixed(2)
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
