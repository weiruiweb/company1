//logs.js
import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();
Page({
  data: {
    submitData:{
    	keywords:'',
    	description:'',
    	content:'',
    	mainImg:[],
    	type:4,
      // passage1:'',
      // passage2:'',
    },
    buttonCanClick:false,
  },
  onLoad() {
    const self = this;
    self.setData({
    	web_buttonCanClick:self.data.buttonCanClick,
      web_submitData:self.data.submitData,
    })
  },
  submit(){
    const self = this;
    api.buttonCanClick(self);
    const pass = api.checkComplete(self.data.submitData);
    if(pass){
      const callback = (res) =>{
          self.messageAdd(); 
       };
      api.getAuthSetting(callback);   
    }else{
      api.showToast('请补全信息','none');
      api.buttonCanClick(self,true);
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
    const callback = (data)=>{
    	if(data.solely_code==100000){
    		api.showToast('登记成功','none',1000,function(){
          setTimeout(function(){
            wx.redirectTo({
              url: '/pages/entrance/employeeRegister/employeeRegister'
            })
          },1000);  
        }) 
    	}else{
    		api.showToast(data.msg,'none')
    	}
    	api.buttonCanClick(self,true)
    };
    api.messageAdd(postData,callback);
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
})
