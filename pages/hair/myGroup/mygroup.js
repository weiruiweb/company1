import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
  currentId:0,
  img:"background:url('/images/hair.png')",
  },
  
  onLoad: function () {
   
  },
  order_status:function(e){
    var current = e.currentTarget.dataset.id
    this.setData({
      currentId:current
    })
  },
  commentOrder:function(){
    wx.navigateTo({
      url:'/pages/hair/commentOrder/commentOrder'
    })
  },
  manageAddress:function(){
    wx.navigateTo({
      url:'/pages/hair/manageAddress/manageAddress'
    })
  }
})
