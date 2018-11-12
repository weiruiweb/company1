import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();



Page({
  
  data: {
    _num:0,
    labelData:[],
    mainData:[],
    index:0,
    currentId:20,
    isLoadAll:false,
    sForm:{
      item:''
    },
    isShow:false,
    sort:{
      sortby:'',
      sort:''
    },
  },
  
  onLoad(options) {
    const self = this;
    wx.showLoading();

    this.setData({
      fonts:app.globalData.font,
      img:app.globalData.img,
    });
    self.data.id=options.id
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getLabelData();
    self.setData({
      web_index:self.data.index,
      web_currentId:self.data.currentId
    });
  },



  menuTap(e){
    const self = this;
    var index = e.currentTarget.dataset.index;
    var currentId = e.currentTarget.dataset.id;

    self.setData({
      web_index:index,
      web_currentId:currentId,
    });
    console.log(currentId)
    console.log(index)

    self.getMainData(true,currentId)
  },



  getMainData(isNew,currentId){
    const self = this;
    if(isNew){
      api.clearPageIndex(self); 
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      thirdapp_id:getApp().globalData.mall_thirdapp_id
    };
    if(self.data.id){
      postData.searchItem.category_id = self.data.id
    }else{
      postData.searchItem.category_id = currentId
    };
    postData.getAfter={
      sku:{
        tableName:'sku',
        middleKey:'product_no',
        key:'product_no',
        condition:'=',
      } 
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      }
      wx.hideLoading();
      console.log(self.data.mainData)
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    api.productGet(postData,callback);
  },


  getLabelData(currentId){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.mall_thirdapp_id,
      type:3
    };
    postData.order = {
      create_time:'normal'
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.labelData.push.apply(self.data.labelData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      }
      console.log(self.data.labelData)
      wx.hideLoading();
      self.setData({
        web_labelData:self.data.labelData,
      });
      self.getMainData();
    };
    api.labelGet(postData,callback);   
  },

  changeSort(e){
    const self = this;
    self.setData({
      buttonClicked: true,
      _num:e.currentTarget.dataset.num
    });
    const sortby = api.getDataSet(e,'sortby');
    if(self.data.sort.sortby == sortby){
      if(self.data.sort.sort == 'asc'){
        self.data.sort.sort = 'desc'
      }else if(self.data.sort.sort == 'desc'){
        self.data.sort.sort = 'normal'
      }else if(self.data.sort.sort == 'normal'){
        self.data.sort.sort = 'asc'
      }
    }else{
      self.data.sort.sortby = sortby;
      self.data.sort.sort = 'asc';
    };
    self.setData({
      web_sort:self.data.sort
    });
    
    if(self.data.sort.sort == 'normal'){
      self.data.sort = {}
    };
    setTimeout(function(){
      self.setData({
        buttonClicked: false
      })
    }, 1000);
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

