import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
    caseData:[],
    mainData:[],
    labelData:[],
    labelDataTwo:[],
    labelDataThree:[],
    isFirstLoadAllStandard:['getMainData','getLabelData','getCaseData'],
  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;
    api.commonInit(self);
    self.getLabelData();
    self.getMainData();
    token.getEntranceToken()
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
        tableName:'label',
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
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });
    };
    api.articleGet(postData,callback);
  },


  getLabelData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.solely_thirdapp_id,
      type:1,
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.labelData.push.apply(self.data.labelData,res.info.data);
        var length=self.data.labelData.length;
        for(var i=0;i<length;i++){
          if(self.data.labelData[i].title=='行业案例'){
             self.data.labelDataTwo.push(self.data.labelData[i].child);
             var child_length = self.data.labelData[i].child.length;
             console.log(909,self.data.labelData[i].child);
             for(var j=0;j<child_length;j++){
              if(self.data.labelData[i].child[j].child){
                for(var h=0;h<self.data.labelData[i].child[j].child.length;h++){
                  self.data.labelDataThree.push(self.data.labelData[i].child[j].child[h].id)
                }

              }
             }
          }
        }
      }else{
        api.showToast('没有更多了','fail');
      }
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getLabelData',self);
     self.getCaseData();
    };
    api.labelGet(postData,callback);   
  },

  getCaseData(){
    const self =this;
    const postData={};
    postData.searchItem ={
        thirdapp_id:getApp().globalData.solely_thirdapp_id,
    };
    postData.searchItem.menu_id = ['in',self.data.labelDataThree];
    const callback =(res)=>{
      if(res.info.data.length>0){
        self.data.caseData.push.apply(self.data.caseData,res.info.data);
        self.data.caseData=self.data.caseData.slice(0,4);
        
      }else{
        self.data.isLoadAll = true,
        api.showToast('没有更多了','fail');
      }
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getCaseData',self);
      self.setData({
        web_caseData:self.data.caseData,
      }); 
      console.log(1000,self.data.web_caseData);
    };
    api.articleGet(postData,callback);
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
          name: "西安纯粹云信息科技有限公司",
          address:"西安纯粹云信息科技有限公司",
          scale: 28
        })
      }
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

  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll&&self.data.buttonCanClick){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },
  
})

  