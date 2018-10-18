//index.js
//获取应用实例
import {Api} from '../../../utils/api.js';
const api = new Api();
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