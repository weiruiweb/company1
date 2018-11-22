//logs.js
import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
 data: {
    mainData:[],
  },
  onLoad: function (options) {
    const self = this;
    wx.showLoading();
    self.data.id = options.id;
    self.getMainData();
    this.setData({
      fonts:app.globalData.font
    });
    
    self.getMainData();
  },
  getMainData(){
    const self= this;
    const postData = {};
    postData.searchItem ={
      thirdapp_id:app.globalData.solely_thirdapp_id,
      id:self.data.id
    };
    postData.searchItem.id = self.data.id;
    const callback = (res)=>{
      self.data.mainData = {};
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];
        self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      };
      console.log(self.data.mainData);
      wx.hideLoading();
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    api.articleGet(postData,callback);
  },
})
