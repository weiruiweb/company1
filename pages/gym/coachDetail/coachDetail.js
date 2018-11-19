import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();


Page({
  data: {
    currentId:0,
    selectId:0,
  },

  onLoad(options) {
    const self = this;
    self.setData({
      img1:app.globalData.img,
      img:app.globalData.gym,
    });
  },
  
 choose_this: function(e) {
     var current = e.currentTarget.dataset.id;
    this.setData({
      currentId:current
    })
  },
  select: function(e) {
     var selectId = e.currentTarget.dataset.id;
    this.setData({
      selectId:selectId
    })
  },

  intoPath(e) {
    const self = this;
    api.pathTo(api.getDataSet(e, 'path'), 'nav');
  },

  intoPathRedi(e) {
    const self = this;
    wx.navigateBack({
      delta: 1
    })
  },

  intoPathRedirect(e) {
    const self = this;
    api.pathTo(api.getDataSet(e, 'path'), 'redi');
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
  bindTimeChange1: function(e) {
    this.setData({
      time1: e.detail.value
    })
  },
})