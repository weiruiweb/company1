import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();


Page({
  
  data: {
    mainData:[],
    index:0,
    currentId:18,
    sForm:{
      item:''
    },
    searchItem:{thirdapp_id:getApp().globalData.thirdapp_id},
    isFirstLoadAllStandard:['getMainData'],
  },
  
  onLoad(options) {
    const self = this;
    api.commonInit(self);
  
	self.getMainData()
  },



  menuTap(e){
    const self = this;
    api.buttonCanClick(self);
    var index = e.currentTarget.dataset.index;
    var currentId = e.currentTarget.dataset.id;

    self.setData({
      web_index:index,
      web_currentId:currentId,

    });
    console.log(currentId)
    console.log(index)

    self.getMainData(true,currentId)
  },


  search(e){
    const self = this;
    api.fillChange(e,self,'sForm');
    console.log('self.data.sForm.item',self.data.sForm.item)
    self.data.mainData = [];
    if(self.data.sForm.item){ 
      console.log(666) 
      self.data.searchItem.title =  ['LIKE',['%'+self.data.sForm.item+'%']],
      self.getMainData(true,self.data.sForm.item);
      
    }else{
      delete self.data.searchItem.title;
      console.log(666) 
      self.getMainData()
    };
    self.setData({
      web_sForm:self.data.sForm
    })
  },



  getMainData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.mall_thirdapp_id,
      type:3
    };
	postData.order = {
		create_time:'normal'
	}
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      };
	  var left_mainData = [];
	  var right_mainData = [];
      for (var i = 0; i < self.data.mainData.length; i++) {
      	if(self.data.mainData[i].child.length>0){
			for (var j = 0; j < self.data.mainData[i].child.length;j++) {	
				right_mainData.push(self.data.mainData[i].child[j])
			}
		}
      };
	  console.log('right_mainData',right_mainData)
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
		web_right_mainData:right_mainData
      });
    };
    api.labelGet(postData,callback);   
  },


  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathRedi(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  },

})
