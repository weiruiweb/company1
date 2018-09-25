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
    searchItem:{
      isdefault:1
    },
    buttonClicked: true,
    order_id:'',
    complete_api:[]
  },

  onLoad(options) {
    const self = this;
    if(!wx.getStorageSync('token')){
      var token = new Token();
      token.getUserInfo();
    };
    this.setData({
      fonts:app.globalData.font
    });
    self.data.id = options.id;
    self.getMainData();
 
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
    self.getAddressData();
  },

  getAddressData(){
    const self = this;
    const postData = {}
    postData.token = wx.getStorageSync('token');
    postData.searchItem = api.cloneForm(self.data.searchItem);
    const callback = (res)=>{
      self.data.addressData = res;
      self.setData({
        web_addressData:self.data.addressData,
      });
    };
    api.addressGet(postData,callback);
  },


  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:59,
      id:self.data.id
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0],
        self.data.complete_api.push('getMainData')  
      }else{
        api.showToast('商品信息有误','none')
      }
      self.setData({
        web_mainData:self.data.mainData,
      });
      self.checkLoadComplete()   
    };
    api.productGet(postData,callback);
  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  addOrder(){
    const self = this;
    if(self.data.buttonClicked){
      api.showToast('数据有误请稍等','none');
      return;
    };
    if(wx.getStorageSync('info').info.length==0){
      api.showToast('请完善信息');
      setTimeout(function(){
           api.pathTo('/pages/userComplete/userComplete','nav');
        },800)
      return;
    }else if(!self.data.order_id){
      self.data.buttonClicked = false;
      const postData = {
        token:wx.getStorageSync('token'),
        product:[
          {id:self.data.mainData.id,count:1}
        ],
        pay:{score:self.data.mainData.price},
        snap_address:self.data.addressData.info.data[0]
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
      score:self.data.mainData.price
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
})
