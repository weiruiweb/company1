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
      fonts:app.globalData.font
    })
  },
  userInfo:function(){
    wx.navigateTo({
      url:'/pages/restaurant/userInfo/userInfo'
    })
  },
  discount:function(){
    wx.navigateTo({
      url:'/pages/restaurant/discount/discount'
    })
  },
  address:function(){
    wx.navigateTo({
      url:'/pages/restaurant/manageAddress/manageAddress'
    })
  },
  order:function(){
    wx.navigateTo({
      url:'/pages/restaurant/userOrder/userOrder'
    })
  },
 shopping:function(){
     wx.redirectTo({
      url:'/pages/restaurant/Shopping/shopping'
    })
  },
  sort:function(){
     wx.redirectTo({
      url:'/pages/restaurant/Sort/sort'
    })
  },
  index:function(){
     wx.redirectTo({
      url:'/pages/restaurant/Index/index'
    })
  },
  User:function(){
     wx.redirectTo({
      url:'/pages/restaurant/User/user'
    })
  },
  has_send:function(e){
    this.setData({
      currentId:e.currentTarget.dataset.id
    })
  }
})
