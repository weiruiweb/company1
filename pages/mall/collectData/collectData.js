import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

var startX;
var startY;
var endX;
var endY;

Page({
   data: {
    mainData:[],
    isTouchMove:'',
    translateStyle:'',
    isFirstLoadAllStandard:['getMainData'],
  },


  onLoad(options) {
    const self = this;
    api.commonInit(self);
  
    self.getMainData();
  },

  getMainData(){
    const self = this;
    //self.data.mainData = api.jsonToArray(wx.getStorageSync('collectData'),'unshift');
    self.data.mainData = api.getStorageArray('collectData');
    console.log('getMainData',self.data.mainData);
    self.setData({
      web_mainData:self.data.mainData,
    });
    api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },



   del(e) {
    const self = this;
    var index = api.getDataSet(e,'index');
    api.showToast('已取消','none');
    api.delStorageArray('collectData',self.data.mainData[index],'id'); 
    self.getMainData()
   },


})