import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();

Page({
  data: {
    mainImg:[],
    submitData:{
      content:'',
      passage1:'',
      type:3,
      mainImg:[]
    },
  },
  
  onLoad(){
    const self = this;
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.setData({
      web_imgData:self.data.submitData.mainImg,
      img:app.globalData.img,
    });
  },

  messageAdd(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('gym_token');
    postData.data = {};
    postData.data = api.cloneForm(self.data.submitData);
    const callback = (data)=>{
      if(data.solely_code == 100000){
        api.showToast('发布成功','fail');
        api.pathTo('/pages/gym/send/send','rela');
      }else{
        api.showToast('发布失败','fail');
      };
      wx.hideLoading(); 
    };
    api.messageAdd(postData,callback);
      
  },

  menuClick: function (e) {
    const self = this;
    const num = e.currentTarget.dataset.num;
    self.submit(num);
  },

  changeBind(e){
    const self = this;
    api.fillChange(e,self,'submitData');
    self.setData({
      web_submitData:self.data.submitData,
    });  
    console.log(self.data.submitData)
  },

  submit(num){
    const self = this;
    if(wx.getStorageSync('gym_info').info.phone==''){
      api.showToast('请补全信息','fail');
      setTimeout(function(){
        api.pathTo('/pages/gym/userInfor/userInfor','nav');
      },1000);
    }else{
      self.data.submitData.passage1 = num;
      console.log(self.data.submitData)    
      wx.showLoading();
       self.messageAdd(); 
    } 
  },

  upLoadImg: function (){
    var self = this;

    if(self.data.submitData.mainImg.length>2){
      api.showToast('仅限3张','fail');
      return;
    };
    wx.showLoading({
      mask: true,
      title: '图片上传中',
    });
    var mainImg = self.data.mainImg
    wx.chooseImage({
      count:1,
      success: function(res) {
        console.log(res);
        var tempFilePaths = res.tempFilePaths
        
        wx.uploadFile({
          url: 'https://api.solelycloud.com/api/public/index.php/api/v1/Base/FtpImage/upload ',
          filePath:tempFilePaths[0],
          name: 'file',
          formData: {
            token:wx.getStorageSync('gym_token')
          },
          success: function(res){
            res = JSON.parse(res.data);
            self.data.submitData.mainImg.push({url:res.info.url})
            self.setData({
              web_imgData:self.data.submitData.mainImg
            });
            wx.hideLoading()

          },
          fail: function(err){
            wx.hideLoading();
            api.showToast('上传失败','fail')
          }
        })
      },
      fail: function(err){
        wx.hideLoading();
      }
    })
  },

})
