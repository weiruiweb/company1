
import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
    mainData:[],
    isFirstLoadAllStandard:['getMianData'],
  },

  onLoad(options){
    const self = this;
    api.commonInit(self);
    self.data.id = options.id;
    self.getMianData();
    self.setData({
      web_buttonCanClick:self.data.buttonCanClick,
      web_submitData:self.data.submitData
    })
  },

  getMianData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self)
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.token = wx.getStorageSync('threeToken');
    postData.searchItem = {
      id:self.data.id,
      thirdapp_id:getApp().globalData.solely_thirdapp_id,
    };
    postData.getAfter = {
      'userInfo':{
        tableName:'User',
        key:'user_no',
        middleKey:'parent_no',
        condition:'=',
        searchItem:{
          status:1
        },
        info:['nickname','headImgUrl','create_time','passage1']
      }
    }
    const callback = (res)=>{ 
      if(res){
        self.data.mainData=res.info.data[0]; 
        console.log(999,self.data.mainData);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none') 
      };
      api.buttonCanClick(self,true);
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });
    
    };
    api.distributionGet(postData,callback);
  },


})

  