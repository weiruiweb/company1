//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  },
  
  onLoad: function () {
    const self = this;
    self.setData({
      img:app.globalData.hotel,
      img:app.globalData.restaurant,
    });
  },
  userInfo:function(){
    wx.navigateTo({
      url:'/pages/hotel/userInfo/userInfo'
    })
  },
   bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
})
