import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
    couponData:[],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    currentId:0,
    mainData:[],
    isFirstLoadAllStandard:['getMainData','getSliderData']
  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;
    api.commonInit(self);
    self.setData({
      fonts:app.globalData.font,
      img:app.globalData.restaurant,
    })
    self.getSliderData();
    self.getMainData()
  },

  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self); 
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      thirdapp_id:getApp().globalData.restaurant_thirdapp_id,
      description:'特色推荐'
    };
   
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
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



  getSliderData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.restaurant_thirdapp_id,
      title:'首页轮播',
    }; 
    const callback = (res)=>{
      if(res.info.data.length>0){ 
        self.setData({
          web_sliderUrl:res.info.data[0]['mainImg']
        }); 
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getSliderData',self);
    };
    api.labelGet(postData,callback);
  },



  swiperChange(e) {
    const self = this;
    self.setData({
      swiperIndex: e.detail.current,
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

  