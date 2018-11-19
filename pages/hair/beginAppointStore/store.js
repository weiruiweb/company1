import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();
Page({
  data: {

  },
  
  onLoad: function () {
   self.setData({
      img:app.globalData.hair
    });
  },
  userInfo:function(){
    wx.navigateTo({
      url:'/pages/hair/userInfo/userInfo'
    })
  },
   bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  discount:function(e){
    var current=e.currentTarget.dataset.current;
    this.setData({
      tapCurrent:current
    })
  },
  newAddress:function(){
    wx.navigateTo({
      url:'/pages/hair/newAddress/newAddress'
    })
  },
  map:function(){
    wx.navigateTo({
      url:'/pages/hair/map/map'
    })
  }
})
