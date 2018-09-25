import {Api} from '../../utils/api.js';
var api = new Api();
var app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();


Page({
  data: {
    tapCurrent:0,
    currentId:0,
    changeCurrent:0,
    isShow:false,
  },
  
  onLoad: function () {
    this.setData({
      fonts:app.globalData.font
    })
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
  },
  tabCont:function(e){
      var currentId=e.currentTarget.dataset.id;
      this.setData({
       currentId:currentId,
       isShow:false
      });

  },
   menuTap:function(e){
      var current=e.currentTarget.dataset.current;
      this.setData({
       tapCurrent:current
      });
  },
})
