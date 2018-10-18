//index.js
//获取应用实例
import {Api} from '../../../utils/api.js';
const api = new Api();

Page({
  data: {
   num:1,
   mainData:[],
   searchItem:{
      thirdapp_id:'10',
    },
  },


  onLoad(options){
    const self = this;
    if(!wx.getStorageSync('hotel_token')){
      var token = new Token();
      token.getUserInfo();
    };
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getMainData()
  },


  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);  
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.token = wx.getStorageSync('hotel_token');
    postData.searchItem = api.cloneForm(self.data.searchItem)
    postData.order = {
      create_time:'desc'
    }
    const callback = (res)=>{
      if(res.solely_code==100000){
        if(res.info.data.length>0){
          self.data.mainData.push.apply(self.data.mainData,res.info.data);
        }else{
          self.data.isLoadAll = true;
          api.showToast('没有更多了','none');
        };
        wx.hideLoading();
        self.setData({
          web_mainData:self.data.mainData,
        });  
      }else{
        api.showToast('网络故障','none')
      }
      console.log('getMainData',self.data.mainData)
    };
    api.orderGet(postData,callback);
  },

  deleteOrder(e){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('hotel_token');
    postData.searchItem = {};
    postData.searchItem.id = api.getDataSet(e,'id');
    const callback  = res=>{
      api.dealRes(res);
      self.getMainData(true);
    };
    api.orderDelete(postData,callback);
  },





  pay(e){
    const self = this;
    var id = api.getDataSet(e,'id');
    var balance = api.getDataSet(e,'balance')
    const postData = {
      token:wx.getStorageSync('hotel_token'),
      searchItem:{
        id:id
      },
      balance:balance
    };
    const callback = (res)=>{
      wx.hideLoading();
      self.getMainData(true)   
    };
    api.pay(postData,callback);
  },


  menuClick: function (e) {
    const self = this;
    const num = e.currentTarget.dataset.num;
    self.changeSearch(num);
  },

  changeSearch(num){
    const self = this;
    self.setData({
      num: num
    });
   if(num=='1'){
      self.data.searchItem.pay_status = '0';
    }else if(num=='2'){
      self.data.searchItem.pay_status = '1';
    }
    self.setData({
      web_mainData:[],
    });
    self.getMainData(true);
  },

  
  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },
})