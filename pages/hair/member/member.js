import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
    img:"background:url('/images/hair.png')",
  },
  
  onLoad: function () {
   
  },
  shoppingEmpty:function(){
    wx.navigateTo({
      url:'/pages/hair/shoppingEmpty/shoppingEmpty'
    })
  },
  payment:function(){
    wx.navigateTo({
      url:'/pages/hair/payment/payment'
    })
  },
   bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  top_in:function(){
    wx.navigateTo({
      url:'/pages/hair/userChongzhi/userChongzhi'
    })
  }
  
})
