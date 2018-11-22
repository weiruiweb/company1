import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
   currentId:0,
   currentId1:0,
   mainData:[],
   cooperData:[],
  },
  onLoad(options){
    
     wx.showLoading();
    const self = this;
    self.getMainData();
    self.getCooperData();
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
          title:['=',['企业动态']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    console.log(postData.getBefore);
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
  getCooperData(){
    const  self =this;
    const postData={};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.solely_thirdapp_id
    };
    postData.getBefore ={
     cooperData:{
        tableName:'label',
        searchItem:{
          title:['=',['合作须知']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    console.log(postData.getBefore);
    const callback =(res)=>{
      if(res.info.data.length>0){
        self.data.cooperData.push.apply(self.data.cooperData,res.info.data);
        self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      wx.hideLoading();
      self.setData({
        web_cooperData:self.data.cooperData,
      });
    };
    api.articleGet(postData,callback);
    console.log(self.data.cooperData);
  },
  tab(e){
   this.setData({
      currentId:e.currentTarget.dataset.id
    })
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
  
})

  