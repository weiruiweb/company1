import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {

    mainData:[],
    userData:[],
    startTime:'',
    endTime:'',
    searchItem:{
      status:['in',[0,1]]
    },
    complete_api:[]
  },

  
  onLoad(){
    const self = this;
    wx.showLoading();
    self.setData({
     fonts:app.globalData.font
    });
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
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
    postData.tokenFuncName = 'getMallToken';
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.userData = res;
        self.data.complete_api.push('getUserInfoData')
      }
      self.setData({
        web_userData:self.data.userData,
      });
      self.checkLoadComplete();
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
    postData.tokenFuncName = 'getMallToken';
    postData.searchItem = api.cloneForm(self.data.searchItem)
    postData.order = {
      create_time:'desc',
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
        self.data.complete_api.push('getMainData');
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      };
      self.setData({
        web_mainData:self.data.mainData,
      });
      setTimeout(function(){
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      },300);
      self.checkLoadComplete();
    };
    api.flowLogGet(postData,callback);
  },


  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },

  bindTimeChange: function(e) {
    const self = this;
    var label = api.getDataSet(e,'type');
    this.setData({
      ['web_'+label]: e.detail.value
    });
    self.data[label+'stap'] = new Date(self.data.date+' '+e.detail.value).getTime();
    if(self.data.endTimestap&&self.data.startTimestap){
      self.data.searchItem.create_time = ['between',[self.data.startTimestap,self.data.endTimestap]];
    }else if(self.data.startTimestap){
      self.data.searchItem.create_time = ['>',self.data.startTimestap];
    }else{
      self.data.searchItem.create_time = ['<',self.data.endTimestap];
    };
    self.getMainData(true);   
  },

  checkLoadComplete(){
    const self = this;
    var complete = api.checkArrayEqual(self.data.complete_api,['getMainData','getUserInfoData']);
    if(complete){
      wx.hideLoading();
    };
  },



})
