import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
    tapCurrent:0,
    labelData:[],
    mainData:[],
    searchItem:{
      thirdapp_id:getApp().globalData.hair_thirdapp_id,
      category_id:72
    },
    isFirstLoadAllStandard:['getLabelData','getMainData'],
    num:''
  },
  
  onLoad() {
    const self  = this;
    api.commonInit(self);
    self.setData({
      web_num:self.data.searchItem.category_id,
      img:app.globalData.hair
    })
    self.getLabelData();
    self.getMainData()
  },



  getLabelData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.hair_thirdapp_id,
    };
    postData.getBefore = {
      label:{
        tableName:'label',
        searchItem:{
          title:['=',['服务']],
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
      if(res.info.data.length>0){  
        self.data.labelData.push.apply(self.data.labelData,res.info.data)
      }else{
        api.showToast('没有更多了','none')
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getLabelData',self);
      self.setData({
        web_labelData:self.data.labelData,  
      });
    };
    api.labelGet(postData,callback);   
  },

  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self); 
      self.setData({
        web_mainData:self.data.mainData
      }); 
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = api.cloneForm(self.data.searchItem);
    postData.order={
      create_time:'desc'
    };
    postData.getAfter={
      sku:{
        tableName:'sku',
        middleKey:'product_no',
        searchItem:{
          status:1
        },
        key:'product_no',
        condition:'=',
      } 
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        for (var i = 0; i < res.info.data.length; i++) {
            self.data.mainData.push.apply(self.data.mainData,res.info.data[i].sku);
        };
        if(res.info.data.length>8){
          self.data.mainData = self.data.mainData.slice(0,8) 
        }
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      api.buttonCanClick(self,true);
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });     
    };
    api.productGet(postData,callback);
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
      web_num: num
    });
    self.data.searchItem.category_id = num;
    self.getMainData(true);
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
