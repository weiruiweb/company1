import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
    albumData:[],
    isLoadAll:false,
    complete_api:[]
  },
  
  onLoad() {
    const self = this;
    self.getAlbumData();

  },
  

  getAlbumData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.hair_thirdapp_id,
      title:'相册',
    };
   
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.albumData.push.apply(self.data.albumData,res.info.data[0]['mainImg']);
        
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      };
      self.data.complete_api.push('getAlbumData')
      self.setData({
        web_albumData:self.data.albumData
      });
      self.checkLoadComplete();
    };
    api.labelGet(postData,callback);
  },

  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },

  checkLoadComplete(){
    const self = this;
    var complete = api.checkArrayEqual(self.data.complete_api,['getAlbumData']);
    if(complete){
      wx.hideLoading();
    };
  },

})
