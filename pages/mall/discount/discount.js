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
      type:3
    },
    buttonClicked:false,
    isLoadAll:false,
    complete_api:[],
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
        api.showToast('没有更多了','none');
      };
      self.setData({
        web_mainData:self.data.mainData,
      });   
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);  
    };
    api.productGet(postData,callback);
  },

  addOrder(e){
    const self = this;
    api.buttonCanClick(self);
    var id = api.getDataSet(e,'id');
    var type = api.getDataSet(e,'type');
    var duration = api.getDataSet(e,'duration');
    console.log('duration',duration);
    var limit = api.getDataSet(e,'limit');
    const postData = {
      tokenFuncName : 'getMallToken',
      product:[
        {id:id,count:1}
      ],
      pay:{score:0},
      type:type,
      data:{
        end_time:new Date().getTime() + duration,
        limit:limit
      }
    };
    const callback = (res)=>{
      if(res&&res.solely_code==100000){
        api.showToast('领取成功！','none')
        self.data.buttonClicked = false; 
        self.data.discount = true;    
      }; 
      api.buttonCanClick(self,true);
    };
    api.addOrder(postData,callback);

  },


  menuClick: function (e) {
    const self = this;
    self.setData({
      buttonClicked:true,
    })
    const num = e.currentTarget.dataset.num;
    self.changeSearch(num);
  },


  changeSearch(num){
    const self = this;
    this.setData({
      num: num
    });
    self.data.searchItem = {};
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

  checkLoadComplete(){
    const self = this;
    var complete = api.checkArrayEqual(self.data.complete_api,['getMainData']);
    if(complete){
      wx.hideLoading();
    };
  },

  onReachBottom: function () {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },
})
