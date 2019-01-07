//logs.js
import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();
Page({
  data: {
    startTime:'',
    endTime:'',
    searchItem:{
      
    },
    mainData:[],
    isFirstLoadAllStandard:['getMainData'],

  },

  onLoad() {
    const self = this;
    api.commonInit(self);
    self.getMainData();
  },
 getMainData(isNew){
    const  self =this;
    if(isNew){
      api.clearPageIndex(self)
    };
  const postData={};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.token = wx.getStorageSync('threeToken');
    postData.searchItem = {
      thirdapp_id:getApp().globalData.solely_thirdapp_id,
      parent_no:wx.getStorageSync('entrance_info').user_no,
      //status:1,
    };
    postData.order = {
      create_time:'desc',
    };
    postData.getAfter = {
      'userInfo':{
        tableName:'User',
        key:'user_no',
        middleKey:'parent_no',
        condition:'=',
        searchItem:{
          status:1
        },
        info:['nickname','headImgUrl','create_time']
      }
    }
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
    api.distributionGet(postData,callback);
 },
 intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll&&self.data.buttonCanClick){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
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

  bindTimeChange: function(e) {
    const self = this;
    var label = api.getDataSet(e,'type');
    this.setData({
      ['web_'+label]: e.detail.value
    });
    self.data[label+'stap'] = new Date(self.data.date+' '+e.detail.value).getTime()/1000;
    if(self.data.endTimestap&&self.data.startTimestap){
      self.data.searchItem.create_time = ['between',[self.data.startTimestap,self.data.endTimestap]];
    }else if(self.data.startTimestap){
      self.data.searchItem.create_time = ['>',self.data.startTimestap];
    }else{
      self.data.searchItem.create_time = ['<',self.data.endTimestap];
    };
    self.getMainData(true);   
  },
})
