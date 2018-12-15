import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();


Page({
  data: {
    userData:[],
    isFirstLoadAllStandard:['getMainData'],
  },

  
  onLoad(options){
    const self = this;
    api.commonInit(self);
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
    self.getMainData();
    self.data.mainData = api.getStorageArray('collectData');
    console.log(self.data.mainData.length)
    self.setData({
      web_collectData:self.data.mainData.length
    })
  },

  getMainData(){
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
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
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

  onShareAppMessage(res){
    const self = this;
    console.log(res)
      if(res.from == 'button'){
        self.data.shareBtn = true;
      }else{   
        self.data.shareBtn = false;
      }
      return {
        title: '纯粹科技',
        path: 'pages/index/index?parent_no='+wx.getStorageSync('mall_info').user_no,
        success: function (res){
          console.log(res);
          console.log(parentNo)
          if(res.errMsg == 'shareAppMessage:ok'){
            console.log('分享成功')
            if (self.data.shareBtn){
              if(res.hasOwnProperty('shareTickets')){
              console.log(res.shareTickets[0]);
                self.data.isshare = 1;
              }else{
                self.data.isshare = 0;
              }
            }
          }else{
            wx.showToast({
              title: '分享失败',
            })
            self.data.isshare = 0;
          }
        },
        fail: function(res) {
          console.log(res)
        }
      }
  },
})