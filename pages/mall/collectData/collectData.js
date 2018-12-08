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
    if(getApp().globalData.user_discount){
      self.data.user_discount = getApp().globalData.user_discount
    }else{
      getApp().copyUser_discount = (res) => {
          self.data.user_discount = res.discount;
      };
    };
    self.setData({
      user_discount:self.data.user_discount
    })
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

  cancel(e){
    const self = this;
    console.log(api.getDataSet(e,'id'))
    api.deleteFootOne(api.getDataSet(e,'id'),'collectData');
    self.getMainData();
  },
   del(e) {
    this.data.mainData.splice(e.currentTarget.dataset.index, 1)
    this.setData({
     mainData: this.data.mainData
    })
   },


})