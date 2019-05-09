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
      user_type:0,
    },
    mainData:[],
    isShowMore:false,
    positionData:[],
    isFirstLoadAllStandard:['getMainData','getPositonData'],
    array_behavior:['待面试', '已面试', '已入职', '未通过'],
  },

  onLoad(options){
    const self = this;
    api.commonInit(self);
    self.getMainData();
    self.getPositonData()
  },

  getMainData(isNew){
    const self = this;
		api.buttonCanClick(self);
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
        self.data.isShowMore = false;
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
        web_isShowMore:self.data.isShowMore
      })
    
    };
    api.resumeGet(postData,callback);
  },

  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll&&self.data.buttonCanClick){
      self.data.isShowMore = true;
      self.setData({
        web_isShowMore:self.data.isShowMore
      })
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
      web_date:'',

      web_index:'',
      web_indexOne:''
    });
    self.getMainData(true);
  },

  bindTimeChange: function(e) {
    const self = this;
		var date = e.detail.value;  
		self.setData({
			web_date:date
		});
		date = date.replace(/-/g,'/'); 
		var startTimestamp = new Date(date).getTime()/1000;
		var endTimestamp = startTimestamp+24*60*60-1;
		
		console.log(startTimestamp);
		console.log(endTimestamp);
		self.data.searchItem.create_time = ['between',[startTimestamp,endTimestamp]]
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
        tableName:'Label',
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
    self.data.searchItem.behavior = parseInt(e.detail.value)+1;
    self.setData({
      web_index: e.detail.value
    });
    self.getMainData(true)
  },

  positionChange(e) {
    const self = this;
    console.log(parseInt(e.detail.value));
    var indexOne = parseInt(e.detail.value);
    self.data.searchItem.relation_id = self.data.positionData[indexOne].id;
    self.setData({
      web_indexOne: e.detail.value
    });
    self.getMainData(true)
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

  