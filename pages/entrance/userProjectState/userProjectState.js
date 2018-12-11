import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
 
  data: {

    labelData:[],
    mainData:[],
    isFirstLoadAllStandard:['getMainData'],

  },

  onLoad: function (options) {
    const self = this;
    api.commonInit(self);
    self.data.id = options.id;
    self.getMainData();
    
  },


  getMainData(isNew){
    const  self =this;
    if(isNew){
      api.clearPageIndex(self)
    };
    const postData={};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.tokenFuncName='getEntranceToken';
    postData.searchItem = {
      thirdapp_id:getApp().globalData.solely_thirdapp_id,
      passage_array:self.data.id,
      user_type:1
    };
    postData.getAfter = {
    	article:{
    		tableName:'article',
    		middleKey:'passage_array',
    		key:'id',
    		searchItem:{
    			status:1
    		},
    		condition:'='
    	}
    };
    const callback =(res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });
    };
    api.messageGet(postData,callback);
  },


  onReachBottom() {
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

  intoPathRedi(e){
    const self = this;
    wx.navigateBack({
      delta:1
    })
  },

  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 

})
