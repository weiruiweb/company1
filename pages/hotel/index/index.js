import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();


Page({
  data: {
   	index:0,
   	index1:1,
    indicatorDots:true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    mainData:[],
    labelData:[],
    isFirstLoadAllStandard:['getSliderData','getMainData','getLabelData'],
    searchItem:{}
  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;
    api.commonInit(self);
    self.getSliderData();
    self.getLabelData();
    self.setData({
      web_index:self.data.index,
      web_index1:0,
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

  getLabelData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.hotel_thirdapp_id,
    };
    postData.getBefore = {
	  label:{
		tableName:'label',
		middleKey:'parentid',
		key:'id',
		searchItem:{
			title:['in',['城市']]
		},
		condition:'in'
	  }
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.labelData.push.apply(self.data.labelData,res.info.data);
        self.data.searchItem.category_id = self.data.labelData[0].id
      }else{
        self.data.isLoadAll = true;
      }
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getLabelData',self);
      self.getMainData();
      self.setData({
        web_labelData:self.data.labelData,
      });  
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
    postData.searchItem = api.cloneForm(self.data.searchItem);
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
        self.data.storeData = self.data.mainData[0];
        self.data.storeData.content = api.wxParseReturn(self.data.mainData[0].content).nodes;
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      }
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      console.log(self.data.mainData)
      self.setData({
      	web_storeData:self.data.storeData,
        web_mainData:self.data.mainData,
      });  
    };
    api.productGet(postData,callback);
  },



  cityChange(e) {
  	const self = this;
  	delete self.data.searchItem.id;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log(self.data.labelData[e.detail.value].id)
    self.data.searchItem.category_id = self.data.labelData[e.detail.value].id;

    self.setData({
      web_index:e.detail.value,   
    });
    self.getMainData(true)
  },

  storeChange(e) {
    const self = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    console.log(self.data.mainData[e.detail.value].id)
    self.data.searchItem.id = self.data.mainData[e.detail.value].id;
    self.setData({
      web_index1:e.detail.value,   
    });
    self.getMainData(true)
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

  