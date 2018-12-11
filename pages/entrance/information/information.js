import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
   currentId:0,

   mainData:[],
   getBefore:{},
   isFirstLoadAllStandard:['getMainData'],
  },

  onLoad(options){
    const self = this;
    api.commonInit(self);
    self.data.getBefore = {
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
    self.getMainData();
  },

  getMainData(isNew){
    const  self =this;
    if(isNew){
      api.clearPageIndex(self)
    };
    const postData={};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      thirdapp_id:getApp().globalData.solely_thirdapp_id
    };
    postData.getBefore = api.cloneForm(self.data.getBefore);
    const callback =(res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
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



  tab(e){
    const self = this;
    api.buttonCanClick(self);
    var currentId = api.getDataSet(e,'id');
    if(currentId==0){
      self.data.getBefore = {
        caseData:{
          tableName:'label',
          searchItem:{
            title:['=',['企业动态']],
          },
          middleKey:'menu_id',
          key:'id',
          condition:'in',
        },
      }
    }else if(currentId==1){
      self.data.getBefore = {
        caseData:{
          tableName:'label',
          searchItem:{
            title:['=',['合作须知']],
          },
          middleKey:'menu_id',
          key:'id',
          condition:'in',
        },
      }
    }
    self.setData({
      currentId:api.getDataSet(e,'id')
    });
    self.getMainData(true);
  },

  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll&&self.data.buttonCanClick){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
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

  