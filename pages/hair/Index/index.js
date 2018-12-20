import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();


Page({
  data: {
    mainData:[],
    couponData:[],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    isFirstLoadAllStandard:['getMainData','getSliderData','getCouponData','getCardData'],
  },

  onLoad(options) {
    const self = this;
    api.commonInit(self);
    self.setData({
      img:app.globalData.hair
    });
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
    };
    postData.getBefore = {
      label:{
        tableName:'label',
        searchItem:{
          title:['=',['技师']],
        },
        middleKey:'category_id',
        key:'id',
        condition:'in'
      },
    };
    postData.getAfter = {
      order:{
        tableName:'OrderItem',
        middleKey:'id',
        key:'product_id',
        searchItem:{
          status:1
        },
        condition:'='
      }
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      }); 
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
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getSliderData',self);
    };
    api.labelGet(postData,callback);
  },

  getCouponData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.hair_thirdapp_id,
      type:['in',[3,4]]
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.couponData.push.apply(self.data.couponData,res.info.data);
      }
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getCouponData',self);
      self.setData({
        web_couponData:self.data.couponData,
      });     
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
      };
       api.checkLoadAll(self.data.isFirstLoadAllStandard,'getCardData',self);
    };
    api.labelGet(postData,callback);
  },



  addOrder(e){
    const self = this;
    api.buttonCanClick(self);
    var id = api.getDataSet(e,'id');
    var type = api.getDataSet(e,'type');
    var deadline = api.getDataSet(e,'deadline');
    const postData = {
      tokenFuncName:'getHairToken',
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
      }else{
        api.showToast(res.msg,'none')
      }
      api.buttonCanClick(self,true)
    };
    api.addOrder(postData,callback);
  },



  store:function(){
    wx.navigateTo({
      url:'/pages/hair/store/store'
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
  tabPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'rela');
  },
  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 

})
