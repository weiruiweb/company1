//logs.js
import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();
Page({
  data: {
    submitData:{
    	
    	description:'',
    	//content:'',
    	//mainImg:[],
    	type:4,
      //passage1:'',
      //passage2:'',
      behavior:1
    },
    isFirstLoadAllStandard:['getLocation'],
    enableScroll:false,
    buttonCanClick:true
  },

  onLoad() {
    const self = this;
    //api.commonInit(self);
    /*self.getLocation();*/
    self.setData({
      web_buttonCanClick:self.data.buttonCanClick
    });
  },

  submit(){
    const self = this;
    api.buttonCanClick(self);
    

    const pass = api.checkComplete(self.data.submitData);
    if(pass){
        self.messageAdd(); 
    }else{
      api.buttonCanClick(self,true);
      api.showToast('请填写外出缘由','none');
      
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
      sourceType:['camera'],
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
    postData.tokenFuncName = 'getEmployeeToken';
    postData.data = {};
    postData.data = api.cloneForm(self.data.submitData);
    postData.data.user_no = wx.getStorageSync('employeeInfo').user_no;
    const callback = (data)=>{
    	if(data.solely_code==100000){
    		api.showToast('登记成功','none',1000,function(){
          setTimeout(function(){
            wx.navigateBack({
              delta:1
            })
          },1000);  
        }) 
    	}else{
    		api.showToast(data.msg,'none',100)
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

/*  getLocation(){
    const self=this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        if(res.errMsg=="getLocation:ok"){
          self.data.submitData.passage1 = res.longitude
          self.data.submitData.passage2 = res.latitude
        };
        self.setData({
          web_submitData:self.data.submitData,
        }); 
      }
    });
    api.checkLoadAll(self.data.isFirstLoadAllStandard,'getLocation',self)
  },*/

  regionchange(e) {
    console.log(e.type)
  },

})
