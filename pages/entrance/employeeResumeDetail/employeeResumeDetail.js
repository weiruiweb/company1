
import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
    array_behavior:['邀面试', '拒绝', '待定', '入职'],
    submitData:{
      behavior:'',
      passage1:'',
    } ,
    mainData:[],
    isFirstLoadAllStandard:['getMianData'],
  },

  onLoad(options){
    const self = this;
    api.commonInit(self);
    self.data.id = options.id;
    self.getMianData();
    self.setData({
      web_buttonCanClick:self.data.buttonCanClick,
      web_submitData:self.data.submitData
    })
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
      thirdapp_id:getApp().globalData.solely_thirdapp_id,
      type:10,
      user_type:0,
    };
    postData.getAfter = {
      position:{
        tableName:'Article',
        middleKey:'relation_id',
        key:'id',
        searchItem:{
          status:1,
        },
        condition:'='
      }
    };
    const callback = (res)=>{ 
      if(res){
        self.data.mainData=res.info.data[0]; 
        console.log(999,self.data.mainData);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none') 
      };
      api.buttonCanClick(self,true);
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });
    
    };
    api.messageGet(postData,callback);
  },

  submit(){
    const self = this;
    api.buttonCanClick(self);
    const pass = api.checkComplete(self.data.submitData);
    if(pass){     
        self.messageUpdate(); 
     }else{
        api.showToast('请补全信息','none',1000)
        api.buttonCanClick(self,true)
     };
  },

  messageUpdate(){
    const self =this;
    const postData = {};
    postData.tokenFuncName = 'getEmployeeToken';
    postData.searchItem={
      id:self.data.id,
      user_type:0
    };
    postData.data = {};
    postData.data = api.cloneForm(self.data.submitData);
    const callback = (data)=>{
      if(data.solely_code==100000){
        api.showToast('简历处理成功','none',1000,function(){
          setTimeout(function(){
            wx.navigateBack({
              delta:1
            }) 
          },1000);  
        }) 
      }else{
        api.showToast(data.msg,'none')
      }
      api.buttonCanClick(self,true)
    };
    api.messageUpdate(postData,callback);
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
    const self = this;
    console.log(parseInt(e.detail.value)+1);
    var index = e.detail.value;
    self.data.submitData.behavior = parseInt(e.detail.value)+1;
    this.setData({
      web_index: e.detail.value
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
 
})

  