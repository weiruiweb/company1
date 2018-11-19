import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();



Page({


  data: {

    artData:[],
    submitData:{
      content:'',
      phone:'',
    },
    indicatorDots: true,
    autoplay: true,
    intervalOne:2000,
    duration: 1000,
  },


  onLoad(){
    const self = this;
    self.getArtData();
    self.setData({
      img:app.globalData.website
    });     
  },

  getArtData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.exhibition_thirdapp_id
    };
    postData.getBefore = {
      article:{
        tableName:'label',
        searchItem:{
          title:['=',['联系我们']],
          thirdapp_id:['=',[getApp().globalData.exhibition_thirdapp_id]],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback = (res)=>{
      self.data.artData = {};
      if(res.info.data.length>0){
        self.data.artData = res.info.data[0];
      };
      wx.hideLoading();
      self.setData({
        web_artData:self.data.artData,
      });  
    };
    api.articleGet(postData,callback);
  },

  messageAdd(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.data = {};
    postData.data = api.cloneForm(self.data.submitData);

    const callback = (data)=>{
      if(data.solely_code == 100000){
        api.showToast('留言成功','none');
      }else{
        api.showToast('网络故障','none');
      };
      self.data.submitData = {
        content:'',
        phone:'',
      };
      self.setData({
        web_submitData:self.data.submitData,
      });  
      wx.hideLoading(); 
    };
    api.messageAdd(postData,callback);     
  },

  submit(){
    const self = this;
    const pass = api.checkComplete(self.data.submitData);
    if(pass){
      self.messageAdd();
    }else{
      api.showToast('请补全信息','none');
    };
  },

  changeBind(e){
    const self = this;
    api.fillChange(e,self,'submitData');
    self.setData({
      web_submitData:self.data.submitData,
    });  
    console.log(self.data.submitData)
  },

 
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathRedi(e){
    const self = this;
    wx.navigateBack({
      delta:1
    })
  },
  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 
 
})

  