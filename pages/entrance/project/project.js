import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {
    mainData:[],
    isFirstLoadAllStandard:['getMainData'],
  },

  onLoad: function () {
    const self = this;
    api.commonInit(self);  	
    self.getMainData();
  },


  getMainData(){
    const  self =this;
    const postData={};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.solely_thirdapp_id,
      user_no:wx.getStorageSync('threeInfo').user_no
    };
    postData.getBefore ={
     caseData:{
        tableName:'label',
        searchItem:{
          title:['=',['项目管理']],
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
        api.showToast('没有更多了','none');
      };
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


})
