import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    mainData:[],
    startTime:'',
    endTime:'',
    searchItem:{
      thirdapp_id:getApp().globalData.mall_thirdapp_id,
      parent_no:wx.getStorageSync('info').user_no
    }

  },
    

  onLoad(){
    const self = this;
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    wx.showLoading();
    if(self.data.searchItem.parent_no&&self.data.searchItem.parent_no!=undefined){
      self.getMainData();
    }else{
      var token = new Token();
      const callback = (res)=>{
        self.getMainData(false,res)
      };
      token.getUserInfo({},callback);
    };
    self.setData({
      fonts:app.globalData.font
    });

    
    
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

  getMainData(isNew,res){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);  
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.token = wx.getStorageSync('mall_token');
    console.log(self.data.searchItem);
    postData.searchItem = api.cloneForm(self.data.searchItem);
    if(res){
      postData.searchItem.parent_no = res.data.info.user_no;
      postData.token = res.data.token;
    };
    postData.order = {
      create_time:'desc'
    }
    postData.getAfter = {
      userInfo:{
        tableName:'user',
        middleKey:'child_no',
        key:'user_no',
        searchItem:{
          status:1
        },
        condition:'=',
        info:['nickname','headImgUrl']
      },
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      };
      setTimeout(function()
      {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      },300);
      wx.hideLoading();
      self.setData({
        web_mainData:self.data.mainData,
        web_total:res.info.total
      });  
    };
    if(!postData.searchItem.parent_no){
      api.showToast('网络故障','none');
      return;
    };
    api.distributionGet(postData,callback);
  },


  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
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
      self.data.searchItem.create_time = ['>',self.data.startTimestap/1000];
    }else{
      self.data.searchItem.create_time = ['<',self.data.endTimestap/1000];
    };
    self.getMainData(true);   
  },

 
})