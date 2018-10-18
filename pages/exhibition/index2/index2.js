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
    num:'',
    mainData:[],
    labelData:[],
    searchItem:{
      menu_id:''
    },
    complete_api:[],
    indicatorDots: true,
    autoplay: true,
    intervalOne:2000,
    duration: 1000,
  },
    
  onLoad(){
    const self = this;
    wx.showLoading();
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getLabelData();
    self.getSliderData()
  },

  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);  
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      menu_id:self.data.searchItem.menu_id,
      thirdapp_id:getApp().globalData.exhibition_thirdapp_id,
    }
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
      self.data.complete_api.push('getMainData');
      self.setData({
        web_mainData:self.data.mainData,
      });
      self.checkLoadComplete();
    };
    api.articleGet(postData,callback);
  },

  getSliderData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.exhibition_thirdapp_id,
      title:'公司动态',
    };
   
    const callback = (res)=>{
      if(res.info.data.length>0){ 
        self.setData({
          web_labelUrl:res.info.data[0]['mainImg'][0]['url'],
        });
        self.data.complete_api.push('getSliderData'); 
      };
      self.checkLoadComplete();
    };
    api.labelGet(postData,callback);
  },


  getLabelData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.exhibition_thirdapp_id,
    };
    postData.getBefore = {
      label:{
        tableName:'label',
        searchItem:{
          title:['=',['公司动态']],
        },
        middleKey:'parentid',
        key:'id',
        condition:'in',
      },
    };
    postData.order = {
      create_time:'normal'
    }
    const callback = (res)=>{
      if(res.info.data.length<5){  
        self.data.viewWidth = (100/(res.info.data.length)).toString()+'%';
      }else{
        self.data.viewWidth = '20'+'%'
      };
      self.data.labelData = res.info.data;
      self.data.searchItem.menu_id = res.info.data[0].id;
      self.data.num = res.info.data[0].id;
      wx.hideLoading();
      self.setData({
        web_labelData:self.data.labelData,
        web_viewWidth:self.data.viewWidth,
        web_num:self.data.num,
      });
      self.getMainData()
    };
    api.labelGet(postData,callback);   
  },

  menuClick: function (e) {
    const self = this;
    const num = e.currentTarget.dataset.num;
    self.changeSearch(num);
  },


  changeSearch(num){
    const self = this;
    this.setData({
      web_num: num
    });
    self.data.searchItem.menu_id = num;
    self.getMainData(true);
  },

 

  checkLoadComplete(){
    const self = this;
    var complete = api.checkArrayEqual(self.data.complete_api,['getMainData','getSliderData']);
    if(complete){
      wx.hideLoading();
    };
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

  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 
  
})

  