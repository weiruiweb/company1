import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();
Page({
  data: {
    
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

  counter(e){
    const self = this;
    const index = api.getDataSet(e,'index');
    if(api.getDataSet(e,'type')=='+'){  
      self.data.mainData[index].count++;
    }else{
      if(self.data.mainData[index].count > '1'){
  
        self.data.mainData[index].count--;
      }
    };
    api.updateFootOne(self.data.mainData[index].id,'cartData','count',self.data.mainData[index].count);
    self.setData({
      web_mainData:self.data.mainData
    });
    self.countTotalPrice();
  },

  

  bindManual(e) {
    const self = this;
    var count = e.detail.value;
    self.setData({
      count:count
    });
  },

  countTotalPrice(){
    const self = this;
    var totalPrice = 0;
    var cartTotalCounts = 0;
    for(var i=0;i<self.data.mainData.length;i++){
      
        totalPrice += self.data.mainData[i].price*self.data.mainData[i].count;
        cartTotalCounts += self.data.mainData[i].count;
    
    };
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
