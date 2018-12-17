  import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
    mainData:[],
    isFirstLoadAllStandard:['getOrderData']
  },
  
  onLoad() {
    const self = this;
    api.commonInit(self);
    self.getOrderData()
  },

  getOrderData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);
    }
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.tokenFuncName ='getRestaurantToken';
    postData.searchItem = {
      thirdapp_id:getApp().globalData.restaurant_thirdapp_id,
      type:['in',[3,4]]
    }
    postData.searchItem.user_no = wx.getStorageSync('restaurant_info').user_no;
    postData.order = {
      create_time:'desc'
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      }
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getOrderData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });     
    };
    api.orderGet(postData,callback);
  },


  onReachBottom: function () {
    const self = this;
    if(!self.data.isLoadAll&&self.data.buttonCanClick){
      self.data.paginate.currentPage++;
      self.getOrderData();
    };
  },
})