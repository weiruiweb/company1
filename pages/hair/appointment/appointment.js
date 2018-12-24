import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {

    tabCurrent:0,
    mainData:[],
    isFirstLoadAllStandard:['getMainData']
  },
  
  onLoad(options) {
    const self = this;
    api.commonInit(self);
    self.data.id =  options.id;
    self.getMainData();
    self.setData({
    
      img:app.globalData.hair
    });
  },

  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.hair_thirdapp_id,
      id:self.data.id
    };
    postData.getAfter = {
      order:{
        tableName:'OrderItem',
        middleKey:'id',
        key:'product_id',
        searchItem:{
          status:1
        },
        condition:'='
      },
      sku:{
        tableName:'sku',
        middleKey:'product_no',
        key:'product_no',
        searchItem:{
          status:1
        },
        condition:'='
      }
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0]
      }else{
        api.showToast('没有更多了','none');
      }
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      console.log(self.data.mainData)
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    api.productGet(postData,callback);
  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },


   bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },

  discount:function(e){
    var current=e.currentTarget.dataset.current;
    this.setData({
      tapCurrent:current
    })
  },

})
