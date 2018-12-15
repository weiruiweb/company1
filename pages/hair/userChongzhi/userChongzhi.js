import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {

    submitData:{
      price:0
    },
    buttonCanClick:true
  },
  

  
  onLoad(){
    const self = this;
    self.setData({
      web_buttonCanClick:true
    })
  },





  changeBind(e){
    const self = this;
    api.fillChange(e,self,'submitData');
    console.log(self.data.submitData);
    self.setData({
      web_submitData:self.data.submitData,
    });  
  },


  pay(){
    const self = this;
    self.data.buttonCanClick = false;
    self.setData({
      web_buttonCanClick:true
    });
    const postData = {
      tokenFuncName:'getHairToken',
    };
    postData.data = {
      price:self.data.submitData.price
    };
    postData.pay = {};

      postData.pay = {
        wxPay:parseFloat(self.data.submitData.price),
        wxPayStatus:0,
      };
    
    if(JSON.stringify(postData.pay)=='{}'){
      api.showToast('空白充值','error');
      self.data.buttonCanClick = true;
      self.setData({
        web_buttonCanClick:true
      });
      return;
    };
    

    const callback = (res)=>{
      console.log(res)
      if(res.solely_code==100000){
         
        if(res.info){
            const payCallback=(payData)=>{
              if(payData==1){
                api.showToast('充值成功','none',function(){
                  api.pathTo('/pages/index/index','redi')  
                });
              }else{
                api.showToast('调起微信支付失败','none');
              };
   
              self.data.submitData.price = 0;

            };
            api.realPay(res.info,payCallback);    
        }else{
          api.showToast('充值成功','none',function(){
            api.pathTo('/pages/index/index','redi')  
          });
        };
      }else{
        api.showToast('充值失败','none');

        self.data.submitData.price = 0;

      }; 
      self.data.buttonCanClick = true;
      self.setData({
        web_buttonCanClick:true
      });
    }
    api.addVirtualOrder(postData,callback);
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 


})

