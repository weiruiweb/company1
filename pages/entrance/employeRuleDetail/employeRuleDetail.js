//logs.js
import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
   mainData:[],
   isFirstLoadAllStandard:['getMainData']
  },

  onLoad(options){
    const self = this;
    self.data.id = options.id;
    api.commonInit(self);
    self.getMainData();
   	self.setData({
      mername: options.name
    })
    wx.setNavigationBarTitle({
      title: self.data.mername
    })
  },


  getMainData(){
    const  self =this;
    const postData={};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      thirdapp_id:getApp().globalData.solely_thirdapp_id,
      id:self.data.id
    };
    const callback =(res)=>{
      console.log(res);
      self.data.mainData = res.info.data[0];
      self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      self.setData({
        web_mainData:self.data.mainData,
      });
      api.buttonCanClick(self,true);
        api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
    };
    api.articleGet(postData,callback);
  },
})