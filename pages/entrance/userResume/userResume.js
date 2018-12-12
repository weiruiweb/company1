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
      keywords:'',
      type:10,
      gender:'',
      mainImg:[],
      content:'',
      description:'',

      class:''
    }, 
    isFirstLoadAllStandard:['getMainData'],

  },



  onLoad() {
    const self = this;
    api.commonInit(self);
    self.getMainData();
    self.setData({
    	web_submitData:self.data.submitData,
    	web_buttonCanClick:self.data.buttonCanClick
    })
 
  },


  getMainData() {
    const self = this;
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
    self.data.submitData.keywords =  currentdate.split('-')
    self.setData({
      web_submitData:self.data.submitData
    })
  },


  changeBind(e){
    const self = this;
    if(api.getDataSet(e,'value')){
      self.data.submitData[api.getDataSet(e,'key')] = api.getDataSet(e,'value');
    }else{
      api.fillChange(e,self,'submitData');
    };
    self.setData({
      web_submitData:self.data.submitData,
    }); 
    console.log(self.data.submitData)
  },

   bindDateChange: function(e) {
    const self = this;
    console.log('picker发送选择改变，携带值为', e.detail.value);
    self.data.submitData.keywords = e.detail.value.split("-");
    console.log(self.data.submitData.keywords)
    self.setData({
      web_submitData:self.data.submitData
    })
    new Date(self.data.submitData.keywords.join("-")).getTime();
  },


  formIdAdd(e){
    api.WxFormIdAdd(e.detail.formId,(new Date()).getTime()/1000+7*86400);  
  },


  submit(){
    const self = this;
    api.buttonCanClick(self);
    self.setData({
    	web_buttonCanClick:self.data.buttonCanClick
    });
    var phone = self.data.submitData.phone;
    const pass = api.checkComplete(self.data.submitData);
    console.log('pass',pass);
    if(pass){
      if(phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)){
        api.showToast('手机格式不正确','none',function(){
        	api.buttonCanClick(self,true)
        });
      }else{
        const callback = (user,res) =>{
          self.messageAdd(); 
       	};
       api.getAuthSetting(callback);  
     }
   }else{
      api.showToast('请补全信息','none',function(){
        api.buttonCanClick(self,true)
      });
      
   };
  },


  upLoadImg(){
    const self = this;
    if(self.data.submitData.mainImg.length>2){
      api.showToast('仅限3张','fail');
      return;
    };
    wx.showLoading({
      mask: true,
      title: '图片上传中',
    });
    const callback = (res)=>{
      console.log('res',res)
      if(res.solely_code==100000){

        self.data.submitData.mainImg.push({url:res.info.url})
        self.setData({
          web_submitData:self.data.submitData
        });
        wx.hideLoading()  
      }else{
        api.showToast('网络故障','none')
      }

    };

    wx.chooseImage({
      count:1,
      success: function(res) {
        console.log(res);
        var tempFilePaths = res.tempFilePaths;
        console.log(callback)
        api.uploadFile(tempFilePaths[0],'file',{tokenFuncName:'getEntranceToken'},callback)
      },
      fail: function(err){
        wx.hideLoading();
      }
    })
  },



  messageAdd(){
    const self =this;
    const postData = {};
    postData.tokenFuncName = 'getEntranceToken';
    postData.data = {};
    postData.data = api.cloneForm(self.data.submitData);
    postData.data.behavior = 0;
    const callback = (data)=>{
    	if(data.solely_code==100000){
    		api.showToast('投递成功','none')
    	}else{
    		api.showToast(data.msg,'none')
    	}
    	api.buttonCanClick(self,true)
    };
    api.messageAdd(postData,callback);
  },


})
