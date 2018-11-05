import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();
Page({
  data: {
    img:"background:url('/images/restaurant.png')",
  },

  onLoad: function () {
    this.setData({
      fonts:app.globalData.font
    })
  },

  onShow() {
    const self = this;
    self.data.mainData = api.jsonToArray(wx.getStorageSync('cartData'),'unshift');
    console.log(self.data.mainData)

    self.setData({

      web_mainData:self.data.mainData
    });
    self.countTotalPrice();
  },

  addOrder(){
    const self = this;
      const postData = {
        token:wx.getStorageSync('hotel_token'),
        sku:[
          {id:self.data.mainData.id,count:self.data.mainData.count}
        ],
        pay:{wxPay:self.data.totalPrice.toFixed(2)},
        type:1,
   
      };
      const callback = (res)=>{
        if(res&&res.solely_code==100000){
        
          self.data.order_id = res.info.id
          setTimeout(function(){
            wx.navigateTo({
              url:'/pages/restaurent/userPayment/userPayment?id='+self.data.order_id
            })
          },800)   
        }else{
          api.showToast('网络故障','none')
        }
        
      };
      api.addOrder(postData,callback);
      
  },



  countTotalPrice(){
    const self = this;
    var totalPrice = 0;
    var cartTotalCounts = 0;
    for(var i=0;i<self.data.mainData.length;i++){
      
        totalPrice += self.data.mainData[i].price*self.data.mainData[i].count;
        cartTotalCounts += self.data.mainData[i].count;
    
    };
    self.data.totalPrice = totalPrice;
    self.setData({
      web_cartTotalCounts:cartTotalCounts,
      web_totalPrice:totalPrice.toFixed(2),
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
})
