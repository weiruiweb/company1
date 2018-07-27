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
  backOrder:function(){
    wx.navigateTo({
      url:'/pages/order/order'
    })
  }
})
