import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();
Page({
  data: {
    isChoose:1,
  },
  
  onLoad: function (options) {
    const self = this;
    console.log(options)
    self.setData({
      img:app.globalData.img,
    })
  },

  pay(order_id){
    const self = this;
    const postData = {
      token:wx.getStorageSync('hotel_token'),
      searchItem:{
        id:order_id
      },
      wxPay:self.data.totalPrice.toFixed(2),
      wxPayStatus:0
    };
    const callback = (res)=>{
      wx.hideLoading();
       if(res.solely_code==100000){
         const payCallback=(payData)=>{
          if(payData==1){
            setTimeout(function(){
              api.pathTo('/pages/restaurent/userOrder/userOrder','redi');
            },800)  
          };   
        };
        api.realPay(res.info,payCallback); 
      }else{
        api.showToast('网络故障','none')
      };
    };
    api.pay(postData,callback);
  },


   bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  },
  discount:function(){
    wx.navigateTo({
      url:'/pages/restaurant/discount/discount'
    })
  },
  choosePay:function(e){
    this.setData({
      isChoose:e.currentTarget.dataset.id
    })
  }
})
