//logs.js
const util = require('../../utils/util.js')
const app = getApp()


Page({
  data: {
    
  },
  onLoad: function () {
    this.setData({
      fonts:app.globalData.font
    })
  },
  userInfo:function(){
    wx.navigateTo({
      url:'/pages/userInfo/userInfo'
    })
  },
  discount:function(){
    wx.navigateTo({
      url:'/pages/discount/discount'
    })
  },
  address:function(){
    wx.navigateTo({
      url:'/pages/manageAddress/manageAddress'
    })
  },
  order:function(){
    wx.navigateTo({
      url:'/pages/order/order'
    })
  },
 shopping:function(){
     wx.redirectTo({
      url:'/pages/Shopping/shopping'
    })
  },
  sort:function(){
     wx.redirectTo({
      url:'/pages/Sort/sort'
    })
  },
  index:function(){
     wx.redirectTo({
      url:'/pages/Index/index'
    })
  },
  User:function(){
     wx.redirectTo({
      url:'/pages/User/user'
    })
  }
})
