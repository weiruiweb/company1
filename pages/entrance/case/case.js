import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
    is_show:false,
    currentId:0,
    currentId1:0,
    currentId2:0,
    mainData:[],
  },

  onLoad(){
    const self = this;
    self.getMainData();
    wx.showLoading();
  },
  getMainData(){
    const self =this;
    const postData={};
    postData.searchItem ={
        thirdapp_id:getApp().globalData.solely_thirdapp_id,
    };
    postData.getBefore={
      mainData:{
        tableName:'label',
        searchItem:{
          title:['=',['行业案例']]
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in'
      },

    };
    const callback =(res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data)
      }else{
        self.data.isLoadAll = true,
        api.showToast('没有更多了','fail');
      }
      wx.hideLoading();
      self.setData({
        web_mainData:self.data.mainData,
      }); 
    };
    api.articleGet(postData,callback);
  },
  menu(e){
     this.setData({
        is_show:true
      })
  },
  this_choose(e){
    this.setData({
      currentId:e.currentTarget.dataset.id,
    })
  },
  this_choose1(e){
    this.setData({
      currentId1:e.currentTarget.dataset.id,
    })
  },
  this_choose2(e){
    this.setData({
      currentId2:e.currentTarget.dataset.id,
      is_show:false,
    })
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

  