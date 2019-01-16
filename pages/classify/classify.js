import {Api} from '../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();


Page({
  data:{
  	mainData:[],
  	isFirstLoadAllStandard:['getMainData'],
  },
 
  onLoad() {
    const self = this;
    api.commonInit(self);
    self.getMainData();
    self.setData({
      fonts:app.globalData.font
    });
  },

   getMainData(isNew){
    const  self =this;
    if(isNew){
      api.clearPageIndex(self)
    };
    const postData={};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      
    };
    postData.getBefore = {
      partner:{
        tableName:'Label',
        searchItem:{
          title:['=',['公司小程序']],
        },
        middleKey:'parentid',
        key:'id',
        condition:'in',
      },
    }
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
    api.labelGet(postData,callback);
  },
  
  tabPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'rela');
  },


})