import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {
    caseData:[],
    mainData:[],
  },
  //事件处理函数
 
  onLoad(options) {
    wx.showLoading();
    const self = this;
    self.getCaseData();
    self.getMainData();
    
  },
  getCaseData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.solely_thirdapp_id
    };
    postData.getBefore = {
      caseData:{
        tableName:'label',
        searchItem:{
          title:['=',['行业案例']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.caseData.push.apply(self.data.caseData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      wx.hideLoading();
      self.setData({
        web_caseData:self.data.caseData,
      });
    };
    api.articleGet(postData,callback);
  },
  getMainData(){
    const  self =this;
    const postData={};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.solely_thirdapp_id
    };
    postData.getBefore ={
     caseData:{
        tableName:'label',
        searchItem:{
          title:['=',['推荐阅读']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback =(res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      wx.hideLoading();
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
  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 
})

  