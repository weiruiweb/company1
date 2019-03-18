
import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({

  data: {

    mainData:[],
    isFirstLoadAllStandard:['getMainData'],
    
  },

  onLoad: function (options) {
    const self = this;
    api.commonInit(self);
    self.data.id = options.id;
    self.getMainData();
  },

  getMainData(){
    const self= this;
    const postData = {};
    postData.tokenFuncName = 'getEntranceToken';
    postData.searchItem ={
      thirdapp_id:app.globalData.solely_thirdapp_id,
      id:self.data.id,
      user_type:['in',[0,1,2]]
    };
    postData.searchItem.id = self.data.id;
    const callback = (res)=>{
      self.data.mainData = {};
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];
        self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });   
    };
    api.projectGet(postData,callback);
  },
  
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
})
