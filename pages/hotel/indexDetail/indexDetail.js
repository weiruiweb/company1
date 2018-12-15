import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {
    num:'',
    isShow:false,
    isFirstLoadAllStandard:['getMainData'],
    searchItem:{},
  },



  onLoad(options) {
    const self = this;
    api.commonInit(self);
    self.data.id = options.id;
    
    self.getMainData()
    self.setData({
      img:app.globalData.hotel,
    });
  },

  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.hotel_thirdapp_id,
      id:self.data.id
    };
    postData.getAfter={
      sku:{
        tableName:'sku',
        middleKey:'product_no',
        key:'product_no',
        condition:'=',
      } 
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];
        self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      }else{
        api.showToast('门店不存在','none');
      }
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      console.log(self.data.mainData)
      self.setData({
        web_skuData:self.data.mainData.sku[0],
        web_num:self.data.mainData.sku[0].id,
        web_mainData:self.data.mainData,
      });     
    };
    api.productGet(postData,callback);
  },  


  getSkuData(){
    const self = this;
    const postData = {};
    postData.searchItem = api.cloneForm(self.data.searchItem)
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.skuData = res.info.data[0];
        self.data.skuData.count = 1;
      }else{
        api.showToast('数据错误','none');
      }
      api.buttonCanClick(self,true);
      self.setData({
        web_skuData:self.data.skuData,
      });  
    };
    api.skuGet(postData,callback);
  },

  addOrder(){
    const self = this;
    api.buttonCanClick(self);
   
      self.data.buttonClicked = true;
      const postData = {
        tokenFuncName:'getHotelToken',
        sku:[
          {id:self.data.skuData.id,count:self.data.skuData.count}
        ],
        type:1,
        snap_address:self.data.submitData
      };
      const callback = (res)=>{
        if(res&&res.solely_code==100000){
          api.pathTo('/pages/hair/confirmOrder/confirmOrder?order_id='+res.info.id,'nav');        
        }else{
          api.showToast(res.msg,'none');
        };
      };
      api.addOrder(postData,callback);  
  },



  menuClick(e) {
    const self = this;
    api.buttonCanClick(self);
    const num = e.currentTarget.dataset.num;
    self.changeSearch(num);
  },


  changeSearch(num){
    const self = this;
    self.setData({
      web_num: num
    });
    self.data.searchItem.id = num;
    self.getSkuData();
  },

  show:function(e){
    var isShow = !this.data.isShow;
    this.setData({
      isShow:isShow
    })
  },

  close:function(e){
     this.setData({
      isShow:false,
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

  