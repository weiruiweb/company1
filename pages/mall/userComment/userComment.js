
import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {

   messageData:[],
   isFirstLoadAllStandard:['getMainData'],
   searchItem:{
    },
    buttonCanClick:false,
    isLoadAll:false
  },


  onLoad(options){
    const self = this;
    wx.showLoading();
    wx.removeStorageSync('checkLoadAll');
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
    postData.tokenFuncName = 'getMallToken';
    postData.searchItem = {
      type:2
    };
    postData.order = {
      create_time:'desc'
    };
    postData.getAfter = {
      product:{
        tableName:'product',
        middleKey:'relation_id',
        key:'id',
        searchItem:{
          status:1
        },
        condition:'='
      }
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.messageData.push.apply(self.data.messageData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none')
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_messageData:self.data.messageData,
      });  
    };
    api.messageGet(postData,callback);
  },

  onShareAppMessage(res,e){
    const self = this;
    var id = api.getDataSet(e,'id');
  
     console.log(res)
      if(res.from == 'button'){
        self.data.shareBtn = true;
      }else{   
        self.data.shareBtn = false;
      }
      return {
        title: '华珍商城',
        path: 'pages/detail/detail?product_id='+id,
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

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  }


})