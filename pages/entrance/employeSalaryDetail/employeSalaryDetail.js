//logs.js
import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
   mainData:[],
   isFirstLoadAllStandard:['getMianData'],
	 flowData:[]
  },

  onLoad(options){
    const self = this;
    self.data.id = options.id;
    api.commonInit(self);
    self.getMainData();
  },


  getMainData(){
    const  self =this;
    const postData={};
		postData.tokenFuncName = 'getEmployeeToken';
    postData.searchItem = {
      thirdapp_id:getApp().globalData.solely_thirdapp_id,
      id:self.data.id,
    };
		postData.getAfter = {
		  user:{
				tableName:'UserInfo',
				middleKey:'relation_user',
				key:'user_no',
				condition:'=',
				searchItem:{
					status:1
				},
				info:['name']
			}
		};
    const callback =(res)=>{
      console.log(res);
			api.buttonCanClick(self,true);
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];
        self.data.mainData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      }else{
        api.showToast('数据错误',none,1000)
      };
      
     
      self.getFlowData()
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });
    };
    api.salaryGet(postData,callback);
  },
	
	getFlowData(){
	  const  self =this;
	  const postData={};
		postData.tokenFuncName = 'getEmployeeToken';
	  postData.searchItem = {
	    /* relation_user:wx.getStorageSync('entrance_info').user_no, */
	    relation_id:self.data.id,
	  };

	  const callback =(res)=>{
	    console.log(res);
			api.buttonCanClick(self,true);
	    if(res.info.data.length>0){
	      self.data.flowData.push.apply(self.data.flowData,res.info.data);
				
	    }else{
	      api.showToast('数据错误',none,1000)
	    };
	    self.setData({
	      web_flowData:self.data.flowData,
	    });
	  };
	  api.salaryFlowGet(postData,callback);
	},
	
	showPunish(){
		const self = this;
		self.data.isShowPunish = !self.data.isShowPunish;
	/* 	if(self.data.isShowPunish==true){
			self.data.isShowReward = false
		} */
		self.setData({
		
			web_isShowPunish:self.data.isShowPunish
		})
	},
	
	showReward(){
		const self = this;
		self.data.isShowReward = !self.data.isShowReward;
		/* if(self.data.isShowReward==true){
			self.data.isShowPunish = false
		}; */
		self.setData({
			web_isShowReward:self.data.isShowReward,
		
		})
	}
	
})