import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();


Page({
  data: {
    labelData:[],
    mainData:[],
    index:0,
    currentId:20,
    isLoadAll:false,
    sForm:{
      item:''
    },
    loadingHidden:false,
  },
  
  onLoad() {
    const self = this;
    setTimeout(function(){
     self.setData({
       loadingHidden: true
     });
    }, 2000);
    this.setData({
      fonts:app.globalData.font,
      img:app.globalData.img,
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
      thirdapp_id:getApp().globalData.mall_thirdapp_id
    };
    if(currentId){
      postData.searchItem.parentid = currentId
    }else{
      postData.searchItem.parentid = self.data.currentId
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
    api.labelGet(postData,callback);
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
