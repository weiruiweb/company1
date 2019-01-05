//logs.js
import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();
Page({
  data: {
    array: ['邀面试', '拒绝', '待定', '入职']
  },
  onLoad() {
    const self = this;
  },

  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },
})
