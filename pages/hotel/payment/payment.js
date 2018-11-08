//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  },
  
  onLoad: function () {
    const self = this;
    self.setData({
      img:app.globalData.img,
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
 
  newAddress:function(){
    wx.navigateTo({
      url:'/pages/hotel/newAddress/newAddress'
    })
  },
  discount:function(){
    wx.navigateTo({
      url:'/pages/hotel/discount/discount'
    })
  }
})
