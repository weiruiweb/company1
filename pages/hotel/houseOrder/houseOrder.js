import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {
    is_select:0,
    isShow:false,
    is_discount:0,
    isFirstLoadAllStandard:['getartData'],
    submitData:{
      phone:'',
      name:'',
    }
  },
  //事件处理函数
  
  onLoad(options) {
    const self = this;
    api.commonInit(self);
    if(options.order_id){
      self.data.order_id = options.order_id;
      self.data.order_array = options.order_id.split(',');
    }else{
      api.showToast('数据传递有误','error');
    };
    self.getSkuData();
    self.getartData()
    self.setData({
      img:app.globalData.hotel,
    });
  },



  getartData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.hotel_thirdapp_id
    };
    postData.getBefore = {
      article:{
        tableName:'label',
        searchItem:{
          title:['=',['购买须知']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.artData = res.info.data[0];
        self.data.artData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getartData',self);
      self.setData({
        web_artData:self.data.artData,
      });  
    };
    api.articleGet(postData,callback);
  },

  counter(e){
    const self = this;
    
    if(api.getDataSet(e,'type')=='+'){
      self.data.skuData.count++;
      console.log(self.data.skuData)
    }else if(self.data.skuData.count > '1'){
      self.data.skuData.count--;
    }
    self.setData({
      web_skuData:self.data.skuData,
    });
    self.countTotalPrice();
  },


  changeBind(e){
    const self = this;
    api.fillChange(e,self,'submitData');
    console.log(self.data.submitData);
    self.setData({
      web_submitData:self.data.submitData,
    });  
  },



  pay(order_id){
    const self = this;
    const postData = {
      tokenFuncName:'getHotelToken',
      searchItem:{
        id:self.data.order_id
      },
      wxPay:{
        price:self.data.totalPrice.toFixed(2),
      },
      
      wxPayStatus:0
    };
    const callback = (res)=>{
      wx.hideLoading();
       if(res.solely_code==100000){
         const payCallback=(payData)=>{
          if(payData==1){
            setTimeout(function(){
              api.pathTo('/pages/hotel/userOrder/userOrder','redi');
            },800)  
          };   
        };
        api.realPay(res.info,payCallback); 
      }else{
        api.showToast('网络故障','none')
      };
      api.buttonCanClick(self,true)
    };
    api.pay(postData,callback);
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
    totalPrice += self.data.skuData.count*parseFloat(self.data.skuData.price);
    self.data.totalPrice = totalPrice;
    self.setData({
      web_totalPrice:self.data.totalPrice.toFixed(2)
    });
  },



  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 

  select:function(e){
     var current = e.currentTarget.dataset.id;
    this.setData({
      is_select:current
    })
  },
  select_discount:function(e){
     var current = e.currentTarget.dataset.id;
    this.setData({
      is_discount:current
    })
  },
  
  goBuy:function(){
    var isShow = !this.data.isShow;
    this.setData({
      isShow:isShow
    })
  },
  
  close:function(){
    this.setData({
      isShow:false
    })
  },
})

  