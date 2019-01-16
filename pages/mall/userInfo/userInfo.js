import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
    sForm:{
      phone:'',
      name:'', 
      gender:'', 
      passage1:'',
      address:''  
    },
    mainData:{},
    isFirstLoadAllStandard:['userInfoGet'],
  },


  onLoad(){
    
    const self = this;
    api.commonInit(self);
    self.userInfoGet();

  },

  getPhoneNumber(e) {
    const self = this;
    const postData = {
      appid:wx.getStorageSync('mall_info').thirdApp.appid,
      tokenFuncName:'getMallToken',
      encryptedData:e.detail.encryptedData,
      iv:e.detail.iv
    };
    const callback = (res) =>{
      if(res.solely_code==100000){
        self.data.sForm.phone = res.info.phoneNumber; 
      };
      self.setData({
        web_sForm:self.data.sForm,
      });
    }
    api.decryptWxInfo(postData,callback)
  },


  userInfoGet(){
    const self = this;
    const postData = {};
    postData.tokenFuncName = 'getMallToken';
    const callback = (res)=>{
      console.log(res)
      self.data.mainData = res.info.data[0];
      self.data.sForm.phone = res.info.data[0].info.phone;
      self.data.sForm.name = res.info.data[0].info.name;
      self.data.sForm.gender = res.info.data[0].info.gender;
      self.data.sForm.address = res.info.data[0].info.address
      self.data.sForm.passage1 = res.info.data[0].info.passage1
      self.setData({
        web_sForm:self.data.sForm,
        web_mainData:self.data.mainData
      });
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'userInfoGet',self);
    };
    api.userGet(postData,callback);
  },


  changeBind(e){
    const self = this;
    if(api.getDataSet(e,'value')){
      self.data.sForm[api.getDataSet(e,'key')] = api.getDataSet(e,'value');
    }else{
      api.fillChange(e,self,'sForm');
    };
    console.log(self.data.sForm);
    self.setData({
      web_sForm:self.data.sForm,
    });  
  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },


  userInfoUpdate(){

    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('mall_token');
    postData.data = {};
    postData.data = api.cloneForm(self.data.sForm);
    const callback = (data)=>{
      if(data.solely_code==100000){
        api.showToast('完善成功','none');
        setTimeout(function(){
          api.pathTo('/pages/mall/User/user','rela')
        },1000);  
      }else{
        api.showToast('网络故障','none')
      };
      api.buttonCanClick(self,true)
    };
    api.userInfoUpdate(postData,callback);

  },
  

  

  submit(){
    const self = this;
    api.buttonCanClick(self);
    var phone = self.data.sForm.phone;
    const pass = api.checkComplete(self.data.sForm);
    if(pass){
      if(phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)){
        api.showToast('手机格式不正确','none')
        api.buttonCanClick(self,true);
      }else{
        self.userInfoUpdate();   
      }
    }else{
      api.showToast('请补全信息','none');
      api.buttonCanClick(self,true);
    };
  },

  bindDateChange(e) {
    const self = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    self.data.sForm.passage1 =  e.detail.value;
    self.setData({
      web_sForm: self.data.sForm
    })
    console.log(self.data.sForm)
  },
 
})
