import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();


Page({
  data: {
  },

  onLoad(options) {
    this.setData({
      img:app.globalData.gym,
    });
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
  }

})