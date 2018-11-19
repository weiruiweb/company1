import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();


Page({
   data: {
    img1:0,
    text: '这是一条会滚动的文字滚来滚去的文字跑马灯，哈哈哈哈哈哈哈哈',
    marqueePace: 1,
    marqueeDistance: 0,
    marqueeDistance2: 0,
    marquee2copy_status: false,
    marquee2_margin: 60,
    size: 14,
    orientation: 'left',
    interval: 20,
    indicatorDots: true,
    autoplay: true,
    intervalOne:2000,
    duration: 1000,
    mainData:[],
    complete_api:[],
  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;
    self.data.name = options.name;
    if(!wx.getStorageSync('exhibition_token')){
      var token = new Token();
      token.getUserInfo(self.data.name);
    };
    wx.showLoading();
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    var length = self.data.text.length * self.data.size;
    var windowWidth = wx.getSystemInfoSync().windowWidth;
    self.setData({
      length: length,
      windowWidth: windowWidth,
      marquee2_margin: length < windowWidth ? windowWidth - length : self.data.marquee2_margin
    });
    self.run2();
    self.getLabelData();
    self.getLabelDataTwo();
    self.getSliderData();
    self.getMainData();
    self.setData({
      img:app.globalData.website
    });
  },
  
  run2: function () {
    var self = this;
    var interval = setInterval(function () {
      if (-self.data.marqueeDistance2 < self.data.length) {
        self.setData({
          marqueeDistance2: self.data.marqueeDistance2 - self.data.marqueePace,
          marquee2copy_status: self.data.length + self.data.marqueeDistance2 <= self.data.windowWidth + self.data.marquee2_margin,
        });
      } else {
        if (-self.data.marqueeDistance2 >= self.data.marquee2_margin) {
          self.setData({
            marqueeDistance2: self.data.marquee2_margin
          });
          clearInterval(interval);
          self.run2();
        } else {
          clearInterval(interval);
          self.setData({
            marqueeDistance2: -self.data.windowWidth
          });
          self.run2();
        }
      }
    }, self.data.interval);
  },

  getMainData(isNew){
    const self = this;
     if(isNew){
      api.clearPageIndex(self);
    }
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      thirdapp_id:getApp().globalData.exhibition_thirdapp_id
    };
    postData.getBefore = {
      mainData:{
        tableName:'label',
        searchItem:{
          title:['=',['案例列表']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      self.data.complete_api.push('getMainData');
      self.setData({
        web_mainData:self.data.mainData,
      });
      self.checkLoadComplete();
    };
    api.articleGet(postData,callback);
  },

  getSliderData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.exhibition_thirdapp_id,
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

  getLabelData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.exhibition_thirdapp_id,
      title:'团队风采',
    };
   
    const callback = (res)=>{
      if(res.info.data.length>0){ 
        self.setData({
          web_labelUrl:res.info.data[0]['mainImg'][0]['url'],
        });
        self.data.complete_api.push('getLabelData')
      };
      self.checkLoadComplete();
    };
    api.labelGet(postData,callback);
  },

  getLabelDataTwo(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.exhibition_thirdapp_id,
      title:'职责责任',
    };
   
    const callback = (res)=>{
      if(res.info.data.length>0){ 
        self.setData({
          web_text:res.info.data[0].description,
          web_labelUrlTwo:res.info.data[0]['mainImg'][0]['url'],
        });
        self.data.complete_api.push('getLabelDataTwo')
      };
      self.checkLoadComplete();
    };
    api.labelGet(postData,callback);
  },

  checkLoadComplete(){
    const self = this;
    var complete = api.checkArrayEqual(self.data.complete_api,['getSliderData','getLabelData','getLabelDataTwo','getMainData']);
    if(complete){
      wx.hideLoading();
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

  