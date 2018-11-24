import {Api} from '../../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();
Page({
  data: {
    is_show:false,
    currentId:0,
    currentId1:0,
    currentId2:0,
    mainData:[],
    submitData:{
      passage_array:[],
    },
    labelData:[],
    labelDataTwo:[],
    labelDataThree:[],
    currentText:'',
    searchData:[],
  },
  

  onLoad(){
    const self = this;
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    wx.showLoading();
    self.getLabelData();
  },

  getMainData(isNew){
    const self =this;
    if(isNew){
      api.clearPageIndex(self); 
    };
    const postData={};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem ={
        thirdapp_id:getApp().globalData.solely_thirdapp_id,
    };
    console.log(101,postData.searchItem.menu_id);
    if(self.data.searchData.length>0){
     postData.searchItem.menu_id = ['in',self.data.searchData]; 
   }else{
    postData.searchItem.menu_id = ['in',self.data.labelDataThree];
   }
    const callback =(res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true,
        api.showToast('没有更多了','fail');
      }
      wx.hideLoading();
      self.setData({
        web_mainData:self.data.mainData,
      }); 
      console.log(1000,self.data.web_mainData);
    };
    api.articleGet(postData,callback);
  },
  getLabelData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.solely_thirdapp_id,
      type:1,
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.labelData.push.apply(self.data.labelData,res.info.data);
        var length=self.data.labelData.length;
        for(var i=0;i<length;i++){
          if(self.data.labelData[i].title=='行业案例'){
             self.data.labelDataTwo.push(self.data.labelData[i].child);
             var child_length = self.data.labelData[i].child.length;
             console.log(909,self.data.labelData[i].child);
             for(var j=0;j<child_length;j++){
              if(self.data.labelData[i].child[j].child){
                for(var h=0;h<self.data.labelData[i].child[j].child.length;h++){
                  self.data.labelDataThree.push(self.data.labelData[i].child[j].child[h].id)
                }

              }
             }
          }else{
            api.showToast('没有更多了','fail');
          }
        }
      }
      wx.hideLoading();
      self.setData({
        web_labelDataTwo:self.data.labelDataTwo,
      });
     self.getMainData();
    };
    api.labelGet(postData,callback);   
  },
  menu(e){
     this.setData({
        is_show:true
      })
  },
  this_choose(e){ 
    const self = this;
    var text = e.currentTarget.dataset.text;
    var currentId = e.currentTarget.dataset.id;
    // self.data.currentId = currentId;
    // self.data.submitData.passage_array=[];
    // self.data.submitData.passage_array.push(text);
    // self.data.searchData = [];
    // self.data.searchData.push(currentId);
    var position = self.data.submitData.passage_array.indexOf(text);
    var position1 = self.data.searchData.indexOf(currentId);
    if(position>=0){
      self.data.submitData.passage_array.splice(position, 1); 
    }else{
     // self.data.submitData.passage_array=[];
      self.data.submitData.passage_array.push(text);
      console.log(self.data.submitData.passage_array)
    };
    if(position1>=0){
      self.data.searchData.splice(position1, 1);
    }else{
    //  self.data.searchData = [];
      self.data.searchData.push(currentId);
    }
    
    self.setData({
       web_submitData:self.data.submitData,
       web_searchData:self.data.searchData,
    });
    console.log(9090,self.data.searchData);
  },
  menu_hidden(){
    const self = this;
    self.getMainData(true);
    self.setData({
      is_show:false
    });

  },
  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
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

  preventTouchMove:function(e) {
  },
})

  