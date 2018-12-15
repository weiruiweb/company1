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
      status:['in',[0,1]]
    },
    isFirstLoadAllStandard:['getUserInfoData','getMainData']
  },

  
  onLoad(){
    const self = this;
    api.commonInit(self);
    self.setData({
     fonts:app.globalData.font,
     img:app.globalData.hair
    });
    self.getMainData();
    self.getUserInfoData()
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },


  onPullDownRefresh(){
    const self = this;
    wx.showNavigationBarLoading(); 
    delete self.data.searchItem.create_time;
    self.setData({
      web_startTime:'',
      web_endTime:'',
    });
    self.getMainData(true);

  },


  getUserInfoData(){
    const self = this;
    const postData = {};
    postData.tokenFuncName='getHairToken';
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.userData = res;
      }
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getUserInfoData',self);
      self.setData({
        web_userData:self.data.userData,
      });

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
    postData.token = wx.getStorageSync('hair_token');
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
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self)
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

