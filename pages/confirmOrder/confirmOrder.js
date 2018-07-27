//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  currentTap:0,
  
  },
  
  onLoad: function () {
   
  },
  order_status:function(e){
    var current = e.currentTarget.dataset.current
    this.setData({
      currentTap:current
    })
  },
  commentOrder:function(){
    wx.navigateTo({
      url:'/pages/commentOrder/commentOrder'
    })
  },
  manageAddress:function(){
    wx.navigateTo({
      url:'/pages/manageAddress/manageAddress'
    })
  }
})
