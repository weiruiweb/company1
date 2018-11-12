import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();
var startX;
var startY;
var endX;
var endY;
var key;
var maxRight = 120;

Page({
   data: {
    dataId:'',
    mainData:[],
   
  },
  
  drawStart : function(e){
     // console.log("drawStart");
    var touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    var mainData = this.data.mainData;
    for(var i in mainData){
        var data = mainData[i];
        data.startRight = data.right;
    }
    key = true;
  },
  drawEnd : function(e){
    console.log("drawEnd");
    var dataIds = e.currentTarget.id;
    console.log(dataIds)
    var mainData = this.data.mainData;
    console.log(e);
    for(var i in mainData){
        var data = mainData[i];
        var res = mainData;
        if(data.right <= 120/2){
            // data.right = 0;
            data.trans = 'translate(30rpx)';

        }else{
            data.right = maxRight;
        }
    }
    
    // for(var i in mainData){
    //   var data = mainData[i];
    //   if(data.id == dataIds){
    //      if(data.right < 60){
    //       data.trans = 'translate(60rpx)';
    //      }else{
    //       // data.right = maxRight;
    //       data.trans = 'translate(-60rpx)';
    //      }
    //   }

    // }

 


    this.setData({
        mainData:mainData
    });

  },
  drawMove : function(e){
      //console.log("drawMove");
    var self = this;
    var dataId = e.currentTarget.id;
    var mainData = this.data.mainData;
    if(key){
        var touch = e.touches[0];
        endX = touch.clientX;
        endY = touch.clientY;
        // console.log("startX="+startX+" endX="+endX );
        if(endX - startX == 0)
           return ;
        var res = mainData;
           //从右往左

            if((endX - startX) < 0){
                for(var k in res){
                    var data = res[k];
                    if(res[k].id == dataId){
                        var startRight = res[k].startRight;
            
                        var change = startX - endX;
                        startRight += change;
                        if(startRight > maxRight)
                            startRight = maxRight;
                        res[k].right = startRight;
          
                       
                    }
                }
            }else{//从左往右
                for(var k in res){
                    var data = res[k];
                    if(res[k].id == dataId){
                        var startRight = res[k].startRight;
              
                        var change = endX - startX;
                        startRight -= change;
                        if(startRight < 0){
                            startRight = 0;
                            res[k].right = startRight ;
              
                        }
                    }
                }
            }
            self.setData({
                mainData:mainData
            });
                    
    }
  },
  //删除item
  delItem: function(e){
    var dataId = e.target.dataset.id;
    console.log("删除"+dataId);
    var mainData = this.data.mainData;
    var newCardTeams = []; 
    for(var i in mainData){
        var item = mainData[i];
        if(item.id != dataId){
          newCardTeams.push(item);
        }
    }
    this.setData({
        mainData:newCardTeams
     });
  },
  onLoad(options) {
    const self = this;
    if(getApp().globalData.user_discount){
      self.data.user_discount = getApp().globalData.user_discount
    }else{
      getApp().copyUser_discount = (res) => {
          self.data.user_discount = res.discount;
      };
    };
    self.setData({
      user_discount:self.data.user_discount
    })
    self.getMainData();
  },

  getMainData(){
    const self = this;
    //self.data.mainData = api.jsonToArray(wx.getStorageSync('collectData'),'unshift');
    self.data.mainData = api.getStorageArray('collectData');
    console.log('getMainData',self.data.mainData);
    self.setData({
      web_mainData:self.data.mainData,
    });
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  cancel(e){
    const self = this;
    console.log(api.getDataSet(e,'id'))
    api.deleteFootOne(api.getDataSet(e,'id'),'collectData');
    self.getMainData();
  },


})