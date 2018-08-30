//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    tapCurrent:0,
    currentId:0
  },
  
  onLoad: function () {
    this.setData({
      fonts:app.globalData.font
    })
  },
  menuTap:function(e){
      var current=e.currentTarget.dataset.current;
      this.setData({
       tapCurrent:current
      });
  },
  tabCont:function(e){
      var currentId=e.currentTarget.dataset.id;
      this.setData({
       currentId:currentId
      });
  },
  gongzhonghao:function(){
    wx.navigateTo({
      url:'/pages/gongzhonghao/gongzhonghao'
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
