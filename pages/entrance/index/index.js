import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 2000,
    duration: 500,
    previousMargin: 0,
    swiperIndex:0,
    nextMargin: 0,
    sliderData:[],
    caseData:[],
    mainData:[],
    menu_array:[],
    labelData:[],
    labelDataTwo:[],
    labelDataThree:[],
    isFirstLoadAllStandard:['getMainData','getLabelData','getCaseData'],
  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;
    self.init();
    
  },
  init(){
    const self = this;
    api.commonInit(self);
    self.getLabelData();
    self.getMainData();
    self.getSliderData();
    
  },
  getSliderData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      title:'首页轮播',
      thirdapp_id:getApp().globalData.solely_thirdapp_id
    };
    const callback = (res)=>{ 
      console.log(1000,res);
      if(res.info.data.length>0){
       self.data.sliderData = res.info.data[0];
      }
      self.setData({
        web_sliderData:self.data.sliderData,
      });
      
    };
    api.labelGet(postData,callback);
  },
  
  getMainData(){
    const  self =this;
    const postData={};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      thirdapp_id:getApp().globalData.solely_thirdapp_id
    };
    postData.getBefore ={
     caseData:{
        tableName:'Label',
        searchItem:{
          title:['=',['推荐阅读']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback =(res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
        if(self.data.mainData.length>2){
          self.data.mainData = self.data.mainData.slice(0,2) 
        }
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });
    };
    api.articleGet(postData,callback);
  },


  getCaseData(){
    var self = this;
    var postData = {};
    postData.searchItem = {
			thirdapp_id:getApp().globalData.solely_thirdapp_id
		}
  	postData.getBefore ={
  		 	caseData:{
  		    tableName:'Label',
  		    searchItem:{
  		      parentid:['in',[146]]
  		    },
  		    middleKey:'menu_id',
  		    key:'id',
  		    condition:'in',
  			},
  	};
    var callback = (res) => {
      if(res.info.data.length>0){
        self.data.caseData.push.apply(self.data.caseData,res.info.data)
				if(res.info.data.length>4){
				  self.data.caseData = self.data.caseData.slice(0,4) 
				}
      }
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getCaseData',self);
  
      
      self.setData({
        web_caseData:self.data.caseData,

      })
    };
    api.articleGet(postData, callback);
  },


  getLabelData(isNew) {
    var self = this;
    if(isNew){
      api.clearPageIndex(self)
    };
    var postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = { 
        type: 1,
        thirdapp_id: 21,
        parentid:2
    };
    var callback = function(res) {
      if(res.info.data.length>0){
        self.data.labelData.push.apply(self.data.labelData,res.info.data)
      }
      for (var i = 0; i < res.info.data.length; i++) {
        self.data.menu_array.push(res.info.data[i].id)
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getLabelData',self);
      self.setData({
        web_labelData:self.data.labelData
      });
      self.getCaseData();
    };
    api.labelGet(postData,callback);
  },

  onPullDownRefresh(){
    const self = this;
    wx.showNavigationBarLoading(); 
    self.init();
  },


  intoMap(){
    const self = this;
    wx.getLocation({
      type: 'wgs84', //返回可以用于wx.openLocation的经纬度
      success: function (res) {  //因为这里得到的是你当前位置的经纬度
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({        //所以这里会显示你当前的位置
          longitude: 108.8939050000,
          latitude: 34.2377310000,
          //109.045249,34.325841
          name: "西安纯粹信息科技有限公司",
          address:"西安纯粹信息科技有限公司",
          scale: 28
        })
      }
    })
  },
  swiperChange(e) {
    const that = this;
    that.setData({
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

  