import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {

    isFirstLoadAllStandard:['userGet']
  },

  //事件处理函数
  preventTouchMove:function(e) {

  },

  onLoad(options){
    const self = this;
    api.commonInit(self);
    self.userGet()
  },
  

  userGet(){
    
    const self = this;
    const postData = {};
    postData.tokenFuncName = 'getEntranceToken';
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'userGet',self);
      self.setData({
        web_mainData:self.data.mainData,
      });
    };
    api.userGet(postData,callback);

  },

  submit(e){
    const self = this;
    if(self.data.mainData.primary_scope<30){
      api.showToast('您没有此权限','none');
      return;
    };
    api.pathTo(api.getDataSet(e,'path'),'nav');   
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

  