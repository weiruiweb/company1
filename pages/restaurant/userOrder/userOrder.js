import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();
Page({
  data: {
   isTrue:true,
   currentId:0,
  },
  onLoad: function () {
   this.setData({
   	 fonts:app.globalData.font
   })
  },
  great:function(){
  	var isTrue = !this.data.isTrue
  	console.log(isTrue)
  	this.setData({
  		isTrue:isTrue
  	})
  },
  orderclick:function(e){
    this.setData({
      currentId:e.currentTarget.dataset.id
    })
  },
  userDeatil:function(){
    wx.navigateTo({
      url:'/pages/restaurant/userDeatil/userDeatil'
    })
  },
   takeDeatil:function(){
    wx.navigateTo({
      url:'/pages/restaurant/takeDeatil/takeDeatil'
    })
  },
  userOrderComment:function(){
    wx.navigateTo({
      url:'/pages/restaurant/userOrderComment/userOrderComment'
    })
  }
})
