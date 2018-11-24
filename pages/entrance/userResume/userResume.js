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
  submit:function(){
    const self = this;
    self.messageAdd();
  },
  messageAdd(){
    const self =this;
    const postData = {};
    postData.tokenFuncName = 'getEntranceToken';
    postData.data = {};
    postData.data = api.cloneForm(self.data.submitData);
    const callback = (data)=>{
        api.dealRes(data);
        self.data.submitData = {
          title:'',
          phone:'',
          content:'',
          keywords:'', 
          score:'',
          passage1:'',
          passage2:'',
        };
        self.setData({
          web_submitData:self.data.submitData
        });
      };
      api.messageAdd(postData,callback);
  }

})
