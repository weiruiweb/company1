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
      thirdapp_id:getApp().globalData.solely_thirdapp_id,
      type:10,
      user_type:0,
    },
    mainData:[],
    positionData:[],
    isFirstLoadAllStandard:['getMainData','getPositonData'],
    array_behavior:['未处理','邀面试', '拒绝', '待定', '入职'],
  },

  onLoad(options){
    const self = this;
    api.commonInit(self);
    self.getMainData();
    self.getPositonData()
  },

  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self)
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.tokenFuncName = 'getEmployeeToken';
    postData.searchItem = api.cloneForm(self.data.searchItem);
    postData.getAfter = {
      position:{
        tableName:'Article',
        middleKey:'relation_id',
        key:'id',
        searchItem:{
          status:1,
        },
        condition:'='
      },
      user:{
        tableName:'User',
        middleKey:'user_no',
        key:'user_no',
        searchItem:{
          status:1,
        },
        condition:'='
      },
    };
    const callback = (res)=>{ 
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data); 
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none') 
      };
      setTimeout(function()
      {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      },300);
      api.buttonCanClick(self,true);
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });
    
    };
    api.messageGet(postData,callback);
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
    delete self.data.searchItem.relation_id;
    delete self.data.searchItem.behavior;
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

   getPositonData(){
    const  self =this;
    const postData={};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.solely_thirdapp_id
    };
    postData.getBefore = {
      partner:{
        tableName:'label',
        searchItem:{
          title:['=',['热招职位']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    }
    const callback =(res)=>{
      if(res.info.data.length>0){
        self.data.positionData.push.apply(self.data.positionData,res.info.data)
      };
      console.log(self.data.positionData)
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getPositonData',self);
      self.setData({

        web_positionData:self.data.positionData,
      });
    };
    api.articleGet(postData,callback);
  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  behaviorChange(e) {
    const self = this;
    console.log(parseInt(e.detail.value));
    var index = e.detail.value;
    self.data.searchItem.behavior = parseInt(e.detail.value);
    self.setData({
      web_index: e.detail.value
    });
    self.getMainData(self)
  },

  positionChange(e) {
    const self = this;
    console.log(parseInt(e.detail.value));
    var indexOne = parseInt(e.detail.value);
    self.data.searchItem.relation_id = self.data.positionData[indexOne].id;
    self.setData({
      web_indexOne: e.detail.value
    });
    self.getMainData(self)
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

  