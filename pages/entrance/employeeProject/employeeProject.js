import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();


Page({

  data: {
    mainData:[],
    isFirstLoadAllStandard:['getMainData'],
  },

  onLoad: function () {
    const self = this;
    api.commonInit(self);  	
    self.getMainData();
  },


  getMainData(){
    const  self =this;
    const c_postData = {
      tokenFuncName:'getEntranceToken'
    };
    const c_callback = (res) =>{
      if(res){
        if(res.info.data[0].phone.length == 0){
          api.showToast('请补全信息','none',2000,function(){
          api.pathTo('/pages/entrance/userInfor/userInfor','redi')
        });
        return;
        }; 
        const postData={};
        postData.tokenFuncName='getEntranceToken';
        postData.paginate = api.cloneForm(self.data.paginate);
        postData.searchItem = {
          thirdapp_id:getApp().globalData.solely_thirdapp_id,
          client_no:wx.getStorageSync('entrance_info').user_no,
          user_type:2
        };
        const callback =(res)=>{
          if(res.info.data.length>0){
            self.data.mainData.push.apply(self.data.mainData,res.info.data);
          }else{
            self.data.isLoadAll = true;
            api.showToast('没有更多了','none');
          };
          api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
          self.setData({
            web_mainData:self.data.mainData,
          });
        };
        api.projectGet(postData,callback);
      }     
    } 
    api.userInfoGet(c_postData,c_callback)  
  },


  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll&&self.data.buttonCanClick){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },


})
