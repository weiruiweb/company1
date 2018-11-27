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
    isLoadAll:false,
    buttonCanClick:false
  },
  //事件处理函数
 
  onLoad(options) {
    wx.showLoading();
    const self = this;
    self.getLabelData();
    self.getMainData();
  },
  
  getMainData(){
    const  self =this;
    const postData={};
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
      api.checkLoadAll(self.data.isLoadAllStandard,'getMainData',self);
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
          }else{
            api.showToast('没有更多了','fail');
          }
        }
      }
      api.checkLoadAll(self.data.isLoadAllStandard,'getLabelData',self);
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
      api.checkLoadAll(self.data.isLoadAllStandard,'getCaseData',self);
      self.setData({
        web_caseData:self.data.caseData,
      }); 
      console.log(1000,self.data.web_caseData);
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

  