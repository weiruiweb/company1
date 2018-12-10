import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();
Page({
  data: {
    
  },
  data: {
    labelData:[],
    mainData:[],
  },
  onLoad: function (options) {
    const self = this;
    wx.showLoading();
    self.data.id = options.id;
    self.getMainData();
    
  },


  getMainData(){
    const  self =this;
    const postData={};
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
      wx.hideLoading();
      self.setData({
        web_mainData:self.data.mainData,
      });
    };
    api.messageGet(postData,callback);
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
