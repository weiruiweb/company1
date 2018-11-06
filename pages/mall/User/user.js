import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();


Page({
  data: {
    userData:[],
  },

  
  onLoad(options){
    const self = this;
    wx.showLoading();
    if(!wx.getStorageSync('mall_token')){
      var token = new Token();
      token.getMallToken();
    };
    self.setData({
     fonts:app.globalData.font,
     img:app.globalData.img,
    });
    if(options.scene){
      var scene = decodeURIComponent(options.scene)
    };
    if(options.parentNo){
      var scene = options.parentNo
    };
    if(scene){
      var token = new Token({parent_no:scene});
      token.getMallToken(false);
    };
    
  },

  onShow(){
    const self = this;
    self.getUserInfoData();
    self.data.mainData = api.jsonToArray(wx.getStorageSync('collectData'),'unshift');
    console.log(self.data.mainData.length)
    self.setData({
      web_collectData:self.data.mainData.length
    })
  },

  getUserInfoData(){
    const self = this;
    const postData = {};
    postData.tokenFuncName = 'getMallToken';
    const callback = (res)=>{
      if(res.solely_code==100000){
        if(res.info.data.length>0){
          self.data.userData = res.info.data[0]; 
        }
        self.setData({
          web_userData:self.data.userData,
        });  
      }else{
        api.showToast('网络故障','none')
      };
      wx.hideLoading();
    };
    api.userInfoGet(postData,callback);   
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