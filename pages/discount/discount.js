import {Api} from '../../utils/api.js';
var api = new Api();
var app = getApp()

Page({
  data: {
    num:0,
    mainData:[],
    searchItem:{
      thirdapp_id:getApp().globalData.thirdapp_id,
      type:4
    },
    buttonClicked:false,
    isLoadAll:false
  },
  
  onLoad() {
    const self = this;
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getMainData()
  },

  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);
    }
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = api.cloneForm(self.data.searchItem);
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      }
      wx.hideLoading();
      self.setData({
        buttonClicked:false,
      })
      self.setData({
        web_mainData:self.data.mainData,
      });     
      console.log(self.data.mainData)
    };
    api.productGet(postData,callback);
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
      self.data.searchItem.type = '4';
    }else if(num=='1'){
      self.data.searchItem.type = '3';
    }
    self.setData({
      web_mainData:[],
    });
    self.getMainData(true);
  },
})
