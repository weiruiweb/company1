import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
    img:"background:url('/images/hotel.png')",
  },
  //事件处理函数


  onLoad(options){
    const self = this;
    self.userInfoGet()
  },

  userInfoGet(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('hotel_token');
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0]
      }   
      self.setData({
        web_mainData:self.data.mainData,
      });
      wx.hideLoading();
    };
    api.userGet(postData,callback);
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

  