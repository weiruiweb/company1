import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      currentId:0,
  },

  onLoad(){
   
  },
  has_send:function(e){
     var current = e.currentTarget.dataset.id;
    this.setData({
      currentId:current
    })
  },
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
})