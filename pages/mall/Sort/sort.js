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
    clientHeight:'',
    heightArray:[],
    nowIndex:0,
    before_scrollTop:0,
    scrollTop:0,
    scrollClock:true
  },


  
  onLoad(options) {

    const self = this;
    self.setData({
      web_nowIndex:self.data.nowIndex
    });
    self.data.clientHeight = wx.getSystemInfoSync().windowHeight;
    console.log('self.clientHeight',self.clientHeight);
    api.commonInit(self);
	  self.getMainData();
   
    
    

  },



  menuTap(e){

    const self = this;
    var index = e.currentTarget.dataset.index;
    console.log('menuTap-index',index)
    if(index!=0){
      wx.pageScrollTo({
       scrollTop: self.data.heightArray[index] + self.data.clientHeight/3*2,
        duration:0
      });
      console.log('scrollTop',self.data.heightArray[index] + self.data.clientHeight/3*2)
    }else{
      wx.pageScrollTo({
       scrollTop:0,
       duration:0
      })
    };

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
  	};
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
    			for (var j = 0; j < self.data.mainData[i].child.length;j++){	
    				right_mainData.push(self.data.mainData[i].child[j]);
            self.data.mainData[i].child[j].index = right_mainData.length - 1;
    			};
		    };
      };
	    console.log('self.data.mainData',self.data.mainData);
      var totalHeight = 0;
      for (var i = 0; i < right_mainData.length; i++) {
        if(right_mainData[i].child){
          var height = 43 + self.data.clientHeight/100*2 + Math.ceil(right_mainData[i].child.length/2)*(self.data.clientHeight/100*6+100);
          console.log('height',self.data.clientHeight)
          if(height<self.data.clientHeight/100*86){
            height = self.data.clientHeight/100*86;
          };
        }else{
          var height = 0;
        };
        if(totalHeight>0){
          self.data.heightArray.push(parseFloat((totalHeight-self.data.clientHeight*2/3).toFixed(2)));
        }else{
          self.data.heightArray.push(0);
        };
        
        totalHeight += height;
      };
      
      console.log('heightArray',self.data.heightArray);
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

  testHeight(){
    //const query = wx.createSelectorQuery();
    //var res = query.select('#20').boundingClientRect();
    var res = document.getElementById('test');
    console.log('testHeight',res);   
  },

  onPageScroll:function(e){ // 获取滚动条当前位置
    console.log('onPageScroll',e);
    
    const self = this;
    self.data.scrollTop = e.scrollTop;
    var scrollTop = self.data.scrollTop;
    setTimeout(function(){self.changeScrollType(scrollTop)},50)
   
  },

  changeScrollType(scrollTop){
    const self = this;
    
    if(scrollTop==self.data.scrollTop){
      for (var i = 0; i < self.data.heightArray.length; i++) {
        if(self.data.scrollTop<self.data.heightArray[i]){
          self.data.nowIndex = i-1;
          this.setData({
            web_nowIndex:self.data.nowIndex
          });
          break;
        };
      };
      console.log('001changeScrollType');
    }
    
  },

  changeScrollDirect(e){
    console.log('changeScrollDirect',e)
    const self = this;
    for (var i = 0; i < self.data.heightArray.length; i++) {
      if(self.data.scrollTop<self.data.heightArray[i]){
        self.data.nowIndex = i-1;
        this.setData({
          web_nowIndex:self.data.nowIndex
        });
        break;
      };
    };
  },

  touchEnd: function(e) {
    const self = this;
    /*self.data.timeEvent = setInterval(function(){
      self.changeScrollType()
    },300);*/
  }
  

  















})
