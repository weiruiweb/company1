import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();



Page({
  data: {
    isShow:false,
    logData:[],

    seriesRewardData:[],
    computeData:[],
    rewardScore:'',
    searchItem :{
      thirdapp_id:'59',
      type:3
    },
    isSign:false
  },


  onLoad(){
    const self = this;
    self.setData({
      fonts:getApp().globalData.font
    });   
    self.data.year = new Date().getFullYear();
    self.data.month = new Date().getMonth()+1;
    self.computeCalendar();
   
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.setData({
      web_rewardScore:self.data.rewardScore,
      
    }),
    self.getComputeData();
    
  },


  changeMonth(e){
    const self = this;
    var type = api.getDataSet(e,'type');

    if(type=='mins'){
      if(self.data.month==1){
        self.data.year--;
        self.data.month = 12;
      }else{
        self.data.month -= 1; 
      };
    }else{
      if(self.data.month==12){
        self.data.year++;
        self.data.month = 1;
      }else{
        self.data.month += 1;  
      };
      
    };
    self.computeCalendar();
  },

  computeCalendar(){
    const self = this;
    self.data.isAll = false;
    self.data.totalDay = new Date(self.data.year, self.data.month, 0).getDate();
    var d = new Date();
    d.setYear(self.data.year);
    d.setMonth(self.data.month-1);
    d.setDate(1);
    self.data.diffrence =  d.getDay();
    self.data.calendar = [];
    for (var i = 0; i < self.data.diffrence+self.data.totalDay; i++) {
      if(i<self.data.diffrence-1){
        self.data.calendar.push(0)
      }else{
        self.data.calendar.push(i-self.data.diffrence+1)
      }
    };
    self.setData({
      web_calendar:self.data.calendar,
      web_month:self.data.month,
      web_year:self.data.year
    });
    console.log( self.data.diffrence)
    self.getArtData();
  },



  signIn(){
    const self = this;
    var firstDayReward = 0;
    if(self.data.seriesRewardData[1]){
      firstDayReward = Number(self.data.seriesRewardData[1]);
    };
    if(self.data.seriesRewardData[self.data.constantSignDaysExcludeToday+1]){
      self.data.rewardScore = Number(self.data.seriesRewardData[self.data.constantSignDaysExcludeToday+1]);
    };
    console.log('constantSignDaysExcludeToday',self.data.constantSignDaysExcludeToday)
    if(!self.data.rewardScore){
      self.data.rewardScore = firstDayReward;
    }else if(self.data.constantSignDaysExcludeToday>0){
      self.data.rewardScore += firstDayReward;
    };
    console.log(self.data.rewardScore)
    const postData = {
      reward:{
        score:self.data.rewardScore
      },
      type:3,
      title:'签到成功'
    };

    postData.token = wx.getStorageSync('token'); 
    postData.saveAfter = [];
    if(self.data.distributionData.info.data.length>0){
      var transitionArray = self.data.distributionData.info.data;
      console.log(transitionArray);
      for (var i = 0; i < transitionArray.length; i++) {
        if(transitionArray[i].level==1){
          postData.saveAfter.push(
            {
              tableName:'FlowLog',
              FuncName:'add',
              data:{
                count:self.data.levelOne,
                trade_info:'下级签到积分奖励',
                user_no:transitionArray[i].parent_no,
                type:3,
                thirdapp_id:getApp().globalData.thirdapp_id
              }
            }
          );
        }else if(transitionArray[i].level==2){
          postData.saveAfter.push(
            {
              tableName:'flowLog',
              FuncName:'add',
              data:{
                count:self.data.levelTwo,
                trade_info:'下级签到积分奖励',
                user_no:transitionArray[i].parent_no,
                type:3,
                thirdapp_id:getApp().globalData.thirdapp_id
              }
            }
          );
        }
      }       
    };    
    console.log(postData);
    const callback = (res)=>{ 
      wx.hideLoading();
      if(res.solely_code==100000){
        self.sucssess();
        self.setData({
          web_rewardScore:self.data.rewardScore,
          web_rewardDay:self.data.constantSignDaysExcludeToday+1
        });
        self.data.isSign = true;
        self.setData({
          isSign:self.data.isSign
        });
        self.checkToday();   
        self.getComputeData();     
      }else{
        api.showToast('网络故障','none')
      };
    };
    api.signIn(postData,callback);
  },


  sucssess:function(){
    var isShow = !this.data.isShow
    this.setData({
      isShow:isShow
    })
  },



  distributionGet(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.searchItem = {
      child_no:wx.getStorageSync('info').user_no
    }
    const callback = (res)=>{
      self.data.distributionData = res;
      self.setData({
        web_distributionData:self.data.distributionData,
      });
      self.data.isAll = true;
      wx.hideLoading();
    };
    console.log('distri');
    api.distributionGet(postData,callback);
  },

  submit(){
    const self = this;
  
    if(wx.getStorageSync('info').info.length<=0){
      api.showToast('请补全信息','fail');
      setTimeout(function(){
      api.pathTo('/pages/userComplete/userComplete','redi');
      },1000);
    }else{
      if(self.data.todayData){
        if(self.data.todayData.length>0){
          api.showToast('今日已签到','fail');
        }else{
          wx.showLoading();
          const callback = (user,res) =>{
            if(self.data.isAll){
              self.signIn(user);  
            }else{
              api.showToast('请稍后重试','none')
            }    
          };
          api.getAuthSetting(callback);
        };
      }else{
        self.checkToday(self.submit());
      };
    };  
  },


  getMainData(maxNum){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.searchItem = api.cloneForm(self.data.searchItem);
    postData.searchItem.create_time = ['between',
      [    
        new Date(new Date().toLocaleDateString()).getTime()/1000 - (maxNum-1)*86400,
        new Date(new Date().toLocaleDateString()).getTime()/1000
      ]
    ];   
    postData.order={
      create_time:'desc'
    };
    const callback = (res)=>{
      self.data.logData = res.info.data;
      console.log('logData',self.data.logData)
      self.data.signData = [];
      for (var i = 0; i < self.data.logData.length; i++) {
        self.data.signData.push(parseInt(self.data.logData[i]['create_time'].slice(8,10)));
      };
      console.log('signData',self.data.signData)
      wx.hideLoading();
      self.setData({
        web_logData:self.data.logData
      });
      self.checkConstantSignDays(); 
      
    };
    api.logGet(postData,callback);
  },

  checkConstantSignDays(){
    console.log('checkTimes');
    const self = this;
    var constantSignDaysExcludeToday = 0;

    for (var i = 0; i < self.data.logData.length; i++) {
      var startTime = new Date(new Date().toLocaleDateString()).getTime()/1000 - 86400*(i+1);
      var endTime = new Date(new Date().toLocaleDateString()).getTime()/1000 - 86400*i;
      var itemTime = self.data.logData[i].create_time.replace('-', '/').replace('-', '/'); 
      var testTime = new Date(itemTime)/1000;
      console.log('startTime',startTime);
      console.log('endTime',endTime);
      console.log('testTime',testTime);
      if(testTime>=startTime&&testTime<=endTime){
        constantSignDaysExcludeToday++
      };
    };
    self.data.constantSignDaysExcludeToday = constantSignDaysExcludeToday;
    self.checkToday();  
  },

  checkToday(c_callback){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.searchItem = api.cloneForm(self.data.searchItem);
    postData.searchItem.create_time = ['between',[new Date(new Date().setHours(0, 0, 0, 0)) / 1000,new Date(new Date().setHours(0, 0, 0, 0)) / 1000 + 24 * 60 * 60-1]]
    const callback = (res)=>{
      self.data.todayData = res.info.data;
      if(self.data.todayData.length>0){
        self.data.signData.push(parseInt(self.data.todayData[0]['create_time'].slice(8,10)))
        self.data.isSign = true;
        console.log('checkToday',self.data.constantSignDaysExcludeToday)
        console.log('checkToday',self.data.constantSignDaysExcludeToday+1)
        self.setData({
          web_signData:self.data.signData,
          web_rewardDay:self.data.constantSignDaysExcludeToday+1,
          isSign:self.data.isSign
        });
      }else{
        self.setData({
          web_rewardDay:self.data.constantSignDaysExcludeToday,
          web_signData:self.data.signData
        });
      };
      
      self.distributionGet();
      c_callback&&c_callback();
    };
    api.logGet(postData,callback);
  },





  getArtData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      menu_id:'390',
      thirdapp_id:'59'
    };
    const callback = (res)=>{
      self.data.levelTwo = res.info.data[0].description;
      self.data.levelOne = res.info.data[0].small_title;
      self.data.artData = res.info.data[0];
      self.data.seriesRewardData = {};
      for (var i = 0; i < res.info.data[0].keywords.split(',').length; i++) {
        var c_num = res.info.data[0].keywords.split(',')[i].split(':')[0];
        self.data.seriesRewardData[c_num] = res.info.data[0].keywords.split(',')[i].split(':')[1]
      };
      wx.hideLoading();
      self.data.artData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      self.setData({
        web_artData:self.data.artData,
        web_seriesRewardData:self.data.seriesRewardData,
      }); 
      var maxNum = 0;
      for (var item  in self.data.seriesRewardData) {
        if(item > maxNum){
          maxNum = item 
        };
      };
      self.getMainData(maxNum);
      
    };
    api.articleGet(postData,callback);
  },

  getComputeData(){
    const self = this;
    const postData = {};
    postData.data = {
      FlowLog:{
        compute:{
          count:'sum',
        },
        
        searchItem:{
          user_no:wx.getStorageSync('info').user_no,
          type:3,
        }
      }
    };
    const callback = (res)=>{
      self.data.computeData = res;
      self.setData({
        web_computeData:self.data.computeData,
      });
      wx.hideLoading();
    };
    api.flowLogCompute(postData,callback);
  },

})

