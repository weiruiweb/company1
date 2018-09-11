//index.js
//获取应用实例
import {Api} from '../../utils/api.js';
const api = new Api();
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {

    mainData:[],
    isLoadAll:false,

  },

  onLoad(){
    const self = this;
    self.setData({
      fonts:app.globalData.font
    });
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
  },

  onShow(){
    const self = this;
    self.getMainData(true);
  },


  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);
    }
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.token = wx.getStorageSync('token');
    const callback = (res)=>{
      console.log(res);
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      self.setData({
        web_mainData:self.data.mainData,
      });
    };
    api.addressGet(postData,callback);
  },
  

  choose(e){
    const self = this;
    const id = api.getDataSet(e,'id');
    self.data.id = id;
    getApp().globalData.address_id = id;
    self.setData({
      address_id:self.data.id,
    });
    setTimeout(function(){
      wx.navigateBack({
        delta: 1
      });
    },300);
  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },



  deleteAddress(e){
    const self = this;
    const postData = {};
    postData.searchItem = {};
    postData.searchItem.id = api.getDataSet(e,'id');
    postData.token = wx.getStorageSync('token');
    const callback = (res)=>{
      const resType = api.dealRes(res);
      if(resType){
        self.data.mainData=[];
        self.getMainData(true);
      }
    };
    api.addressDelete(postData,callback)
  },
  

  updateAddress(e){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.searchItem = {};
    postData.searchItem.id = api.getDataSet(e,'id');
    postData.data = {
      isdefault:1
    }
    const callback = (res) =>{
      const resType = api.dealRes(res);
      if(resType){
        self.data.mainData=[];
        self.getMainData(true);
      }
    };
    api.addressUpdate(postData,callback);
  },

  
  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },


})