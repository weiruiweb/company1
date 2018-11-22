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
  submit:function(){
     wx.redirectTo({
      url:'/pages/entrance/userProjectState/userProjectState'
    })
  }
})
