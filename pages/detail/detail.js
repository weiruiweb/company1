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
    self.getLabelData();
    if(wx.getStorageSync('collectData')[self.data.id]){
      self.setData({
        url: '/images/collect1.png',
      });
    }else{
      self.setData({
        url: '/images/collect.png',
      });
    };
    wx.showShareMenu({
      withShareTicket: true
    });
  },


  userInfo:function(){
    wx.navigateTo({
      url:'/pages/userInfo/userInfo'
    })
  },

  collect(){
    const self = this;
    const id = self.data.id;
    if(wx.getStorageSync('collectData')&&wx.getStorageSync('collectData')[id]){
      api.deleteFootOne(id,'collectData');
      self.setData({
        url: '/images/collect.png',
      });
    }else{
      api.footOne(self.data.mainData,'id',100,'collectData');  
      self.setData({
        url: '/images/collect1.png',
      });
    };
  },

  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      id:self.data.id
    };
    postData.getAfter={
      product:{
        tableName:'product',
        middleKey:'sku_no',
        key:'product_no',
        condition:'=',
      } 
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];
        self.data.mainData.content = api.wxParseReturn(res.info.data[0].product[0].content).nodes;
      }
      wx.hideLoading();
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    api.skuGet(postData,callback);
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

  onShareAppMessage(res){
    const self = this;
     console.log(res)
      if(res.from == 'button'){
        self.data.shareBtn = true;
      }else{   
        self.data.shareBtn = false;
      }
      return {
        title: '纯粹科技',
        path: 'pages/detail/detail?id='+self.data.id,
        success: function (res){
          console.log(res);
          console.log(parentNo)
          if(res.errMsg == 'shareAppMessage:ok'){
            console.log('分享成功')
            if (self.data.shareBtn){
              if(res.hasOwnProperty('shareTickets')){
              console.log(res.shareTickets[0]);
                self.data.isshare = 1;
              }else{
                self.data.isshare = 0;
              }
            }
          }else{
            wx.showToast({
              title: '分享失败',
            })
            self.data.isshare = 0;
          }
        },
        fail: function(res) {
          console.log(res)
        }
      }
  },

})
