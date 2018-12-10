//logs.js
import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();
Page({
  data: {
    submitData:{
      title:'',
      phone:'',
      content:'',
      keywords:'', 
      score:'',
      passage1:'',
      passage2:'',
      type:1,
    }, 
  },
  onLoad: function () {
    this.setData({
    
    })
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
    var phone = self.data.submitData.phone;
    const pass = api.checkComplete(self.data.submitData);
    console.log('pass',pass);
    if(pass){
      if(phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)){
        api.showToast('手机格式不正确','none')
      }else{
        wx.showLoading();
        const callback = (user,res) =>{
          self.messageAdd(); 
       }; 
     }
   }else{
      api.showToast('请补全信息','none');
   };
  },
  messageAdd(){
    const self =this;
    const postData = {};
    postData.tokenFuncName = 'getEntranceToken';
    postData.data = {};
    postData.data = api.cloneForm(self.data.submitData);
    const callback = (data)=>{
        api.dealRes(data);
        submitData:self.data.submitData;
        self.setData({
          web_submitData:self.data.submitData
        });
      };
      api.messageAdd(postData,callback);
  },
})
