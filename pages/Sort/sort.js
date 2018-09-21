import {Api} from '../../utils/api.js';
var api = new Api();
var app = getApp()


Page({
  data: {
    labelData:[],
    mainData:[],
    index:0,
    currentId:20,
    isLoadAll:false,
    sForm:{
      item:''
    }
  },
  
  onLoad: function () {
    const self = this;
    this.setData({
      fonts:app.globalData.font
    });
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getLabelData();
    self.setData({
      web_index:self.data.index,
      web_currentId:self.data.currentId
    });
    self.getMainData()
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
      thirdapp_id:getApp().globalData.thirdapp_id
    };
    if(currentId){
      postData.searchItem.category_id = currentId
    }else{
      postData.searchItem.category_id = self.data.currentId
    }
    postData.getAfter={
      sku:{
        tableName:'sku',
        middleKey:'product_no',
        key:'sku_no',
        condition:'=',
      } 
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      }
      wx.hideLoading();
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    api.productGet(postData,callback);
  },

  getLabelData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id,
      type:3
    };
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
    };
    api.labelGet(postData,callback);   
  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathRedi(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  },

})
