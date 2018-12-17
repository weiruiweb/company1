import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {

    mainData:[],
    userData:[],
    searchItem:{
      status:['in',[0,1]],
      type:1
    },
    isFirstLoadAllStandard:['getMainData','getUserInfoData'],
  },

  
  onLoad(){
    const self = this;
    api.commonInit(self);
    self.getMainData();
    self.getUserInfoData();
    self.setData({
      img:app.globalData.hotel,
    });
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },




  getUserInfoData(){
    const self = this;
    const postData = {};
    postData.tokenFuncName = 'getHotelToken';
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.userData = res.info.data[0];
      }
      self.setData({
        web_userData:self.data.userData,
      });
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getUserInfoData',self);
    };
    api.userInfoGet(postData,callback);   
  },

  

  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);  
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.tokenFuncName = 'getHotelToken';
    postData.searchItem = api.cloneForm(self.data.searchItem)
    postData.order = {
      create_time:'desc',
    };
    const callback = (res)=>{
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
    api.flowLogGet(postData,callback);
  },


  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll&&self.data.buttonCanClick){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },







})


