//logs.js
import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
   mainData:[],
   urlSet:[],
   isFirstLoadAllStandard:['getMainData'],
  },

  onLoad(options){
    const self = this;
     self.data.id = options.id;
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
    postData.searchItem.id = self.data.id;
    const callback =(res)=>{
      if(res.info.data.length>0){
        self.data.mainData=res.info.data[0];
      }
      api.buttonCanClick(self,true);
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });
    };
    api.articleGet(postData,callback);
  },
  previewImg(e){
      const self = this;
      var index = e.currentTarget.dataset.index;
      console.log(999);
      if(self.data.mainData.bannerImg.length>0){
        for(var i=0;i<self.data.mainData.bannerImg.length;i++){
            self.data.urlSet.push(self.data.mainData.bannerImg[i].url);
        }
      }
      //console.log(self.data.urlSet)
      wx.previewImage({
        current: self.data.mainData.bannerImg[index].url,
        urls: self.data.urlSet,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    },
  onShareAppMessage(res){
    const self = this;
    if(self.data.buttonClicked){
      api.showToast('数据有误请稍等','none');
      setTimeout(function(){
        wx.showLoading();
      },800)   
      return;
    };
     console.log(res)
      if(res.from == 'button'){
        self.data.shareBtn = true;
      }else{   
        self.data.shareBtn = false;
      }
      return {
        title: self.data.mainData.title,
        path: 'pages/entrance/partnerDetail/partnerDetail?id='+self.data.id,
        success: function (res){
          console.log(res);
          console.log(parentNo)
          if(res.errMsg == 'shareAppMessage:ok'){
            console.log('分享成功')
            if (self.data.shareBtn){
              if(res.hasOwnProperty('shareTickets')){
              console.log(res.shareTickets[0]);
                self.data.isshare = 1;
              }else{
                self.data.isshare = 0;
              }
            }
          }else{
            wx.showToast({
              title: '分享失败',
            })
            self.data.isshare = 0;
          }
        },
        fail: function(res) {
          console.log(res)
        }
      }
  },
  addContact(){
    const self = this;
      wx.addPhoneContact({
        firstName: self.data.mainData.title,
        mobilePhoneNumber: self.data.mainData.contactPhone,
        success:function(){
            console.log('添加成功')
        }
    })
  },
  call_phone(){
    wx.makePhoneCall({
      phoneNumber: '18192654258'
    })
  },
  copyBtn: function (e) {
    const self = this;
    wx.setClipboardData({
      data: self.data.mainData.contactPhone,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      }
    });
  },
  intoPathRedi(e){
    const self = this;
    wx.navigateBack({
      delta:1
    })
  },

  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  }, 
  
})