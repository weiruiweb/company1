//logs.js
import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();
Page({
  data: {
      
      index:0,
      array: ['病假', '事假','调休','年假','婚假','丧假','产假'],
      submitData:{
        leave_time:'',
        back_time:'',
        keywords:'',
        class:'',
        behavior:1,
        description:'',
        type:5
      },
      buttonCanClick:true
  },

  onLoad() {
    const self = this;
    self.data.today = new Date(new Date().toLocaleDateString()).getTime();
    console.log(self.data.selectData)
    self.setData({
      web_index:self.data.index,
      web_today:self.data.today,
      web_buttonCanClick:self.data.buttonCanClick
    })
  },

  bindPickerChange(e) {
    const self = this;
    console.log(parseInt(e.detail.value)+1);
    var index = e.detail.value;
    self.data.submitData.class = parseInt(e.detail.value)+1;
    this.setData({
      web_index: e.detail.value
    })
    console.log('self.data.submitData',self.data.submitData)
  },

  changeStartDate(e){
    const self = this;
    self.data.startDate = e.detail.value;
    self.setData({
      web_startDate:self.data.startDate
    })
  },

  changeStartTime(e) {
    const self = this;
  
    if(self.data.startDate){
      self.data.leave_time = self.data.startDate+' '+e.detail.value;
      self.data.submitData.leave_time = api.timeToTimestamp(self.data.leave_time)*1000;
      console.log(self.data.submitData.leave_time)
      self.setData({
        web_startTime:e.detail.value
      })
    }else{
      api.showToast('请选择起始日期','none',1000)
    };
    self.computHour()
  },

  changeEndDate(e){
    const self = this;
 
    self.data.endDate = e.detail.value;
    self.setData({
      web_endDate:self.data.endDate
    })
  },

  changeEndTime(e) {
    const self = this;

    if(self.data.endDate){
      self.data.back_time = self.data.endDate+' '+e.detail.value;
      self.data.submitData.back_time = api.timeToTimestamp(self.data.back_time)*1000;
      console.log(self.data.submitData.back_time)
      self.setData({
        web_endTime:e.detail.value
      })
    }else{
      api.showToast('请选择结束日期','none',1000)
    }
    self.computHour()
  },

  computHour(){
    const self = this;
    if(self.data.submitData.back_time&&self.data.submitData.leave_time){
      self.data.submitData.keywords = (self.data.submitData.back_time-self.data.submitData.leave_time)/3600000
    };
    self.setData({
      web_submitData:self.data.submitData
    })
  },

  submit(){
    const self = this;
    api.buttonCanClick(self);
    const pass = api.checkComplete(self.data.submitData);
    console.log('pass',pass);
    if(pass){
      self.messageAdd(); 
   }else{
      api.buttonCanClick(self,true)
      api.showToast('请补全信息','none') 
   };
  },

  messageAdd(){
    const self =this;
    const postData = {};
    postData.tokenFuncName = 'getEmployeeToken';
    postData.data = {};
    postData.data = api.cloneForm(self.data.submitData);
    const callback = (data)=>{
      if(data.solely_code==100000){
        api.showToast('申请成功','none',1000,function(){
          setTimeout(function(){
            wx.navigateBack({
              delta:1
            }) 
          },1000);  
        }) 
      }else{
        api.showToast(data.msg,'none',1000)
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
