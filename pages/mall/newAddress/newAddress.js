import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({


  data: {
    region: ['陕西省', '西安市', '雁塔区'],
    sForm:{
      name:'',
      latitude:'',
      longitude:'',
      phone:'',
      detail:'',
    },
    id:'',
    
  },

  onLoad(options) {
    const self=this;
    api.commonInit(self);
    if(options.id){
      self.data.id = options.id
      self.getMainData(self.data.id); 
    }else{
      self.setData({
        web_region:self.data.region
      })
    };
    wx.hideLoading();
    
  },

  getMainData(id){
    const self = this;

    const postData = {};
    postData.searchItem = {};
    postData.searchItem.id = id;
    postData.tokenFuncName = 'getMallToken';
    const callback = (res)=>{
      console.log(res);
      self.data.mainData = res;
      self.data.sForm.phone = res.info.data[0].phone;
      self.data.sForm.name = res.info.data[0].name;
      self.data.sForm.detail = res.info.data[0].detail;
      const newRegion = [];
      newRegion.push(res.info.data[0].province);
      newRegion.push(res.info.data[0].city);
      newRegion.push(res.info.data[0].country);
      self.data.region = newRegion;
      self.setData({
        web_mainData:self.data.sForm,
        web_region:self.data.region
      })

    };
    api.addressGet(postData,callback);
  },


  inputChange(e){
    const self = this;
    api.fillChange(e,self,'sForm');
    self.setData({
      web_sForm:self.data.sForm,
    });  
  },

  bindRegionChange: function (e) {
    const self = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    self.data.sForm.province = e.detail.value[0];
    self.data.sForm.city = e.detail.value[1];
    self.data.sForm.country = e.detail.value[2];
    self.setData({
      web_region: e.detail.value
    })
  },


  addressUpdate(){
    const self = this;
    const postData = {};
    postData.tokenFuncName = 'getMallToken';
    postData.searchItem = {};
    postData.searchItem.id = self.data.id;
    postData.data = {};
    postData.data = api.cloneForm(self.data.sForm);
    const callback = (data)=>{
      if(data){
        api.dealRes(data);
      };
      api.buttonCanClick(self,true); 
    };
    api.addressUpdate(postData,callback);
  },
  

  addressAdd(){
    const self = this;
    const postData = {};
    postData.tokenFuncName = 'getMallToken';
    postData.data = {};
    postData.data = api.cloneForm(self.data.sForm);
    const callback = (data)=>{
      if(data){
        api.dealRes(data);
      };
       api.buttonCanClick(self,true); 
    };
    api.addressAdd(postData,callback);
  },
  

  submit(){
    const self = this;
    api.buttonCanClick(self,true);
    var phone = self.data.sForm.phone;
    const pass = api.checkComplete(self.data.sForm);
    if(pass){
      if(phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)){
        api.showToast('手机格式不正确','fail')
      }else{
        if(self.data.id){
          wx.showLoading();     
          self.addressUpdate();
        }else{
          wx.showLoading();
          self.addressAdd();
        }
        setTimeout(function(){
          wx.navigateBack({
            delta: 1
          });
        },300);  
      }
    }else{
      api.showToast('请补全信息','fail');
    };
  },

  chooseLocation:function(e){
    var self = this;
    wx.chooseLocation({
      success: function(res){
        self.data.sForm.detail = res.address,
        self.data.sForm.longitude = res.longitude,
        self.data.sForm.latitude = res.latitude,
        self .setData({
          hasLocation:true,
          location:{
            longitude:res.longitude,
            latitude:res.latitude
          },
          web_mainData:self.data.sForm,
          web_name:res.name,
        })
      },
      fail: function() {
      // fail
      },
      complete: function() {
      // complete
      }
    })
  },



  switch2Change(e){
    const self = this;
    console.log(e)
    if( e.detail.value == true){
      self.data.sForm.isdefault = 1
    }else{
      self.data.sForm.isdefault = 0
    }
    
  }

})
