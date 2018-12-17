import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {

    submitData:{
      content:'',
      type:2
    },

    buttonCanClick:true
  },

  onLoad(){
    const self = this;
    self.setData({
      web_buttonCanClick:self.data.buttonCanClick
    })
  },


  messageAdd(){
    const self = this;
    const postData = {};
    postData.tokenFuncName = 'getEntranceToken';
    postData.data = {};
    postData.data = api.cloneForm(self.data.submitData);
    const callback = (data)=>{
      api.dealRes(data);
      setTimeout(function(){
        api.pathTo('/pages/entrance/user/user','rela')
      },1000);
      api.buttonCanClick(self,true);
      self.setData({
        web_submitData:self.data.submitData
      });
    };
    api.messageAdd(postData,callback);
  },

  changeBind(e){
    const self = this;
    api.fillChange(e,self,'submitData');
    self.setData({
      web_submitData:self.data.submitData,
    });  
    console.log(self.data.submitData)
  },

  submit(){
    const self = this;
    api.buttonCanClick(self);
    const pass = api.checkComplete(self.data.submitData);
    if(pass){
      const callback = (user,res) =>{
          self.messageAdd(); 
       };
       api.getAuthSetting(callback);   
     
    }else{
      api.showToast('请补全信息','none');
      api.buttonCanClick(self,true);
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

  