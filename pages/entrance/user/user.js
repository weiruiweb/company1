import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
    buttonCanClick:true
  },
  //事件处理函数
  preventTouchMove:function(e) {

  },

  onLoad(options){
    this.setData({
      web_buttonCanClick:this.data.buttonCanClick
    })
  },
 
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathRedi(e){
    const self = this;
    wx.navigateBack({
      delta:1
    })
  },

  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  },

  test(e){

    const self = this;
    console.log(0);
    api.buttonCanClick(self);
    console.log(1);
    setTimeout(function(){
      api.buttonCanClick(self,true)
    },5000);
    
  }, 
 
})

  