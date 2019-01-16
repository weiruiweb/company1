import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
    mainData:[],
    isShowMore:false,
    isFirstLoadAllStandard:['getMainData']
  },

  onLoad(options){
    const self = this;
    api.commonInit(self);

  },

  onShow(){
    const self = this;
    self.getMainData(true);
  },

  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self)
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.tokenFuncName = 'getEmployeeToken';
    postData.searchItem = {
      //thirdapp_id:getApp().globalData.solely_thirdapp_id,
      user_no:wx.getStorageSync('employeeInfo').user_no,
      type:4,
    };
    const callback = (res)=>{ 
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data); 
      }else{
        self.data.isLoadAll = true; 
      };
      api.buttonCanClick(self,true);
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.data.isShowMore = false;
      self.setData({
        web_mainData:self.data.mainData,
        web_isShowMore:self.data.isShowMore
      })
    
    };
    api.messageGet(postData,callback);
  },

 

  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll&&self.data.buttonCanClick){
      self.data.isShowMore = true;
      self.setData({
        web_isShowMore:self.data.isShowMore
      })
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
})

  