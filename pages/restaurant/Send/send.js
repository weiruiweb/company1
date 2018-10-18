import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();
Page({
  data: {
   isTrue:true,
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
   sort:function(){
     wx.redirectTo({
      url:'/pages/restaurant/Send/send'
    })
  },
  index:function(){
     wx.redirectTo({
      url:'/pages/restaurant/Index/index'
    })
  },
  User:function(){
     wx.redirectTo({
      url:'/pages/restaurant/User/user'
    })
  },
  sendInformation:function(){
  	wx.navigateTo({
  		url:'/pages/restaurant/sendInformation/sendInformation'
  	})
  }
})
