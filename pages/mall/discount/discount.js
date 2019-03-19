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
      thirdapp_id:getApp().globalData.mall_thirdapp_id,
    },
    isShowMore:false,
    img:"background:url('/images/small.png')",
    discount:false,
    isFirstLoadAllStandard:['getMainData'],
  },
  
  onLoad() {
    const self = this;
    api.commonInit(self);
    self.getMainData()
  },

  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = api.cloneForm(self.data.searchItem);
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        self.data.isShowMore = false;
      };
      self.setData({
        web_mainData:self.data.mainData,
        web_isShowMore:self.data.isShowMore
      });   
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);  
    };
    api.couponGet(postData,callback);
  },

  addOrder(e){
    const self = this;
    api.buttonCanClick(self);
    console.log(e);
    var id = api.getDataSet(e,'id');
    var type = api.getDataSet(e,'type');
    var duration = api.getDataSet(e,'duration');
    var discount = api.getDataSet(e,'discount');
    var standard = api.getDataSet(e,'standard');
    var limit = api.getDataSet(e,'limit')
    console.log('duration',duration);
    var limit = api.getDataSet(e,'limit');
    const postData = {
      tokenFuncName:'getMallToken',
      coupon_id:id,
      pay:{score:10},
      
    };
    console.log('postData',postData)
    const callback = (res)=>{
      if(res&&res.solely_code==100000){
        api.showToast('领取成功！','none',2000)
        self.data.discount = true;    
      }else{
        api.showToast(res.msg,'none')
      }
      api.buttonCanClick(self,true);
    };
    api.CouponAdd(postData,callback);

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
      thirdapp_id:getApp().globalData.mall_thirdapp_id,
    };
    if(num=='0'){
      self.data.searchItem.type = '3';
    }else if(num=='1'){
      self.data.searchItem.type = '4';
    }
    self.setData({
      web_mainData:[],
    });
    self.getMainData(true);
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
})
