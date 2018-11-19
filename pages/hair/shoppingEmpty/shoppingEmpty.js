import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    const self = this;
    self.setData({
      img:app.globalData.hair,
    });
  },
  newMemeber:function(){
    wx.navigateTo({
      url:'/pages/hair/newMemeber/newMemeber'
    })
  }
})
