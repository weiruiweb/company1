//logs.js
import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();
Page({
  data: {
      web_startDate:2012-2-2,
      web_startTime:10,
      web_endDate:2012-2-2,
      web_endTime:10,
      index:0,
      array: ['类型1', '类型2'],
  },

  onLoad() {
    const self = this;

  },
  bindPickerChange(e) {
    this.setData({
      index: e.detail.value
    })
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
    self.data.startTime = e.detail.value;
    self.setData({
      web_startTime:self.data.startTime
    })
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
    self.data.endTime = e.detail.value;
    self.setData({
      web_endTime:self.data.endTime
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
