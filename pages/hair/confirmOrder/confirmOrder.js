import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();



Page({
  data: {

    mainData:[],
    addressData:[],
    userInfoData:[],
    idData:[],
    orderData:[],
    couponData:[],
    couponId:[],
    searchItem:{
      isdefault:1
    },
    submitData:{
      passage1:''
    },
    sForm:{
      score:0,
      balance:0 
    },
    scoreForm:{

    },
    searchItemTwo:{
      thirdapp_id:getApp().globalData.hair_thirdapp_id,
      user_no:wx.getStorageSync('hair_info').user_no,
      type:['in',[3,4]]
    },
    order_id:'',
    order_array:[],
    buyType:'delivery',
    isFirstLoadAllStandard:['getMainData','getAddressData','getUserData'],
    pay:{
      coupon:[]
    },
    couponTotalPrice:0

  },

  onLoad(options) {

    const self = this;
    api.commonInit(self);
    if(options.order_id){
      self.data.order_id = options.order_id;
      self.data.order_array = options.order_id.split(',');
    }else{
      api.showToast('数据传递有误','error');
    };
    self.setData({
      web_buyType:self.data.buyType
    });
    getApp().globalData.address_id = '';
    self.getMainData();
    self.getUserData();
  },

 

  onShow(){

    const self = this;
    self.data.searchItem = {};
    if(getApp().globalData.address_id){
      self.data.searchItem.id = getApp().globalData.address_id;
    }else{
      self.data.searchItem.isdefault = 1;
    };
    for (var i = 0; i < self.data.mainData.length; i++) {
      self.data.idData.push(self.data.mainData[i].id)
    };
    console.log(self.data.idData)
    self.getAddressData();
    self.getCouponData(true)

  },

  onUnload(){
    const self = this;
    wx.removeStorageSync('payPro');
  },


  getMainData(isNew){

    const self = this;
    if(isNew){
      api.clearPageIndex(self);
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.tokenFuncName = 'getHairToken';
    postData.searchItem = {
      id:['in',self.data.order_array]
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data;
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });     
      self.countPrice();
    };
    api.orderGet(postData,callback);

  }, 

  getUserData(){
    const self = this;
    const postData = {};
    postData.tokenFuncName = 'getHairToken';
    const callback = (res)=>{
      if(res.solely_code==100000){
        if(res.info.data.length>0){
          self.data.userData = res.info.data[0]; 
        }
        self.setData({
          web_userData:self.data.userData,
        });  
      }else{
        api.showToast('网络故障','none')
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getUserData',self);
    };
    api.userInfoGet(postData,callback);   
  }, 

  getCouponData(isNew){

    const self = this;
    if(isNew){
      api.clearPageIndex(self);
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.tokenFuncName = 'getHairToken';
    postData.searchItem = api.cloneForm(self.data.searchItemTwo)
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.couponData.push.apply(self.data.couponData,res.info.data);
      }else{
        self.data.isLoadAll = true;
      }
      self.setData({
        web_couponData:self.data.couponData,
      });  
      self.countPrice();
    };
    api.orderGet(postData,callback);

  },

  useCoupon(e){
    const self = this;
    var id = api.getDataSet(e,'id');
    var findCoupon = api.findItemInArray(self.data.couponData,'id',id);
    var findItem = api.findItemInArray(self.data.pay.coupon,'id',id);
    console.log('findCoupon',findCoupon)
    if(findCoupon){
      findCoupon = findCoupon[1];
      var findSameCoupon = api.findItemsInArray(self.data.pay.coupon,'product_id',findCoupon.products[0].snap_product.id);
    }else{
      api.showToast('优惠券错误','error');
      return;
    };
    if(findItem){
      self.data.pay.coupon.splice(findItem[0],1);
    }else{
      if((self.data.price-self.data.couponTotalPrice)<findCoupon.standard){
        api.showToast('金额不达标','error');
        return;
      };
      if(findCoupon.limit>0&&findSameCoupon.length>=findCoupon.limit){
        api.showToast('叠加使用超限','error');
        return;
      };
      if(findCoupon.type==3){
        var couponPrice = findCoupon.discount;
      }else if(findCoupon.type==4){
        var couponPrice = findCoupon.discount*self.data.price;
      };
      if(parseFloat(couponPrice)+parseFloat(self.data.couponTotalPrice)>parseFloat(self.data.price)){
        couponPrice = parseFloat(self.data.price).toFixed(2) - parseFloat(self.data.couponTotalPrice).toFixed(2);
      };
      self.data.pay.coupon.push({
        id:id,
        price:couponPrice,
        product_id:findCoupon.products[0].snap_product.id
      });
    };
    self.countPrice();
  },

  inputBind(e){
    const self = this;
    

    if(api.getDataSet(e,"key")=='score'){
      var testScore = api.getDataSet(e,"score");
      var orderItem_id = api.getDataSet(e,"orderItem_id");
      self.data.scoreForm[orderItem_id] = e.detail.value;
      self.data.scoreForm.score = 0;
      for(var key in self.data.scoreForm){
        self.data.sForm.score += self.data.scoreForm[key];
      };
      console.log('inputBind',self.data.sForm.score);
      if(self.data.sForm.score>self.data.userData.score||!testScore||(testScore&&self.data.sForm.score>testScore)){
        api.showToast('积分不符合规则','error');
        self.data.sForm.score = '';
        self.setData({
          web_sForm:self.data.sForm,
        }); 
        return;
      };
    };
    if(api.getDataSet(e,"key")=='balance'){
      api.fillChange(e,self,'sForm');
      if(self.data.sForm.balance>self.data.userData.balance){
        api.showToast('佣金不足','none')
        self.data.sForm.balance = '';  
        self.setData({
          web_sForm:self.data.sForm,
        }); 
        return;
      };
    };
    console.log('test',self.data.sForm);
    self.countPrice(); 

  },


  
  countPrice(){

    const self = this;
    var totalPrice = 0;
    var couponPrice = 0;
    var productsArray = self.data.mainData.products;
    self.data.couponTotalPrice = api.addItemInArray(self.data.pay.coupon,'price');
    self.data.price = api.addItemInArray(self.data.mainData,'price');
    console.log('self.data.price',self.data.price)
    if(self.data.sForm.score>0){
      self.data.pay.score = self.data.sForm.score
    };
    if(self.data.sForm.balance>0){
      self.data.pay.balance = self.data.sForm.balance
    };
    var wxPay = self.data.price - self.data.couponTotalPrice - parseInt(self.data.sForm.score) -parseInt(self.data.sForm.balance) ;
    if(wxPay>0){
      self.data.pay.wxPay = {
        price:wxPay.toFixed(2),
      };
    }else{
      delete self.data.pay.wxPay;
    };
    console.log('countPrice-wxPay',wxPay);
    console.log('countPrice-price',self.data.price);
    console.log('countPrice',self.data.pay);
    self.setData({
      web_couponPrice:parseFloat(self.data.couponTotalPrice).toFixed(2),
      web_price:parseFloat(self.data.price).toFixed(2),
      web_pay:self.data.pay
    });

  },






  getAddressData(){
    const self = this;
    const postData = {}
    postData.tokenFuncName = 'getHairToken';
    postData.searchItem = {isdefault:1};
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.addressData = res.info.data[0]; 
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getAddressData',self);
      self.setData({
        web_addressData:self.data.addressData,
      });
    };
    api.addressGet(postData,callback);
  },




  pay(order_id){

    const self = this;
    const postData = self.data.pay;
    postData.tokenFuncName = 'getHairToken';
    postData.searchItem = {
      id:self.data.order_id
    };

    const callback = (res)=>{
      if(res.solely_code==100000){
        if(res.info){
          const payCallback=(payData)=>{
            if(payData==1){
            
              api.showToast('支付成功','none');
            };   
          };
          api.realPay(res.info,payCallback); 
        }else{
          api.showToast('支付成功','none'); 
        };
      }else{
        api.showToast(res.msg,'none');
      };
      api.buttonCanClick(self,true);

    };
    api.pay(postData,callback);

  },



  chooseBuyWay(e){

    const self = this;
    console.log(e)
    var buyType = api.getDataSet(e,'buytype');
    self.data.buyType = buyType;
    console.log(self.data.buyType)
    self.setData({
      web_buyType:self.data.buyType
    });

  },

  checkboxChange(e) {
    const self = this;
    self.data.id = e.detail.value;
    console.log(self.data.id);
  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },


  changeBind(e){
    const self = this;
    api.fillChange(e,self,'submitData');
    console.log(self.data.submitData);
    self.setData({
      web_submitData:self.data.submitData,
    });  
  },


  submit(e){
    const self = this;
    api.buttonCanClick(self);
    if(self.data.buyType=='delivery'&&self.data.addressData.length==0){
      api.showToast('请选择收货地址','error');
      api.buttonCanClick(self,true);
      return;
    };
    self.pay();
  },


})