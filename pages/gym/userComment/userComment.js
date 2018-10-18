import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();



Page({
  data: {
    num:1,
    searchItem:{
      thirdapp_id:'12',
      passage1:''
    },
    mainData:[]
  },
  
  onLoad() {
    const self = this;
    self.data.searchItem.passage1 = self.data.num;
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getMainData()
  },

  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);  
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.token = wx.getStorageSync('gym_token');
    postData.searchItem = api.cloneForm(self.data.searchItem);
    postData.searchItem.user_no = wx.getStorageSync('info').user_no
    postData.order = {
      create_time:'desc'
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      wx.hideLoading();
      self.setData({
        web_mainData:self.data.mainData,
        web_totol:res.info.data.length
      });  
    };
    api.messageGet(postData,callback);
  },

  menuClick: function (e) {
    const self = this;
    const num = e.currentTarget.dataset.num;
    self.changeSearch(num);
  },


  changeSearch(num){
    const self = this;
    this.setData({
      num: num
    });
    self.data.searchItem.passage1 = num;
    self.getMainData(true);
  },


  messageDelete(e){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('gym_token');
    postData.searchItem = {};
    postData.searchItem.id = api.getDataSet(e,'id')
    const callback = res=>{
      wx.hideLoading();
      api.dealRes(res);
      self.getMainData(true); 
    };
    api.messageDelete(postData,callback)
  },

  checkToday(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('gym_token');
    postData.searchItem = api.cloneForm(self.data.searchItem);
    postData.searchItem.create_time = ['between',[new Date(new Date().setHours(0, 0, 0, 0)) / 1000,new Date(new Date().setHours(0, 0, 0, 0)) / 1000 + 24 * 60 * 60-1]]
    const callback = (res)=>{
      self.data.todayData = res.info.data;
      wx.hideLoading();
      self.setData({
        web_todayData:self.data.todayData,
      })
    };
    api.messageGet(postData,callback);
  },
  

  messageUpdate(e){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('gym_token');
    postData.searchItem = {};
    postData.searchItem.id = api.getDataSet(e,'id');
    postData.data = {
      passage1:1
    };
    postData.saveAfter=[]
    const callback = (data)=>{
      self.checkToday();
      if(self.data.todayData.length<5){
        postData.saveAfter.push(postData.saveAfter,[
          {
            tableName:'FlowLog',
            FuncName:'add',
            data:{
              count:self.data.artData.small_title,
              trade_info:'发布积分奖励',
              user_no:wx.getStorageSync('info').user_no,
              type:3,
              thirdapp_id:getApp().globalData.thirdapp_id
            }
           }
        ]);                  
      };
      wx.hideLoading();
      if(data.solely_code == 100000){
        api.showToast('发布成功','fail');
        api.pathTo('/pages/Send/send','rela');
      }else{
        api.showToast('发布失败','fail');
      };
      self.getMainData(true);
    };
    api.messageUpdate(postData,callback);
  },

  
  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },


})