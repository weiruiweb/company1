import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();


Page({
  data: {
    mainData:[],
    couponData:[],
    complete_api:[],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    buttonClicked:true,
    img:"background:url('/images/hair.png')",
  },

  onLoad(options) {
    const self = this;
    wx.showLoading();
    self.setData({
      fonts:app.globalData.font
    });
    self.data.name = options.name;
    if(!wx.getStorageSync('hair_token')){
      var token = new Token();
      token.getUserInfo(self.data.name);
    };
    self.getSliderData();
    self.getCardData();
    self.getMainData();
    self.getCouponData()
  },

  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.hair_thirdapp_id  
    }
    postData.getBefore = {
      label:{
        tableName:'label',
        searchItem:{
          title:['=',['技师']],
        },
        fixSearchItem:{
          thirdapp_id:getApp().globalData.hair_thirdapp_id
        },
        middleKey:'category_id',
        key:'id',
        condition:'in'
      },
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      };
      self.data.complete_api.push('getMainData')
      self.setData({
        web_mainData:self.data.mainData,
      }); 
      self.checkLoadComplete()    
    };
    api.productGet(postData,callback);
  },

  getSliderData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.hair_thirdapp_id,
      title:'首页轮播',
    };
   
    const callback = (res)=>{
      if(res.info.data.length>0){ 
        self.setData({
          web_sliderUrl:res.info.data[0]['mainImg']
        });
        self.data.complete_api.push('getSliderData')
      };
      self.checkLoadComplete();
    };
    api.labelGet(postData,callback);
  },

  getCouponData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.hair_thirdapp_id,
      type:['in',[3,4]]
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.couponData.push.apply(self.data.couponData,res.info.data);
      }
      self.data.complete_api.push('getCouponData')
      self.setData({
        buttonClicked:false,
      })
      self.setData({
        web_couponData:self.data.couponData,
      });     
      self.checkLoadComplete()
    };
    api.productGet(postData,callback);
  },

  getCardData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.hair_thirdapp_id,
      title:'会员卡',
    };
   
    const callback = (res)=>{
      if(res.info.data.length>0){ 
        self.setData({
          web_CardUrl:res.info.data[0]['mainImg'][0]['url']
        });
        self.data.complete_api.push('getCardData')
      };
      self.checkLoadComplete();
    };
    api.labelGet(postData,callback);
  },

  checkLoadComplete(){
    const self = this;
    var complete = api.checkArrayEqual(self.data.complete_api,['getSliderData','getCardData','getMainData','getCouponData']);
    if(complete){
      wx.hideLoading();
      self.data.buttonClicked = false;
    };
  },

  addOrder(e){
    const self = this;
    if(self.data.buttonClicked){
      api.showToast('数据有误请稍等','none');
      setTimeout(function(){
        wx.showLoading();
      },800)   
      return;
    }
    self.data.buttonClicked = true;
    var id = api.getDataSet(e,'id');
    var type = api.getDataSet(e,'type');
    var deadline = api.getDataSet(e,'deadline');
    const postData = {
      token:wx.getStorageSync('hair_token'),
      product:[
        {id:id,count:1}
      ],
      pay:{score:0},
      type:type,
      deadline:deadline
    };
    const callback = (res)=>{
      if(res&&res.solely_code==100000){
        api.showToast('领取成功！','none')
          
      }; 
      self.data.buttonClicked = false;  
    };
    api.addOrder(postData,callback);
  },



  store:function(){
    wx.navigateTo({
      url:'/pages/hair/store/store'
    })
  }, 

  order:function(){
    wx.navigateTo({
      url:'/pages/hair/appointment/appointment'
    })
  },
  map:function(){
    wx.navigateTo({
      url:'/pages/hair/map/map'
    })
  },
  group:function(){
    wx.navigateTo({
      url:'/pages/hair/group/group'
    })
  },  

  shoppingEmpty:function(){
    wx.navigateTo({
      url:'/pages/hair/shoppingEmpty/shoppingEmpty'
    })
  },

  about:function(){
    wx.navigateTo({
      url:'/pages/hair/about/about'
    })
  },
  HairDresser:function(){
    console.log("jij")
    wx.navigateTo({
      url:'/pages/hair/HairDresser/hairDresser'
    })
  },
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 
})
