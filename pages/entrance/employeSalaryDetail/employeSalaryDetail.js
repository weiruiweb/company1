//logs.js
import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
   mainData:[],
   isFirstLoadAllStandard:['getMianData']
  },

  onLoad(options){
    const self = this;
    self.data.id = options.id;
    api.commonInit(self);
    self.getMainData();
  },


  getMainData(){
    const  self =this;
    const postData={};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.solely_thirdapp_id,
      id:self.data.id,
    };
    postData.getAfter = {
      userInfo:{
        tableName:'UserInfo',
        middleKey:'relation_user',
        key:'user_no',
        searchItem:{
          status:1
        },
        condition:'='
      }
    };
    const callback =(res)=>{
      console.log(res);
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];
        self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      }else{
        api.showToast('数据错误',none,1000)
      };
      
     
      api.buttonCanClick(self,true);
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });
    };
    api.articleGet(postData,callback);
  },
})