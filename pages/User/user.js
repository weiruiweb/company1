//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    
  },
  onLoad: function () {
    
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
  }
})
