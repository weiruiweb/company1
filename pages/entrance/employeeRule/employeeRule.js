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
  onLoad() {
    const self = this;
    self.getMainData();
  },
 getMainData(isNew){
    const  self =this;
    if(isNew){
      api.clearPageIndex(self)
    };
    const postData={};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.solely_thirdapp_id
    };
    postData.getBefore = {
      partner:{
        tableName:'label',
        searchItem:{
          title:['=',['公司规定']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    }
    const callback =(res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
        for (var i = 0; i < self.data.mainData.length; i++) {
          self.data.mainData[i].content = api.wxParseReturn(res.info.data[i].content).nodes;
        }
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      api.buttonCanClick(self,true);
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });
    };
    api.articleGet(postData,callback);
  },
 intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
})
