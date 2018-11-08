import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
    mainData:[],
    complete_api:[],
    tapCurrent:0,
    isShow:false,
    isShows:false,
    this_item:0,
  },
  
  onLoad() {
   const self  = this;
   self.data.paginate = api.cloneForm(getApp().globalData.paginate);
   self.getMainData();
   this.setData({
      img:app.globalData.img,
    })
  },



  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);
    }
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.hair_thirdapp_id  
    }
    postData.getBefore = {
      label:{
        tableName:'label',
        searchItem:{
          title:['=',['团购']],
        },
        fixSearchItem:{
          thirdapp_id:getApp().globalData.hair_thirdapp_id
        },
        middleKey:'category_id',
        key:'id',
        condition:'in'
      },
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      };
      self.data.complete_api.push('getMainData')
      self.setData({
        web_mainData:self.data.mainData,
      }); 
      self.checkLoadComplete()    
    };
    api.productGet(postData,callback);
  },

  checkLoadComplete(){
    const self = this;
    var complete = api.checkArrayEqual(self.data.complete_api,['getSliderData','getCardData','getMainData','getCouponData']);
    if(complete){
      wx.hideLoading();
      self.data.buttonClicked = false;
    };
  },


  order_status:function(e){
    var current = e.currentTarget.dataset.current
    this.setData({
      currentTap:current
    })
  },
  
   tabCont:function(e){
      var currentId=e.currentTarget.dataset.id;
      this.setData({
       tapCurrent:currentId
      });
  },
  send_order:function(){
    this.setData({
      isShow:!this.data.isShow
    })
  },
  send_order1:function(){
    this.setData({
      isShows:!this.data.isShows
    })
  },
  close:function(){
    this.setData({
      isShow:false,
      isShows:false,
    })
  },
  this_bg:function(e){
    var currents = e.currentTarget.dataset.current
    this.setData({
      this_item:currents
    })
  }

})
