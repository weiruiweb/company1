//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    tapCurrent:0,
    currentId:0
  },
  
  onLoad: function () {
   
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
  }
})
