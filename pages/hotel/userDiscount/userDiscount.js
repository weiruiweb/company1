import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
    num:1,
    mainData:[],
    searchItem:{
      pay_status:1
    },
    isFirstLoadAllStandard:['getOrderData'],
    isLoadAll:false,
    buttonCanClick:false,
    complete_api:[],
  },
  
  onLoad() {
    wx.showLoading();
    const self = this;
    wx.removeStorageSync('checkLoadAll');
    self.setData({
      web_num:self.data.num
    });
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getOrderData()
  },

  getOrderData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);
    }
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.tokenFuncName='getHotelToken',
    postData.searchItem = api.cloneForm(self.data.searchItem);
    postData.searchItem.thirdapp_id = getApp().globalData.hotel_thirdapp_id;
    postData.searchItem.type = 3;
    postData.searchItem.user_no = wx.getStorageSync('info').user_no;
    postData.order = {
      create_time:'desc'
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      }
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getOrderData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });     
    };
    api.orderGet(postData,callback);
  },

  menuClick: function (e) {
    const self = this;
    api.buttonCanClick(self);
    const num = e.currentTarget.dataset.num;
    self.changeSearch(num);
   
  },


  changeSearch(num){
    const self = this;
    self.setData({
      web_num: num
    });
    var endTime = Date.parse(new Date());
    self.data.searchItem = {
      pay_status:1
    };
    if(num=='0'){
      
    }else if(num=='1'){
      self.data.searchItem.order_step = '0';
    }else if(num=='2'){
      self.data.searchItem.order_step = '3';
      self.data.searchItem.status = -1;
    }else if(num=='3'){
      self.data.searchItem.deadline = ['<',endTime]
    };
    self.setData({
      web_mainData:[],
    });
    self.getOrderData(true);
  },



  onReachBottom: function () {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getOrderData();
    };
  },
})