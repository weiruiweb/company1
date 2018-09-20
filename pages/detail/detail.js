import {Api} from '../../utils/api.js';
var api = new Api();
var app = getApp()

Page({
  data: {
  tabCurrent:0,
  isShow:false,
  chooseType:0,
  chooseType1:0,
  labelData:[]
  },
  
  onLoad(options){
    const self = this;
    self.setData({
      fonts:app.globalData.font
    })
    if(options.id){
      self.data.id = options.id
    };
    self.getMainData();
    self.getLabelData()
  },


  userInfo:function(){
    wx.navigateTo({
      url:'/pages/userInfo/userInfo'
    })
  },

  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      id:self.data.id
    };
    postData.getAfter={
      sku:{
        tableName:'sku',
        middleKey:'product_no',
        key:'sku_no',
        condition:'=',

      } 
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0]
      }
      wx.hideLoading();
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    api.productGet(postData,callback);
  },

  getLabelData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      type:['in',[5,6]]
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.labelData.push.apply(self.data.labelData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      }
      wx.hideLoading();
      self.setData({
        web_labelData:self.data.labelData,
      });
    };
    api.labelGet(postData,callback);   
  },
  
  select_this:function(e){
    var current= e.currentTarget.dataset.current;
    this.setData({
      tabCurrent:current
    })
  },
  goBuy:function(){
    var isShow = !this.data.isShow;
    this.setData({
      isShow:isShow
    })
  },
  close:function(){
    this.setData({
      isShow:false
    })
  },

  chooseType(e){
    const self = this;
    var chooseId = e.currentTarget.dataset.id;
    self.setData({
      web_chooseId:chooseId
    })

  },

})
