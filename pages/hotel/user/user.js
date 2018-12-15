import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
    isFirstLoadAllStandard:['userInfoGet']
  },
  //事件处理函数


  onLoad(options){
    const self = this;
    api.commonInit(self);
    self.userInfoGet();
    self.setData({
      img:app.globalData.hotel,
    });
  },

  userInfoGet(){
    const self = this;
    const postData = {};
    postData.tokenFuncName = 'getHotelToken';
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0]
      }   
      self.setData({
        web_mainData:self.data.mainData,
      });
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'userInfoGet',self)
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

  