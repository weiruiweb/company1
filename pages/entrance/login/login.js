import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
   sForm:{
      login_name:'',
      password:''
    },
    web_show:true,
    },

 submit(){
    const self = this;
    var postData={};
    postData.tokenFuncName = 'getEntranceToken';
    wx.showLoading(); 
    if(api.checkComplete(self.data.sForm)){
         
      wx.setStorageSync('login',self.data.sForm);
    }else{
      api.showToast('请输入账号密码','none')
    }
    const callback = (res)=>{
      if(res){       
          wx.setStorageSync('threeInfo',res.data.info); 
          wx.redirectTo({
            url: '/pages/entrance/project/project'
          })
          api.showToast('登陆成功','none')  
      }else{
          wx.hideLoading();
         api.showToast('用户不存在','none')
      }
    }
    token.getToken(callback);
  },


  bindInputChange(e){
    const self = this;
    api.fillChange(e,self,'sForm');
    self.setData({
      web_sForm:self.data.sForm,
    });
  },

  onLoad(options){
     const self = this;
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
 
})

  