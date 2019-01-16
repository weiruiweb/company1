//logs.js
import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
   mainData:[],
   isShowMore:false,
   isFirstLoadAllStandard:['getMainData'],
  },

  onLoad(options){
    const self = this;
    api.commonInit(self);
    self.getMainData();
   
  },


  getMainData(isNew){
    const  self =this;
    if(isNew){
      api.clearPageIndex(self)
    };
    const postData={};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      thirdapp_id:getApp().globalData.solely_thirdapp_id
    };
    postData.getBefore = {
      partner:{
        tableName:'label',
        searchItem:{
          title:['=',['热招职位']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    }
    const callback =(res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
        for (var i = 0; i < self.data.mainData.length; i++) {
          self.data.mainData[i].content = api.wxParseReturn(res.info.data[i].content).nodes;
        }
      }else{
        self.data.isLoadAll = true;
        self.data.isShowMore = false;
      };
      
      api.buttonCanClick(self,true);
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_isShowMore:self.data.isShowMore,
        web_mainData:self.data.mainData,
      });
    };
    api.articleGet(postData,callback);
  },

  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll&&self.data.buttonCanClick){
      self.data.isShowMore = true;
      self.setData({
        web_isShowMore:self.data.isShowMore
      })
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },


  intoMap(){
    const self = this;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
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
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },
})