import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();
Page({
  data: {
    
  },
  data: {
    labelData:[],
    mainData:[],
  },
  onLoad: function (options) {
    const self = this;
    wx.showLoading();
    self.data.id = options.id;
    self.getLabelData();
    
  },
 getLabelData(){
    const  self =this;
    const postData={};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.solely_thirdapp_id
    };
    postData.searchItem.parentid = self.data.id;
    const callback =(res)=>{
      if(res.info.data.length>0){
        self.data.labelData.push.apply(self.data.labelData,res.info.data);
      }
      wx.hideLoading();
      self.setData({
        web_labelData:self.data.labelData,
      });
      self.getMainData();
    };
    api.labelGet(postData,callback);
  },
  getMainData(){
    const  self =this;
    const postData={};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.solely_thirdapp_id
    };
    postData.searchItem.menu_id = self.data.labelData[0].id;
    const callback =(res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      wx.hideLoading();
      self.setData({
        web_mainData:self.data.mainData,
      });
    };
    api.articleGet(postData,callback);
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
