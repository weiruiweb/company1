import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
 
  data: {
    searchItem:{
      thirdapp_id:getApp().globalData.solely_thirdapp_id,
      user_type:['in',[1,2]]
    },
    labelData:[],
    mainData:[],
    isFirstLoadAllStandard:['getMainData','getProjectData'],
    startTime:'',
    endTime:'',
    isShowMore:false,
  },

  onLoad: function (options) {
    const self = this;
    api.commonInit(self);

    self.data.id = options.id;
    self.getProjectData();
    
  },



  getMainData(isNew){
    const  self =this;
    if(isNew){
      api.clearPageIndex(self)
    };
    const postData={};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.tokenFuncName = 'getEmployeeToken';
    postData.searchItem = api.cloneForm(self.data.searchItem);
    postData.searchItem.project_no=self.data.projectData.project_no;
/*    if(self.data.userData.info.behavior==1){
      postData.searchItem.step = ['in',[3,4,5]]
    };
    if(self.data.userData.info.behavior==2){
      postData.searchItem.step = ['in',[1,3]];
      postData.searchItem.function_type=['NOT IN',[6]]
    };
    if(self.data.userData.info.behavior==2){
      postData.searchItem.step = ['in',[1,2,3]];
      postData.searchItem.function_type=['NOT IN',[6]]
    };*/
    const callback =(res)=>{
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
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      
      self.setData({
        web_mainData:self.data.mainData,
        web_isShowMore:self.data.isShowMore
      })
    };
    api.processGet(postData,callback);
  },

  getProjectData(){
    const self= this;
    const postData = {};
    postData.tokenFuncName = 'getEmployeeToken';
    postData.searchItem ={
      thirdapp_id:app.globalData.solely_thirdapp_id,
      id:self.data.id,
    };
    postData.getAfter = {
      userOne:{
        tableName:'User',
        middleKey:'project_manager',
        key:'user_no',
        searchItem:{
          status:1
        },
        condition:'='
      },
      userTwo:{
        tableName:'User',
        middleKey:'sales_manager',
        key:'user_no',
        searchItem:{
          status:1
        },
        condition:'='
      }
    };
    postData.searchItem.id = self.data.id;
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.projectData = res.info.data[0];
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getProjectData',self);
      self.setData({
        web_projectData:self.data.projectData,
      });   
      self.getMainData();
    };
    api.projectGet(postData,callback);
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
