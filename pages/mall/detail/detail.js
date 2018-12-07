import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();


Page({


  data: {
    
    mainData:[],
    chooseId:[],
    tabCurrent:0,
    isShow:false,
    complete_api:[],
    keys:[],
    values:[],    
    count:1,
    id:'',
    skuData:[],
    choosed_sku_item:[],
    can_choose_sku_item:[],
    skuLabelData:[],
    buttonType:'',
    buttonClicked:true,
    isInCollectData:false,
    is_collect:false,
    isFirstLoadAllStandard:['getMainData','getMessageData'],
    messageData:[],
  },

  onLoad(options){
    const self = this;
    api.commonInit(self);
    if(options.id){
      self.data.id = options.id;
    };
    //初始化购物车
    var cartData = api.getStorageArray('cartData');
    var cartRes = api.findItemInArray(cartData,'id',self.data.id);
    self.data.cart_count = cartRes.length>0?cartRes[1].count:0;
    //初始化收藏
    var collectData = api.getStorageArray('collectData');
    self.data.isInCollectData = api.findItemInArray(collectData,'id',self.data.id);

    wx.showShareMenu({
      withShareTicket: true
    });
    self.getMainData();
    self.getMessageData();
    self.setData({
      web_isInCollectData:self.data.isInCollectData,
      web_cart_count:self.data.cart_count,
      web_count:self.data.count,
    });
    
  },

  collect(){
    const self = this;  
    if(getApp().globalData.buttonClick){
      api.showToast('数据有误请稍等','none');
      setTimeout(function(){
        wx.showLoading();
      },800)   
      return;
    };
    if(self.data.isInCollectData){
      api.delStorageArray('collectData',self.data.choosed_skuData,'id'); 
    }else{
      api.setStorageArray('collectData',self.data.choosed_skuData,'id',999);
    };
    var collectData = api.getStorageArray('collectData');
    self.data.isInCollectData = api.findItemInArray(collectData,'id',self.data.id);
    self.setData({
      web_isInCollectData:self.data.isInCollectData,
    }); 
  },

  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.mall_thirdapp_id,
    };
    console.log(13,self.data.id);
    postData.getBefore={
      sku:{
        tableName:'sku',
        searchItem:{
          id:['in',[self.data.id]]
        },
        fixSearchItem:{
          status:1
        },
        key:'product_no',
        middleKey:'product_no',
        condition:'in',
      } 
    };
    postData.getAfter={
      sku:{
        tableName:'sku',
        middleKey:'product_no',
        key:'product_no',
        condition:'=',
        searchItem:{
          status:['in',[1]]
        },
      } 
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];

        for(var key in self.data.mainData.label){
            console.log('self.data.mainData.sku_array',self.data.mainData.sku_array)
          if(self.data.mainData.sku_array.indexOf(parseInt(key))!=-1){
            self.data.skuLabelData.push(self.data.mainData.label[key])
          };    
        };
        for (var i = 0; i < self.data.mainData.sku.length; i++) {
          if(self.data.mainData.sku[i].id==self.data.id){
            self.data.choosed_skuData = api.cloneForm(self.data.mainData.sku[i]);
            self.data.choosed_sku_item = api.cloneForm(self.data.mainData.sku[i].sku_item);
            var skuRes = api.skuChoose(self.data.mainData.sku,self.data.choosed_sku_item);
            self.data.can_choose_sku_item = skuRes.can_choose_sku_item;
            console.log('self.data.can_choose_sku_item',self.data.can_choose_sku_item)
          };
        };
        self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
  
      }else{
        api.showToast('商品信息有误','none');
      };
      console.log('getMainData',self.data.choosed_skuData);
      console.log('getMainDataweb_skuData',self.data.skuLabelData);

      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);

      self.setData({
        web_choosed_skuData:self.data.choosed_skuData,
        web_skuLabelData:self.data.skuLabelData,
        web_mainData:self.data.mainData,
        web_choosed_sku_item:self.data.choosed_sku_item,
        web_can_choose_sku_item:self.data.can_choose_sku_item,
      });

      /*sku逻辑说明
      被选中的sku数据choosed_skuData
      被选中的sku_item choosed_sku_item
      可供选择的sku_item can_choose_sku_item(包括被选中的sku_item)
       api.skuChoose(sku数据，被选中的sku_item)返回choosed_skuData，choosed_sku_item
      */

    };

    api.productGet(postData,callback);
  },

  chooseSku(e){
    const self = this;

    
    var id = api.getDataSet(e,'id');
    if(self.data.can_choose_sku_item.indexOf(id)==-1){
      return;
    };

    var index = self.data.choosed_sku_item.indexOf(id);
    if(index==-1){
      self.data.choosed_sku_item.push(id);
    }else{
      self.data.choosed_sku_item.splice(index,1);
    };
    var skuRes = api.skuChoose(self.data.mainData.sku,self.data.choosed_sku_item);
    self.data.choosed_skuData = skuRes.choosed_skuData;
    self.data.can_choose_sku_item = skuRes.can_choose_sku_item;

    self.data.count = 1;
    self.countTotalPrice();
    self.setData({
      web_choosed_sku_item:self.data.choosed_sku_item,
      web_choosed_skuData:self.data.choosed_skuData,
      web_can_choose_sku_item:self.data.can_choose_sku_item,
    });
    
  },


  //计算数量
  counter(e){

    const self = this;

    if(JSON.stringify(self.data.choosed_skuData)!='{}'){
      if(api.getDataSet(e,'type')=='+'){
        self.data.count++;
      }else if(self.data.choosed_skuData.count > '1'){
        self.data.count--;
      }
      self.data.choosed_skuData.count = self.data.count;
    }else{
      self.data.count = 1;
    };
    self.countTotalPrice();

  },

  //计算总价
  countTotalPrice(){  
    const self = this;
    var totalPrice = 0;
    if(JSON.stringify(self.data.choosed_skuData)!='{}'){
      totalPrice += self.data.count*parseFloat(self.data.choosed_skuData.price);
      self.data.totalPrice = totalPrice.toFixed(2);
    };
    self.data.totalPrice = totalPrice;
    self.setData({
      web_count:self.data.count,
      web_totalPrice:self.data.totalPrice
    });
  },

  bindManual(e) {
    const self = this;
    var count = e.detail.value;
    self.setData({
      web_count:count
    });
  },



  selectModel(e){
    const self = this;
    api.buttonCanClick
    self.data.buttonType = api.getDataSet(e,'type');
    console.log( self.data.buttonType)
    self.data.isShow = !self.data.isShow;
    self.setData({
      web_buttonType:self.data.buttonType,
      isShow:self.data.isShow
    })

  },

  addCart(e){
    const self = this;
    let formId = e.detail.formId;
    if(JSON.stringify(self.data.choosed_skuData)=='{}'){
      api.showToast('未选中商品','success');
      return;
    };
    self.data.choosed_skuData.count = self.data.count;
    self.data.choosed_skuData.isSelect = true;
    var res = api.setStorageArray('cartData',self.data.choosed_skuData,'id',999); 
    if(res){
      api.showToast('加入成功','success');
      self.data.isShow = !self.data.isShow;
      self.setData({
        isShow:self.data.isShow
      })
    };
    var cartData = api.getStorageArray('cartData');
    var cartRes = api.findItemInArray(cartData,'id',self.data.id);
    self.data.cart_count = cartRes.length>0?cartRes[1].count:0;
    self.setData({
      web_cart_count:self.data.cart_count,
    }); 
  },

  goBuy(){

    const self = this;
    api.buttonCanClick(self);
    
    if(JSON.stringify(self.data.choosed_skuData)=='{}'){
      api.showToast('未选中商品','success');
      return;
    };
    const postData = {
      tokenFuncName:'getMallToken',
    };
    const callback = (res)=>{
      console.log(res);
      if(res.info.data.length>0&&res.info.data[0].phone){
       
        const c_postData = {
          tokenFuncName:'getMallToken',
          sku:[
            {
              id:self.data.choosed_skuData.id,
              count:self.data.count
            }
          ],
          type:1
        };

        const c_callback = (res)=>{
          api.buttonCanClick(self,true);
          if(res&&res.solely_code==100000){
            api.pathTo('/pages/mall/confirmOrder/confirmOrder?order_id='+res.info.id,'nav');        
          }else{
            api.showToast(res.msg,'none');
          };
        };
        api.addOrder(c_postData,c_callback);

      }else{
        api.showToast('请完善信息','none');
        api.buttonCanClick(self,true);
        api.pathTo('/pages/mall/userInfo/userInfo','nav');
      };

    };
    api.userInfoGet(postData,callback); 
  },

  getMessageData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self); 
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.tokenFuncName='getMallToken',
    postData.searchItem = {
      relation_id:self.data.mainData.id,
      type:2
    };
    postData.order = {
      create_time:'desc'
    };
    postData.getAfter = {
      user:{
        tableName:'user',
        middleKey:'user_no',
        key:'user_no',
        searchItem:{
          status:1
        },
        condition:'='
      }
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.messageData.push.apply(self.data.messageData,res.info.data);
      }else{
        self.data.isLoadAll = true;
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMessageData',self);
      self.setData({
        web_num:res.info.total,
        web_messageData:self.data.messageData,
      });  
    };
    api.messageGet(postData,callback);
  },


  onShareAppMessage(res){
    const self = this
      console.log(res)
      if(res.from == 'button'){
        self.data.shareBtn = true;
      }else{   
        self.data.shareBtn = false;
      };
      return {
        title: '纯粹科技',
        path: 'pages/detail/detail?id='+self.data.id,
        success: function (res){
          console.log(res);
          console.log(parentNo)
          if(res.errMsg == 'shareAppMessage:ok'){
            console.log('分享成功')
            if (self.data.shareBtn){
              if(res.hasOwnProperty('shareTickets')){
              console.log(res.shareTickets[0]);
                self.data.isshare = 1;
              }else{
                self.data.isshare = 0;
              }
            }
          }else{
            wx.showToast({
              title: '分享失败',
            })
            self.data.isshare = 0;
          }
        },
        fail: function(res) {
          console.log(res)
        }
      }
  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  close(){
    const self = this;
    self.setData({
      isShow:false
    })
  },
  
  select_this(e){
    const self = this;
    self.setData({
      tabCurrent:e.currentTarget.dataset.current
    })
    console.log(self.data.tabCurrent)
  },

})
