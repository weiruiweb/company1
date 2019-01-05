//logs.js
import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();
Page({
  data: {
    
  },
  onLoad() {
    const self = this;
  },

 intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
})
