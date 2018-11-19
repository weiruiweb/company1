import {Api} from '../../../utils/api.js';
const api = new Api();
var app = getApp()
import {Token} from '../../../utils/token.js';


Page({

  data: {
    artData:[],
    mainData:[],
    logData:[],
    searchItem :{
      thirdapp_id:'12',
      type:4
    },
    id:'',
  },


  onLoad(){
    const self = this;
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getMainData();
    self.setData({
      img:app.globalData.gym,
    });
  },
  

  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self); 
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.token = wx.getStorageSync('gym_token');
    postData.searchItem = {
      thirdapp_id:'12',
      passage1:1,
      user_type:0
    };
    postData.order = {
      create_time:'desc'
    };
    postData.getAfter = {
      userInfo:{
        tableName:'user',
        middleKey:'user_no',
        key:'user_no',
        searchItem:{
          status:1
        },
        condition:'=',
        info:['nickname','headImgUrl']
      },
      praiseCount:{
        tableName:'log',
        middleKey:'id',
        key:'result',
        searchItem:{
          status:1,
        },
        condition:'=',
        compute:{
          pCount:[
            'count',
            'any',
            {
              status:1,
            }
          ]
        },
      },
      isPraise:{
        tableName:'log',
        middleKey:'id',
        key:'result',
        searchItem:{
          status:1,
          user_no:wx.getStorageSync('info').user_no
        },
        condition:'=',
        info:['id']
      }
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      wx.hideLoading();
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    api.messageGet(postData,callback);
  },


  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },


  intoPath(e){
    const self = this;
    wx.showLoading();
    const callback = (user,res) =>{
      api.pathTo(api.getDataSet(e,'path'),'nav');
    };
    api.getAuthSetting(callback);  
  },

  intoPathRedi(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  },




  addLog(message_id,index){
    const self = this;
    const postData ={};
    postData.data= {
      type:4,
      title:'点赞成功',
      result:message_id,
    };
    postData.token = wx.getStorageSync('gym_token');
    const callback = (res)=>{
      if(res.solely_code==100000){
        self.data.mainData[index].isPraise = {};
        self.data.mainData[index].isPraise.id = res.info.id;
        self.data.mainData[index].praiseCount.totalCount++;
        wx.hideLoading();
        self.setData({
          web_mainData:self.data.mainData
        }); 
      }else{
        api.showToast('点赞失败','fail');
      };
    };
    api.logAdd(postData,callback);
  },


  updateLog(log_id,index,type){
    const self = this;
    const postData ={
      searchItem:{
        id:log_id
      },
      data:{
        status:type
      }
    };
    postData.token = wx.getStorageSync('gym_token');
    const callback = (res)=>{
      if(res.solely_code==100000){
        if(type==1){
          self.data.mainData[index].isPraise['id'] = log_id;
          self.data.mainData[index].praiseCount.totalCount++;
        }else{
          self.data.mainData[index].isPraise = {};
          self.data.mainData[index].praiseCount.totalCount--;
        };
        self.setData({
          web_mainData:self.data.mainData
        });
      }else{
        api.showToast('点赞失败','fail');
      };

    };
    api.logUpdate(postData,callback);
  },


  getLogData(message_id,index){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('gym_token');
    postData.searchItem = {
      result:message_id,
      type:4,
      status:['in',[1,-1]]
    };
    const callback = (res)=>{
      if(res.info.data.length>0&&res.info.data[0].status==1){
        self.updateLog(res.info.data[0].id,index,-1);
      }else if(res.info.data.length>0&&res.info.data[0].status==-1){
        self.updateLog(res.info.data[0].id,index,1);
      }else{
        self.addLog(message_id,index);
      };
      self.setData({
        web_mainData:self.data.mainData
      });
    };
    api.logGet(postData,callback);

  },
  

  submit(e){
    const self = this;
    var praiseId = api.getDataSet(e,'log_id');
    var index = api.getDataSet(e,'index');
    
    if(praiseId){
      self.updateLog(praiseId,index,-1)
    }else{
      var message_id = api.getDataSet(e,'id');
      const callback = (user,res) =>{
        
        self.getLogData(message_id,index);
      };
      api.getAuthSetting(callback);
    }
  },



  previewImage(e){
    const self = this;
    var url = api.getDataSet(e,'url');
    var index = api.getDataSet(e,'index');
    console.log(index)
    var imgList = [];
    for (var i = self.data.mainData[index].mainImg.length - 1; i >= 0; i--) {
      imgList.push(self.data.mainData[index].mainImg[i].url)
    };
    console.log(imgList)
    wx.previewImage({
      current: url, 
      urls: imgList
    });
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