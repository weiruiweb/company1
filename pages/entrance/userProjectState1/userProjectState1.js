//logs.js
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

  onLoad(options) {
    const self = this;
    api.commonInit(self);
    self.data.id = options.id;
    self.getMainData();
 
  },

  getMainData(){
    const self= this;
    const postData = {};
    postData.tokenFuncName='getEntranceToken';
    postData.searchItem ={
      thirdapp_id:app.globalData.solely_thirdapp_id,
      id:self.data.id,
      user_type:2
    };

    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];
        self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    api.processGet(postData,callback);
  },




  processUpdate(){
    const self =this;
    api.buttonCanClick(self);
    const postData = {};
    postData.tokenFuncName = 'getEntranceToken';
    postData.data = {
    	step:3
    };
    const callback = (data)=>{
    	if(data.solely_code==100000){
    		api.showToast('已同意','none')
    	}else{
    		api.showToast(data.msg,'none')
    	};
    	self.getMainData()
      api.buttonCanClick(self,true);
    };
    api.processUpdate(postData,callback);
  },


})
