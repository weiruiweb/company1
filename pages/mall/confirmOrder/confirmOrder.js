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
    searchItemTwo:
    {
      thirdapp_id:getApp().globalData.mall_thirdapp_id,
      user_no:wx.getStorageSync('mall_info').user_no
    },

    buttonClicked:true,
    order_id:'',
    complete_api:[],
    buyType:'delivery',
  },

  onLoad() {
    const self = this;
    wx.showLoading();
    if(!wx.getStorageSync('mall_token')){
      var token = new Token();
      token.getUserInfo();
    };
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.setData({
      fonts:app.globalData.font,
      web_buyType:self.data.buyType
    });
    getApp().globalData.address_id = '';
    self.getOrderData();
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

  getOrderData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);
    }
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.token = wx.getStorageSync('mall_token');
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      user_no:wx.getStorageSync('mall_info').user_no,
      type:['in',[3,4]]
    }
    postData.order = {
      create_time:'desc'
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.orderData.push.apply(self.data.orderData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      }
      self.data.complete_api.push('getOrderData')
      self.setData({
        buttonClicked:false,
      })
      self.setData({
        web_orderData:self.data.orderData,
      });     
      self.checkLoadComplete()
    };
    api.orderGet(postData,callback);
  },  

  getCouponData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);
    }
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.token = wx.getStorageSync('token');
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
      self.countTotalPrice();
    };
    api.orderGet(postData,callback);
  },




  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.mall_thirdapp_id,
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
    postData.token = wx.getStorageSync('mall_token');
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
    console.log(self.data.complete_api)
    if(self.data.buttonClicked){
      api.showToast('数据有误请稍等','none');
      setTimeout(function(){
        wx.showLoading();
      },800)   
      return;
    }else if(!self.data.order_id){
      self.data.buttonClicked = true;
      const postData = {
        token:wx.getStorageSync('mall_token'),
        sku:self.data.mainData,
        pay:{
          wxPay:self.data.totalPrice.toFixed(2),
          
        },
        type:1
      };
      console.log('addOrder',self.data.addressData)

      if(self.data.addressData){
        postData.snap_address = self.data.addressData;
      };
      if(self.data.buyType=='delivery'&&self.data.addressData.length==0){
        console.log('addOrder',self.data.buyType)
        api.showToast('请选择收货地址','none')
        self.data.buttonClicked = false;
        return;
      };
      const callback = (res)=>{
        if(res&&res.solely_code==100000){
          setTimeout(function(){
            self.data.buttonClicked = false;
          }, 1000)         
        }; 
        self.data.order_id = res.info.id
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
      token:wx.getStorageSync('mall_token'),
      searchItem:{
        id:order_id
      },
      wxPay:self.data.totalPrice.toFixed(2),
      /*coupon:{
        coupon_no:self.data.couponData[0].order_no,
        price:self.data.couponPrice.toFixed(2)
      },*/
      wxPayStatus:0
    };
    const callback = (res)=>{
      wx.hideLoading();
      if(res.solely_code==100000){
         const payCallback=(payData)=>{
          if(payData==1){
            setTimeout(function(){
              api.pathTo('/pages/mall/order/order','redi');
            },800)  
          };   
        };
        api.realPay(res.info,payCallback);   
      }else{
        api.showToast('支付失败','none')
      }
         
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



  
  countTotalPrice(){
    const self = this;
    var totalPrice = 0;

    var couponPrice = 0;
    var productsArray = self.data.mainData;
    for(var i=0;i<productsArray.length;i++){
      totalPrice += productsArray[i].product.price*productsArray[i].count;
    };
    if(self.data.couponData.length>0){
 
      if(self.data.couponData[0].type==3){
        console.log(666)
        totalPrice = totalPrice-self.data.couponData[0].products[0].snap_product.discount;
        couponPrice = self.data.couponData[0].products[0].snap_product.discount;
      }else if(self.data.couponData[0].type==4){
        totalPrice = totalPrice-totalPrice*self.data.couponData[0].products[0].snap_product.discount/10;
        couponPrice = totalPrice*self.data.couponData[0].products[0].snap_product.discount/10
      }; 
    }
    
    self.data.totalPrice = totalPrice;
    self.data.couponPrice = couponPrice;

    console.log(self.data.couponPrice)
    console.log(self.data.totalPrice)
    self.setData({
      web_couponPrice:couponPrice.toFixed(2),
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
