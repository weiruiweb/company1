import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();


Page({
  data: {
   
    indicatorDots:true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    mainData:[],
    isFirstLoadAllStandard:['getSliderData','getMainData']
  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;
    api.commonInit(self);
    self.getSliderData();
    self.getMainData();
    self.setData({
      img:app.globalData.hotel,
    });
  },

  getSliderData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.hotel_thirdapp_id,
      title:'首页轮播',
    };
   
    const callback = (res)=>{
      if(res.info.data.length>0){ 
        self.setData({
          web_sliderUrl:res.info.data[0]['mainImg']
        });
          api.checkLoadAll(self.data.isFirstLoadAllStandard,'getSliderData',self)
      };
      
    };
    api.labelGet(postData,callback);
  },

  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self); 
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      thirdapp_id:getApp().globalData.hotel_thirdapp_id,
      title:'西安市'
    };
 
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];
        self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      }
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      console.log(self.data.mainData)
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    api.productGet(postData,callback);
  },



  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
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

  