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
      img:app.globalData.gym,
    });
  },
  intoPath(e) {
    const self = this;
    api.pathTo(api.getDataSet(e, 'path'), 'nav');
  },
})
