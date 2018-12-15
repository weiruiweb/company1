//logs.js
import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();


Page({
  data: {
    mainData:[],
    isFirstLoadAllStandard:['getMainData'],
    searchItem:{
      thirdapp_id:getApp().globalData.solely_thirdapp_id
    }
  },

  onLoad(options) {
    const self = this;
    api.commonInit(self);
    if(options.name){
      self.data.searchItem.thirdapp_id = 21
    };
    self.getMainData();
  },
  getMainData(){
    const  self =this;
    const postData={};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      thirdapp_id:getApp().globalData.solely_thirdapp_id
    };
    postData.getBefore ={
     caseData:{
        tableName:'label',
        searchItem:{
          title:['=',['公司介绍']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback =(res)=>{

      if(res.info.data.length>0){
        self.data.mainData=res.info.data[0];
        console.log(999,self.data.mainData)
        self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
        
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });
    };
    api.articleGet(postData,callback);
  },

})
