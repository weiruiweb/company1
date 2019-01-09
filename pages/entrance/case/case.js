import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({

  data: {
    is_show:false,
    currentId:0,
    mainData:[],
    labelData:[],
    menu:[],
    menu_array:[],
    currentText:'',
    isFirstLoadAllStandard:['getLabelData','getMainData'],
    searchItem:{
      thirdapp_id:21
    },
    isShowMore:false,
  },
  

  onLoad(){
    const self = this;
    api.commonInit(self);
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.setData({
       web_isShowMore:self.data.isShowMore,
      web_menu_array:self.data.menu_array
    });
    self.getMainData();
    self.getLabelData()
  },



  getMainData(isNew){
    var self = this;
    if(isNew){
      api.clearPageIndex(self)
    };
    var postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = api.cloneForm(self.data.searchItem);
    var callback = (res) => {
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data)
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none')
      }
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      setTimeout(function()
      {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      },300);
      self.data.isShowMore = false;
      self.setData({
        web_mainData:self.data.mainData,
        web_isShowMore:self.data.isShowMore
      })
    };
    api.articleGet(postData, callback);
  },


  getLabelData(isNew) {
    var self = this;
    if(isNew){
      api.clearPageIndex(self)
    };
    var postData = {};
    postData.searchItem = { 
        type: 1,
        thirdapp_id: 21,
        parentid:2
    };
    var callback = function(res) {
      if(res.info.data.length>0){
        self.data.labelData.push.apply(self.data.labelData,res.info.data)
      }
      
    
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getLabelData',self);
      self.setData({
        web_isShowMore:self.data.isShowMore,
        web_labelData:self.data.labelData
      });
    };
    api.labelGet(postData,callback);
  },

  onPullDownRefresh(){
    const self = this;
    wx.showNavigationBarLoading(); 
    delete self.data.searchItem.menu_id;
    self.data.menu_array = [];
    self.getMainData(true);
    self.setData({
      web_menu_array:self.data.menu_array
    })

  },

  menu_show(e){
    const self = this;
    self.setData({
      is_show:true,
    })
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

  this_choose(e){ 
    const self = this;
    var id = api.getDataSet(e,'id');
    var position = self.data.menu_array.indexOf(id);
    if(position>=0){
      self.data.menu_array.splice(position, 1);
    }else{
      self.data.menu_array.push(id);
    };
    self.data.searchItem.menu_id = ['in',self.data.menu_array];
    if(self.data.searchItem.menu_id.length==0){
      delete self.data.searchItem.menu_id
    };
    self.setData({
       web_menu_array:self.data.menu_array,
    });
  },

  menu_hidden(){
    const self = this; 
    self.setData({
      is_show:false
    });
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

  preventTouchMove:function(e) {
  },
})

  