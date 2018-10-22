import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {

    tabCurrent:0,
    mainData:[],
    img:"background:url('/images/hair.png')",
  },
  
  onLoad(options) {
    const self = this;
    self.data.id =  options.id;
    self.getMainData()
  },

  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.hair_thirdapp_id,
      id:self.data.id
    };
    postData.getAfter={
      sku:{
        tableName:'sku',
        middleKey:'product_no',
        key:'sku_no',
        condition:'=',
      } 
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0]
      }else{
        api.showToast('没有更多了','none');
      }
      wx.hideLoading();
      console.log(self.data.mainData)
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    api.productGet(postData,callback);
  },


  userInfo:function(){
    wx.navigateTo({
      url:'/pages/hair/userInfo/userInfo'
    })
  },
   bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  discount:function(e){
    var current=e.currentTarget.dataset.current;
    this.setData({
      tapCurrent:current
    })
  },
  beginAppoint:function(){
    wx.navigateTo({
      url:'/pages/hair/beginAppoint/beginAppoint'
    })
  }
})
