import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();



Page({
  
  data: {

    labelData:[],
    threeLabelData:[],
    mainData:[],
    isLoadAll:false,
    sForm:{
      item:''
    },
    searchItem:{
      category_id:30,
    },
    order:{},
    isShow:false,

    isFirstLoadAllStandard:['getMainData','getLabelData'],
  },
  
  onLoad(options) {
    const self = this;
    api.commonInit(self);
    self.data.id=options.id
    if(options.name&&options.name=='score'){
      self.data.searchItem.score = ['>',0]
    }else if(options.name&&options.name=='group'){
      self.data.searchItem.is_group = 1
    }else{
      self.data.searchItem.score = 0;
      self.data.searchItem.is_group = 0
    }
    self.getLabelData();
    self.setData({
      web_id:self.data.searchItem.category_id
    });
  },



  categorySearch(e){
    const self = this;
    api.buttonCanClick(self);
    var id =  api.getDataSet(e,'id');
    self.data.searchItem.category_id = id;
    self.setData({
      web_id:id,
    });
    self.getMainData(true)
  },



  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self); 
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = api.cloneForm(self.data.searchItem);
    postData.searchItem.thirdapp_id = getApp().globalData.mall_thirdapp_id;
    postData.order = api.cloneForm(self.data.order);
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data)
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      }
      api.buttonCanClick(self,true);
      self.setData({
        web_mainData:self.data.mainData,
      });  
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);  
    };
    api.skuGet(postData,callback);
  },
  
  getLabelData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.mall_thirdapp_id,
      type:3
    };
    postData.order = {
      create_time:'normal'
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        for (var i = 0; i < res.info.data.length; i++) {
          self.data.labelData.push.apply(self.data.labelData,res.info.data[i].child)
        }
        for (var i = 0; i < self.data.labelData.length; i++) {
          self.data.threeLabelData.push.apply(self.data.threeLabelData,self.data.labelData[i].child)
        }
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      }
      console.log(self.data.threeLabelData)
      wx.hideLoading();
      self.setData({
        web_threeLabelData:self.data.threeLabelData,
      });
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getLabelData',self);  
      self.getMainData();
    };
    api.labelGet(postData,callback);   
  },

  changeOrder(e){
    const self = this;
    api.buttonCanClick(self);
    const key = api.getDataSet(e,'key');
    console.log(key)
    if(self.data.order.key == key){
      if(self.data.order[key] == 'asc'){
        self.data.order[key] = 'desc'
  
      }else if(self.data.order[key] == 'desc'){
        self.data.order[key] = 'asc'
      }
    }else{
      self.data.order.key = key;
      self.data.order[key] = 'asc';
    };
  
    
    if(self.data.order[key] == 'multi'){
      self.data.order = {};
    };
    self.getMainData(true);
  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathRedi(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  },

  sort_show(){
    var isShow =!this.data.isShow;
    this.setData({
      isShow:isShow
    })
  },
  mask(e){
    this.setData({
      isShow:false
    })
  }
})

