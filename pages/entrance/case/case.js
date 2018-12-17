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
    submitData:{
      passage_array:[],
    },
    labelData:[],
    menu:[],
    menu_array:[],
    currentText:'',

  },
  

  onLoad(){
    const self = this;
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.setData({
      web_menu_array:self.data.menu_array
    });
    self.getLabelData();
  },



  getMainData(isNew){
    var self = this;
    if(isNew){
      api.clearPageIndex(self)
    };
    var postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      thirdapp_id:21
    }
    postData.searchItem.menu_id = ['in', self.data.menu_array]; 
    var callback = (res) => {
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data)
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none')
      }
      setTimeout(function()
      {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      },300);
      self.data.menu_array = [];
      self.setData({
        web_menu_array:self.data.menu_array,
        web_mainData:self.data.mainData
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
      for (var i = 0; i < res.info.data.length; i++) {
        self.data.menu_array.push(res.info.data[i].id)
      };
      self.setData({
        web_labelData:self.data.labelData
      });
      self.getMainData();
    };
    api.labelGet(postData,callback);
  },

  onPullDownRefresh(){
    const self = this;
    wx.showNavigationBarLoading(); 
    self.data.labelData = [];
    self.data.submitData.passage_array=[];
    self.setData({
       web_submitData:self.data.submitData,
    });
    self.getLabelData(true);

  },

  menu(e){
    const self = this;
    self.setData({
      is_show:true
    })
  },

  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll&&self.data.buttonCanClick){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },

  this_choose(e){ 
    const self = this;
    var text = e.currentTarget.dataset.text;
    var currentId = e.currentTarget.dataset.id;

    var position = self.data.submitData.passage_array.indexOf(text);
    var position1 = self.data.menu_array.indexOf(currentId);
    if(position>=0){
      self.data.submitData.passage_array.splice(position, 1); 
    }else{

      self.data.submitData.passage_array.push(text);
      console.log(self.data.submitData.passage_array)
    };
    if(position1>=0){
      self.data.menu_array.splice(position1, 1);
    }else{
      self.data.menu_array.push(currentId);
    }
    
    self.setData({
       web_submitData:self.data.submitData,
       web_menu_array:self.data.menu_array,
    });
    console.log('web_menu_array',self.data.menu_array);
    self.getMainData(true);
  },

  menu_hidden(){
    const self = this; 
    self.setData({
      is_show:false
    });
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

  