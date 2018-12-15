import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();



Page({
  data: {
    artData:[],
    indicatorDots: true,
    autoplay: true,
    intervalOne:2000,
    duration: 1000,
    isFirstLoadAllStandard:['getArtData']
  },


  onLoad(options){
    const self = this;
    api.commonInit(self);
    self.data.id = options.id;
    self.getArtData();
    self.setData({
      img:app.globalData.website
    });      
  },

  getArtData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      id:self.data.id,
      thirdapp_id:getApp().globalData.exhibition_thirdapp_id
    }; 
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.artData = res.info.data[0];
        self.data.artData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      }    
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getArtData',self);
      self.setData({
        web_artData:self.data.artData,
      });  
    };
    api.articleGet(postData,callback);
  },


})

  