import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();
Page({
  data: {

    mainData:[],
    isFirstLoadAllStandard:['getMainData']
  },



  onLoad() {
    const self = this;
    api.commonInit(self);
    self.getMainData();
    self.setData({
      img:app.globalData.hair,
    });
  },


  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self); 
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      thirdapp_id:getApp().globalData.hair_thirdapp_id  
    }
    postData.getBefore = {
      label:{
        tableName:'label',
        searchItem:{
          title:['=',['技师']],
        },
        fixSearchItem:{
          thirdapp_id:getApp().globalData.hair_thirdapp_id
        },
        middleKey:'category_id',
        key:'id',
        condition:'in'
      },
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      }
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      }); 
    };
    api.productGet(postData,callback);
  },

  onReachBottom: function () {
    const self = this;
    if(!self.data.isLoadAll&&self.data.buttonCanClick){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
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
