//logs.js
import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();
Page({
  data: {
    mainData:[],
    isFirstLoadAllStandard:['getMianData']
  },
  onLoad() {
    const self = this;
    api.commonInit(self);
    self.getMianData();
  },
  getMianData(){
    const self =this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.solely_thirdapp_id,
      menu_id:135,
      relation_user:wx.getStorageSync('threeInfo').user_no,
    };
   const callback =(res)=>{
    console.log(1000,res);
        if(res){
          self.data.mainData=res.info.data[0];
        }else{
          self.data.isLoadAll = true;
          api.showToast('没有更多了','none');
        };
        api.buttonCanClick(self,true);
        api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
        self.setData({
          web_mainData:self.data.mainData,
        });
      };
      api.articleGet(postData,callback);
  },
 intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
})
