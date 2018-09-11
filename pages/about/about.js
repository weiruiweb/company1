import {Api} from '../../utils/api.js';
const api = new Api();
var app = getApp()
import {Token} from '../../utils/token.js';


Page({
  data:{

     aboutData:[],
     newsData:[]

  },
 
  onLoad() {
    const self = this;
    if(!wx.getStorageSync('token')){
      var token = new Token();
      token.getUserInfo();
    };
    self.setData({
      fonts:app.globalData.font
    });
    self.getAboutData();
    self.getNewsData()
  },

  getNewsData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id
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
      self.setData({
        web_newsData:self.data.newsData,
      });
      console.log(res)
    };
    api.articleGet(postData,callback);
  },

  getAboutData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id
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
      console.log(self.data.aboutData);
      wx.hideLoading();
      self.setData({
        web_aboutData:self.data.aboutData,
      });   
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
  }

})