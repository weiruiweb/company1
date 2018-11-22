import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();


Page({
  data: {
     caseData:[],
     loadingHidden:false,
  },
   preventTouchMove :function(e) {
  },
  onLoad(options) {
    const self = this;
    setTimeout(function(){
     self.setData({
       loadingHidden: true
     });
    }, 2000);
    self.data.name = options.name;
    self.setData({
      fonts:app.globalData.font,
      img:app.globalData.img,
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
      token.getMallToken();
      console.log('getToken',sceneNew)
    };
  },

  getCaseData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.mall_thirdapp_id
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
      path: 'pages/mall/index/index?parentNo='+wx.getStorageSync('info').user_no,
      success: function (res){
        console.log(res);
      }
    }
  },


  about:function(){
    wx.navigateTo({
      url:'/pages/mall/about/about'
    })
  },
  sign:function(){
    wx.navigateTo({
      url:'/pages/mall/sign/sign'
    })
  },
  caseDetail:function(){
    wx.navigateTo({
      url:'/pages/mall/caseDetail/caseDetail'
    })
  },
  discount:function(){
    wx.navigateTo({
      url:'/pages/mall/discount/discount'
    })
  },
  shopping:function(){
     wx.redirectTo({
      url:'/pages/mall/Shopping/shopping'
    })
  },
  sort:function(){
     wx.redirectTo({
      url:'/pages/mall/Sort/sort'
    })
  },
  index:function(){
     wx.redirectTo({
      url:'/pages/mall/Index/index'
    })
  },
  User:function(){
     wx.redirectTo({
      url:'/pages/mall/User/user'
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
