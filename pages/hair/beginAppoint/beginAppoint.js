import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
    tabCurrent:0,
    isChoose:0,
    isFirstLoadAllStandard:['getMainData','getStoreData'],
    storeArray: [],
    array1: ['60分钟', '90分钟', '120分钟', '150分钟'],
    index: 0,
    index1:0,

    multiArray: [],
    
  },
  
  onLoad(options) {
    const self = this;
    api.commonInit(self);
    self.data.id = options.id;
    self.setData({
      img:app.globalData.hair,
    });
    self.getMainData();
  },

  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.hair_thirdapp_id,
      id:self.data.id
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];
        self.data.multiArray = [[self.data.mainData.title],[self.data.mainData.description]]
      }else{
        api.showToast('没有更多了','none');
      }
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      console.log(self.data.mainData)
      self.setData({
        web_multiArray:self.data.multiArray,
        web_mainData:self.data.mainData
      });  
      self.getStoreData()
    };
    api.productGet(postData,callback);
  },

  getStoreData(){
    const self = this;
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      thirdapp_id:getApp().globalData.hair_thirdapp_id
    };
    postData.getBefore = {
      store:{
        tableName:'label',
        middleKey:'menu_id',
        key:'id',
        searchItem:{
          title:['=',['门店']]
        },
        condition:'in'
      }
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        for (var i = 0; i < res.info.data.length; i++) {
          self.data.storeArray.push(res.info.data[i].title+':'+res.info.data[i].description)
        }
      }
      console.log(self.data.storeArray)
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getStoreData',self);
      self.setData({
        web_storeArray:self.data.storeArray,
      });  
    };
    api.articleGet(postData,callback);
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
  changeData:function(e){
    var current=e.currentTarget.dataset.current;
    this.setData({
      tabCurrent:current
    })
  },
  newAddress:function(){
    wx.navigateTo({
      url:'/pages/hair/newAddress/newAddress'
    })
  },
  choose:function(e){
    var current = e.currentTarget.dataset.type;
    this.setData({
      isChoose:current
    })
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindPickerChange1: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index1: e.detail.value
    })
  },
   bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index2: e.detail.value
    })
  },
})
