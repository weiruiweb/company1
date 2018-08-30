//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
     // isHidden:false,

  },
 
  onLoad: function () {
     this.setData({
          isHidden: false,
          fonts:app.globalData.font
        });
        // var that = this;
        // setTimeout(function(){
        //   that.setData({
        //       isHidden: true
        //   });
         
        // }, 2000);
  },
  about:function(){
    wx.navigateTo({
      url:'/pages/about/about'
    })
  },
  sign:function(){
    wx.navigateTo({
      url:'/pages/sign/sign'
    })
  },
  caseDetail:function(){
    wx.navigateTo({
      url:'/pages/caseDetail/caseDetail'
    })
  },
  discount:function(){
    wx.navigateTo({
      url:'/pages/discount/discount'
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
