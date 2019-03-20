import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();


Page({
  
  data: {
    labelData:[],
    mainData:[],
    index:0,
    currentId:18,
    isLoadAll:false,
    sForm:{
      item:''
    },
    searchItem:{thirdapp_id:getApp().globalData.thirdapp_id},
    isFirstLoadAllStandard:['getMainData','getLabelData'],
  },
  
  onLoad(options) {
    const self = this;
    api.commonInit(self);
    self.getLabelData();
    if(options.id&&options.index){
      self.data.currentId = options.id;
      self.data.index = options.index
    };
    console.log('options',options)
    self.setData({
      web_index:self.data.index,
      web_currentId:self.data.currentId
    });
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

  getMainData(isNew,currentId){
    const self = this;
    if(isNew){
      api.clearPageIndex(self); 
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = api.cloneForm(self.data.searchItem);
    if(currentId){
      postData.searchItem.parentid = currentId
    }else{
      postData.searchItem.parentid = self.data.currentId
    }

    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      };
      api.buttonCanClick(self,true);
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    api.labelGet(postData,callback);
  },

  getLabelData(){
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
        self.data.labelData.push.apply(self.data.labelData,res.info.data);
/* 				for (var i = 0; i < self.data.labelData.length; i++) {
					if(self.data.labelData[i].child.length>0){
						for (var j = 0; j < self.data.labelData[i].child.length; j++) {
							console.log(self.data.labelData[i].child[j])
						  if(self.data.labelData[i].child[j].child.length>0){
								for (var k = 0; k < self.data.labelData[i].child[j].child.length; k++) {
									self.data.mainData.push(self.data.labelData[i].child[j].child[k])
								}
							}
						}
					}
				} */
				console.log(self.data.mainData)
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      }
      console.log(self.data.labelData)
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getLabelData',self);
      self.setData({
        web_labelData:self.data.labelData,
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
