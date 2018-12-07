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

  touchstart(e) {
    //开始触摸时 重置所有删除
    var touch = e.changedTouches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    console.log(e)
    },

    touchsend(e) {
    var touch = e.changedTouches[0];
        endX = touch.clientX;
        endY = touch.clientY;
    },
    touchmove(e) {
     var self = this;
     var changeX = startX - endX;
     console.log(1000,changeX)
     if(changeX<0){
      var diff={
                x:changeX+'rpx',
            }
     }else{
      var diff={
                x:-changeX+'rpx',
            }
     }
      console.log(13,diff.x);
      var style = 'transform:translateX('+diff.x+');'
      self.setData({
        isTouchMove:e.currentTarget.dataset.index,
        translateStyle:style
      })
   
      console.log(11,self.data.isTouchMove);
      console.log(12,self.data.translateStyle);
    //更新数据
    // self.setData({
    //  mainData: self.data.mainData
    // })
   },
   angle(start, end) {
    var _X = end.X - start.X,
     _Y = end.Y - start.Y
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
   },
   //删除事件
   del(e) {
    this.data.mainData.splice(e.currentTarget.dataset.index, 1)
    this.setData({
     mainData: this.data.mainData
    })
   },


})