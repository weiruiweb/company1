import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();



Page({
  data: {
  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;
    self.data.id = options.id;
    self.getArtData()
  },

  getArtData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      id:self.data.id,
      thirdapp_id:getApp().globalData.gym_thirdapp_id
    }; 
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.artData = res.info.data[0];
      }    
      wx.hideLoading();
      self.data.artData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      self.setData({
        web_artData:self.data.artData,
      });  
    };
    api.articleGet(postData,callback);
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

  