//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
  tabCurrent:0,
  isShow:false,
  chooseType:0,
  chooseType1:0,
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
  
  select_this:function(e){
    var current= e.currentTarget.dataset.current;
    this.setData({
      tabCurrent:current
    })
  },
  goBuy:function(){
    var isShow = !this.data.isShow;
    this.setData({
      isShow:isShow
    })
  },
  close:function(){
    this.setData({
      isShow:false
    })
  },
  chooseType:function(e){
    var chooseType = e.currentTarget.dataset.type;
    this.setData({
      chooseType:chooseType
    })
  },
  chooseType1:function(e){
    var chooseType1 = e.currentTarget.dataset.type;
    this.setData({
      chooseType1:chooseType1
    })

  }
})
