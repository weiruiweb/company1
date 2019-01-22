//logs.js
import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();
Page({
  data: {
      
    isFirstLoadAllStandard:['getMainData']
  },

  onLoad(options) {
    const self = this;
    api.commonInit(self);
    self.setData({
      web_behavior:options.behavior
    });
    self.data.id = options.id;
    self.getMainData()
  },


  getMainData(){
    const self = this;
    const postData = {};
    postData.tokenFuncName = 'getEmployeeToken';
    postData.searchItem = {
      thirdapp_id:getApp().globalData.solely_thirdapp_id,
      id:self.data.id
    };
    const callback = (res)=>{ 
      if(res.info.data.length>0){
        self.data.mainData=res.info.data[0]
      }else{
        api.showToast('数据错误','none')
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.data.isShowMore = false;
      self.setData({
        web_mainData:self.data.mainData,
      }) 
    };
    api.messageGet(postData,callback);
  },

  messageUpdate(){
    const self =this;
    const postData = {};
    postData.tokenFuncName = 'getEmployeeToken';
    postData.searchItem={
      id:self.data.id,
      user_type:1
    };
    postData.data = {
      behavior:3
    };
    const callback = (data)=>{
      if(data.solely_code==100000){
        api.showToast('审批成功','none',1000,function(){
          setTimeout(function(){
            wx.navigateBack({
              delta:1
            }) 
          },1000);  
        }) 
      }else{
        api.showToast(data.msg,'none')
      }
      api.buttonCanClick(self,true)
    };
    api.messageUpdate(postData,callback);
  },
  
})
