//logs.js
import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();
Page({
  data: {
    
  },
  onLoad: function () {
    this.setData({
      fonts:app.globalData.font
    })
  },
  userPayment:function(){
    wx.navigateTo({
      url:'/pages/entrance/userPayment/userPayment'
    })
  },
   userChongzhi:function(){
    wx.navigateTo({
      url:'/pages/entrance/userChongzhi/userChongzhi'
    })
  }, 
  userGroup:function(){
    wx.navigateTo({
      url:'/pages/entrance/userGroup/userGroup'
    })
  },
  discount:function(){
    wx.navigateTo({
      url:'/pages/entrance/userDiscount/userDiscount'
    })
  },
  address:function(){
    wx.navigateTo({
      url:'/pages/entrance/userAddress/userAddress'
    })
  }, 
  userOrder:function(){
    wx.navigateTo({
      url:'/pages/entrance/userOrder/userOrder'
    })
  }, 
  
  userComment:function(){
    wx.navigateTo({
      url:'/pages/entrance/userComment/userComment'
    })
  }, 
  userTakeOut:function(){
    wx.navigateTo({
      url:'/pages/entrance/userTake/userTake'
    })
  },
 

   sort:function(){
     wx.redirectTo({
      url:'/pages/entrance/Dishes/dishes'
    })
  },
  index:function(){
     wx.redirectTo({
      url:'/pages/entrance/Index/index'
    })
  },
  User:function(){
     wx.redirectTo({
      url:'/pages/entrance/User/user'
    })
  }
})
