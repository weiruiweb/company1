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
    classData:[],
    img:"background:url('/images/gym.png')",
  },

  onLoad(options) {
    const self = this;
    wx.showLoading();
    self.setData({
      fonts:app.globalData.font
    });
    self.data.name = options.name;
    if(!wx.getStorageSync('gym_token')){
      var token = new Token();
      token.getUserInfo(self.data.name);
    };
    self.getSliderData();
    self.getClassData();
    self.getMainData();
    self.getArtData();
    self.getCouponData()

  },

  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.gym_thirdapp_id  
    }
    postData.getBefore = {
      label:{
        tableName:'label',
        searchItem:{
          title:['=',['教练']],
        },
        fixSearchItem:{
          thirdapp_id:getApp().globalData.gym_thirdapp_id
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
      self.data.complete_api.push('getMainData');
      self.setData({
        web_mainData:self.data.mainData,
      }); 
      self.checkLoadComplete()    
    };
    api.productGet(postData,callback);
  },


  getClassData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.gym_thirdapp_id  
    }
    postData.getBefore = {
      label:{
        tableName:'label',
        searchItem:{
          title:['=',['课程']],
        },
        fixSearchItem:{
          thirdapp_id:getApp().globalData.gym_thirdapp_id
        },
        middleKey:'category_id',
        key:'id',
        condition:'in'
      },
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.classData.push.apply(self.data.classData,res.info.data);
      };
      self.data.complete_api.push('getClassData');
      self.setData({
        web_classData:self.data.classData,
      }); 
      self.checkLoadComplete()    
    };
    api.productGet(postData,callback);
  },

  getSliderData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.gym_thirdapp_id,
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
      thirdapp_id:getApp().globalData.gym_thirdapp_id,
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

  getArtData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.gym_thirdapp_id
    };
    postData.getBefore = {
      article:{
        tableName:'label',
        searchItem:{
          title:['=',['门店']],
          thirdapp_id:['=',[getApp().globalData.gym_thirdapp_id]],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback = (res)=>{
      self.data.artData = {};
      if(res.info.data.length>0){
        self.data.artData = res.info.data[0];
      };
      self.data.complete_api.push('getArtData')
      self.setData({
        web_artData:self.data.artData,
      });
      self.checkLoadComplete() 
    };
    api.articleGet(postData,callback);
  },



  checkLoadComplete(){
    const self = this;
    var complete = api.checkArrayEqual(self.data.complete_api,['getMainData','getSliderData','getCouponData','getClassData','getArtData']);
    if(complete){
      wx.hideLoading();
      self.data.buttonClicked = false;
    };
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

  