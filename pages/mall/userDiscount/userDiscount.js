import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
    num:0,
    mainData:[],
    searchItem:{
      thirdapp_id:getApp().globalData.thirdapp_id,
      type:1
    },
    isFirstLoadAllStandard:['getOrderData']
  },
  
  onLoad() {
    const self = this;
    api.commonInit(self)
    
    self.getOrderData();
  },

  getOrderData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);
    }
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.tokenFuncName = 'getMallToken';
    postData.searchItem = api.cloneForm(self.data.searchItem);
    postData.order = {
      create_time:'desc'
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      };
      api.buttonCanClick(self,true)
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getOrderData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });     
    };
    api.UserCouponGet(postData,callback);

  },

  

  menuClick: function (e) {
    const self = this;
    api.buttonCanClick(self);
    const num = e.currentTarget.dataset.num;
    self.changeSearch(num);
  },


  changeSearch(num){
    const self = this;
    this.setData({
      num: num
    });
    self.data.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
    };
    if(num=='0'){
      self.data.searchItem.type = '1';
    }else if(num=='1'){
      self.data.searchItem.type = '2';
    };
    self.setData({
      web_mainData:[],
    });
    self.getOrderData(true);
  },



  onReachBottom: function () {
    const self = this;
    if(!self.data.isLoadAll&&self.data.buttonCanClick){
      self.data.paginate.currentPage++;
      self.getOrderData();
    };
  },
})

