import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();

Page({
  data: {
    submitData:{
      price:''
    },
    buttonCanClick:true
  },
  
  onLoad(){
    const self = this;
    self.setData({
      web_buttonCanClick:self.data.buttonCanClick
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
    self.data.buttonCanClick =false;
    self.setData({
      web_buttonCanClick:self.data.buttonCanClick
    });
    const postData = {
      tokenFuncName:'getHotelToken',
      openid:wx.getStorageSync('hotel_info').openid,
      wxPay:self.data.submitData.price,
      wxPayStatus:0
    };

    if(JSON.stringify(postData.wxPay)=='{}'){
      api.showToast('空白充值','error');
      self.data.buttonCanClick = true;
      self.setData({
        web_buttonCanClick:true
      });
      return;
    };
  
    postData.payAfter=[];
    postData.payAfter.push(
      {
        tableName:'FlowLog',
        FuncName:'add',
        data:{
          count:self.data.submitData.price,
          trade_info:'充值',
          user_no:wx.getStorageSync('hotel_info').user_no,
          type:2,
          thirdapp_id:2
        }  
      },       
    );
    const callback = (res)=>{
      if(res.solely_code==100000){
        const payCallback=(payData)=>{

          if(payData==1){
            self.data.buttonCanClick = true;
            self.setData({
              web_buttonCanClick:true
            });
            api.showToast('充值成功','none');
          }
        };
        api.realPay(res.info,payCallback);   
      }else{
        api.showToast(res.msg,'none')
      };
    };
    api.directPay(postData,callback);
  },


})
