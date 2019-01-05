
import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
    array: ['邀面试', '拒绝', '待定', '入职'],
    mainData:[],
    isFirstLoadAllStandard:['getMianData']
  },

  onLoad(options){
    const self = this;
    api.commonInit(self);
    self.data.id = options.id;
    self.getMianData();
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
      type:10,
      user_type:0,
    };
    postData.getAfter = {
      position:{
        tableName:'Article',
        middleKey:'relation_id',
        key:'id',
        searchItem:{
          status:1,
        },
        condition:'='
      }
    };
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
    api.messageGet(postData,callback);
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathRedi(e){
    const self = this;
    wx.navigateBack({
      delta:1
    })
  },

  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  },
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },

 
})

  