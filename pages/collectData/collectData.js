import {Api} from '../../utils/api.js';
var api = new Api();
var app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();


Page({
   data: {

    mainData:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const self = this;
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
    self.data.mainData = api.jsonToArray(wx.getStorageSync('collectData'),'unshift');
    self.setData({
      web_mainData:self.data.mainData,
    });
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


})