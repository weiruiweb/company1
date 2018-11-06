import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();


Page({
  data:{
     aboutData:[],
     newsData:[],
     complete_api:[],
  },
 
  onLoad() {
    
    const self = this;
    wx.showLoading();
    self.setData({
      fonts:app.globalData.font,
      img:app.globalData.img,
    });
    self.getAboutData();
    self.getNewsData()

  },

  getNewsData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.amll_thirdapp_id
    };
    postData.getBefore = {
      caseData:{
        tableName:'label',
        searchItem:{
          title:['=',['新闻资讯']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.newsData.push.apply(self.data.newsData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      self.data.complete_api.push('getNewsData');
      self.setData({
        web_newsData:self.data.newsData,
      });
      self.checkLoadComplete()
    };
    api.articleGet(postData,callback);
  },

  getAboutData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.amll_thirdapp_id
    };
    postData.getBefore = {
      aboutData:{
        tableName:'label',
        searchItem:{
          title:['=',['主关于我们']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.aboutData = res.info.data[0];
      };
      self.data.complete_api.push('getAboutData');
      self.setData({
        web_aboutData:self.data.aboutData,
      });
      self.checkLoadComplete()
    };
    api.articleGet(postData,callback);
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathRedi(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  },

  checkLoadComplete(){
    const self = this;
    var complete = api.checkArrayEqual(self.data.complete_api,['getAboutData','getNewsData']);
    if(complete){
      wx.hideLoading();
    };
  },

})