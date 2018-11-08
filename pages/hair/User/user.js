import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();


Page({
  data: {
  },
  onLoad() {
    const self = this;
    self.getUserInfoData();
    self.setData({
      img:app.globalData.img,
    });
  },

  getUserInfoData(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('hair_token');
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
      }
      
      wx.hideLoading();
    };
    api.userInfoGet(postData,callback);   
  },

  userInfo:function(){
    wx.navigateTo({
      url:'/pages/hair/member/member'
    })
  },
  consume:function(){
    wx.navigateTo({
      url:'/pages/hair/consume/consume'
    })
  },
  address:function(){
    wx.navigateTo({
      url:'/pages/hair/album/album'
    })
  },
  discount:function(){
    wx.navigateTo({
      url:'/pages/hair/discount/discount'
    })
  },
  mygroup:function(){
    wx.navigateTo({
      url:'/pages/hair/myGroup/mygroup'
    })
  },
  payment:function(){
    wx.navigateTo({
      url:'/pages/hair/payment/payment'
    })
  },
  top_in:function(){
    wx.navigateTo({
      url:'/pages/hair/userChongzhi/userChongzhi'
    })
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
