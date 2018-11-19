import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();
Page({
  data: {
  tapCurrent:0,
  isShow:false,
  isShows:false,
  this_item:0,
  },
  onLoad: function () {
    this.setData({
      img:app.globalData.restaurant, 
    })
  },
  order_status:function(e){
    var current = e.currentTarget.dataset.current
    this.setData({
      currentTap:current
    })
  },
   tabCont:function(e){
      var currentId=e.currentTarget.dataset.id;
      this.setData({
       tapCurrent:currentId
      });
  },
  send_order:function(){
    this.setData({
      isShow:!this.data.isShow
    })
  },
  send_order1:function(){
    this.setData({
      isShows:!this.data.isShows
    })
  },
  close:function(){
    this.setData({
      isShow:false,
      isShows:false,
    })
  },
   closed:function(){
    this.setData({
      isShows:false
    })
  },
  this_bg:function(e){
    var currents = e.currentTarget.dataset.current
    this.setData({
      this_item:currents
    })
  }

})
