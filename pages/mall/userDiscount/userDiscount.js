import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
    num:0,
    mainData:[],
    searchItem:{
      thirdapp_id:getApp().globalData.thirdapp_id,
      type:3
    },
    buttonClicked:false,
    isLoadAll:false,
    complete_api:[]
  },
  
  onLoad() {
    const self = this;
    wx.showLoading();
    if(!wx.getStorageSync('mall_token')){
      var token = new Token();
      token.getUserInfo();
    };
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getOrderData();
  },

  getOrderData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);
    }
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.tokenFuncName = 'getMallToken';
    postData.searchItem = api.cloneForm(self.data.searchItem);
    postData.searchItem.user_no = wx.getStorageSync('info').user_no;
    postData.order = {
      create_time:'desc'
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      };
      self.data.complete_api.push('getOrderData');
      self.setData({
        buttonClicked:false,
      });
      self.setData({
        web_mainData:self.data.mainData,
      });     
      self.checkLoadComplete();
    };
    api.orderGet(postData,callback);

  },

  

  menuClick: function (e) {
    const self = this;
    self.setData({
      buttonClicked:true,
    })
    const num = e.currentTarget.dataset.num;
    self.changeSearch(num);
  },


  changeSearch(num){
    const self = this;
    this.setData({
      num: num
    });
    self.data.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
    };
    if(num=='0'){
      self.data.searchItem.type = '3';
    }else if(num=='1'){
      self.data.searchItem.type = '4';
    };
    self.setData({
      web_mainData:[],
    });
    self.getOrderData(true);
  },

  checkLoadComplete(){
    const self = this;
    var complete = api.checkArrayEqual(self.data.complete_api,['getOrderData']);
    if(complete){
      wx.hideLoading();
    };
  },

  onReachBottom: function () {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getOrderData();
    };
  },
})

