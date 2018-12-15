import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();


Page({
  data: {
    mainData:[],
    isFirstLoadAllStandard:['getMainData','getSliderData'],
    indicatorDots: true,
    autoplay: true,
    intervalOne:2000,
    duration: 1000,
  },
  //事件处理函数
  onLoad(options) {
    const self = this;
    api.commonInit(self);
    self.getMainData();
    self.getSliderData();
    self.setData({
      img:app.globalData.website
    }); 
  },


  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);  
    };
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.exhibition_thirdapp_id
    };
    postData.getBefore = {
      mainData:{
        tableName:'label',
        searchItem:{
          title:['=',['公司业务']],
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
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self)
      self.setData({
        web_mainData:self.data.mainData,
      });
    };
    api.articleGet(postData,callback);
  },

  getSliderData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.exhibition_thirdapp_id,
      title:'公司业务',
    };
   
    const callback = (res)=>{
      if(res.info.data.length>0){ 
        self.setData({
          web_labelUrl:res.info.data[0]['mainImg'],
        });
        api.checkLoadAll(self.data.isFirstLoadAllStandard,'getSliderData',self)
      };
    };
    api.labelGet(postData,callback);
  },




  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathRedi(e){
    const self = this;
    wx.navigateBack({
      delta:1
    })
  },

  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 
})

  