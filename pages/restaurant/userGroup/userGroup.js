import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
  currentId:0,
  },
  
  onLoad: function () {
    this.setData({
        img:app.globalData.img,
   })
  },
  order_status:function(e){
    var current = e.currentTarget.dataset.id
    this.setData({
      currentId:current
    })
  },
  commentOrder:function(){
    wx.navigateTo({
      url:'/pages/restaurant/commentOrder/commentOrder'
    })
  },
  manageAddress:function(){
    wx.navigateTo({
      url:'/pages/restaurant/manageAddress/manageAddress'
    })
  }
})
