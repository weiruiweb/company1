import {Api} from '../../utils/api.js';
const api = new Api();
var app = getApp()
import {Token} from '../../utils/token.js';


Page({
  data: {
     caseData:[]

  },
 
  onLoad(options) {
    const self = this;
    wx.showLoading();
    if(!wx.getStorageSync('token')){
      var token = new Token();
      token.getUserInfo();
    };
    self.setData({
      isHidden: false,
      fonts:app.globalData.font
    });
    self.getCaseData()

    if(options.scene){
      var scene = decodeURIComponent(options.scene)
    };
    if(options.parentNo){
      var scene = options.parentNo
    };
    if(options.passage1){
      var scene = options.passage1
    };
    
    if(scene){
      var num = scene.search('_');
      var sceneNew = scene.substring(0,scene.length-1);

      if(num==-1){
        var token = new Token({parent_no:scene}); 
      }else{
        var token = new Token({passage1:sceneNew}); 
      }   
      token.getUserInfo();
      console.log('getToken',sceneNew)
    }else{
      if(!wx.getStorageSync('token')){
        var token = new Token();
        token.getUserInfo();
        console.log('getToken')
      };
    }; 
  },

  getCaseData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id
    };
    postData.getBefore = {
      caseData:{
        tableName:'label',
        searchItem:{
          title:['=',['案例展示']],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.caseData.push.apply(self.data.caseData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      wx.hideLoading();
      self.setData({
        web_caseData:self.data.caseData,
      });
    };
    api.articleGet(postData,callback);
  },

  onShareAppMessage(res){
    const self = this;
    return {
      title: '直销商城',
      path: 'pages/index/index?parentNo='+wx.getStorageSync('info').user_no,
      success: function (res){
        console.log(res);
      }
    }
  },


  about:function(){
    wx.navigateTo({
      url:'/pages/about/about'
    })
  },
  sign:function(){
    wx.navigateTo({
      url:'/pages/sign/sign'
    })
  },
  caseDetail:function(){
    wx.navigateTo({
      url:'/pages/caseDetail/caseDetail'
    })
  },
  discount:function(){
    wx.navigateTo({
      url:'/pages/discount/discount'
    })
  },
  shopping:function(){
     wx.redirectTo({
      url:'/pages/Shopping/shopping'
    })
  },
  sort:function(){
     wx.redirectTo({
      url:'/pages/Sort/sort'
    })
  },
  index:function(){
     wx.redirectTo({
      url:'/pages/Index/index'
    })
  },
  User:function(){
     wx.redirectTo({
      url:'/pages/User/user'
    })
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
