
import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
    mainData:[],
    isFirstLoadAllStandard:['getMianData','getLocation'],
    submitData:{
      content:'',
      mainImg:[],
      passage1:'',
      passage2:'',
    }
  },

  onLoad(options){
    const self = this;
    api.commonInit(self);
    self.data.id = options.id;
    self.getMianData();
    self.getLocation()
  },

  getMianData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self)
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.tokenFuncName = 'getEmployeeToken';
    postData.searchItem = {
      id:self.data.id,
      //thirdapp_id:getApp().globalData.solely_thirdapp_id,
      type:4,
    };
    const callback = (res)=>{ 
      if(res){
        self.data.mainData=res.info.data[0]; 
        self.data.submitData.description = res.info.data[0].description;
        self.data.submitData.mainImg = res.info.data[0].mainImg;
        self.data.submitData.passage1 = res.info.data[0].passage1;
        self.data.submitData.passage2 = res.info.data[0].passage2;
        self.data.submitData.content = res.info.data[0].content;

      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none') 
      };
      api.buttonCanClick(self,true);
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_submitData:self.data.submitData,
        web_mainData:self.data.mainData,
      });
    
    };
    api.messageGet(postData,callback);
  },


  submit(){
    const self = this;
    api.buttonCanClick(self);
    var newSubmitData = api.cloneForm(self.data.submitData);
    delete newSubmitData.content;
    console.log('newSubmitData',newSubmitData);
    const pass = api.checkComplete(newSubmitData);
    if(pass){
        self.messageUpdate(); 
    }else{
      api.buttonCanClick(self,true);
      api.showToast('请补全信息','none');
      
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

  messageUpdate(){
    const self =this;
    const postData = {};
    postData.tokenFuncName = 'getEmployeeToken';
 
    postData.searchItem = {
      id:self.data.id
    };
    if(self.data.mainData.behavior==1){
      postData.data = {
        arrive_time:new Date().getTime(),
        mainImg:self.data.submitData.mainImg,
        passage1:self.data.submitData.passage1,
        passage2:self.data.submitData.passage2,
        content:self.data.submitData.content,
        behavior:2
      }
    };
    if(self.data.mainData.behavior==2){
      postData.data = {
        leave_time:new Date().getTime(),
        content:self.data.submitData.content,
        mainImg:self.data.submitData.mainImg,
        behavior:3
      }
    };
    if(self.data.mainData.behavior==3){
      postData.data = {
        back_time:new Date().getTime(),
        content:self.data.submitData.content,
        behavior:4
      }
    };
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
    api.messageUpdate(postData,callback);
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

  getLocation(){
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
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    })
  },

  regionchange(e) {
    console.log(e.type)
  },

 
})

  