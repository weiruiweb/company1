//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    tapCurrent:0,
    currentId:0,
    changeCurrent:0,
    isShow:false,
  },
  
  onLoad: function () {
   
  },
  
  changeImage:function(e){
    var changeCurrent= e.currentTarget.dataset.current;
    this.setData({
      changeCurrent:changeCurrent
    })
  },
  sort_show:function(){
    var isShow =!this.data.isShow;
    this.setData({
      isShow:isShow
    })
  },
  detail:function(){
    wx.navigateTo({
      url:'/pages/detail/detail'
    })
  }
})
