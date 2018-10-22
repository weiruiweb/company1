import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();


Page({
  data: {
    windowWidth: wx.getSystemInfoSync().windowWidth,
    windowHeight: wx.getSystemInfoSync().windowHeight,
    hiddenSmallImg:true,
    countsArray:[1,2,3,4,5,6,7,8,9,10],
    productCounts:1,
    currentTabsIndex:0,
    cartTotalCounts:0,
    // input默认是1  
    num: 1,
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled',


    mainData:[],
    products:[],
    totalPrice:0,
    isChooseAll:'',
    img:"background:url('/images/small.png')",
  },
  
  onLoad() {
    const self = this;
    if(!wx.getStorageSync('mall_token')){
      var token = new Token();
      token.getUserInfo();
    };
    console.log(this.data.windowHeight)
    this.setData({
      fonts:app.globalData.font
    });
    
  },
  /*添加到购物车*/
    onAddingToCartTap:function(events){
      // var currentFly = e.currentTarget.dataset.id
      // this.setData({
      //       flayTo:currentFly 
      //   }); 
        //防止快速点击
        if(this.data.flayTo){
            return;
        }
        this._flyToCartEffect(events);
        
    },

    _flyToCartEffect:function(events){
        //获得当前点击的位置，距离可视区域左上角
        console.log(events);
        var touches=events.touches[0];
        var diff={
                x:-touches.clientX*0.3+'px',
                y:25+this.data.windowHeight-touches.clientY-140+'px',

            },

            style = 'display: block;-webkit-transform:translate('+diff.x+','+diff.y+') rotate(350deg) scale(0.3); opacity: 1;',  //移动距离
            style1 = '-webkit-transform:scale(1.1)'
          
            this.setData({
                flayTo:events.target.dataset.num,
                //isFly:events.target.dataset.num,
                translateStyle:style,
                shoppingStyle:style1,
            });
        var that=this;
        setTimeout(()=>{
            that.setData({
                flayTo:false,
                translateStyle:'-webkit-transform: none;',  //恢复到最初状态
                isShake:true,
                
            });
            setTimeout(()=>{
                var counts=that.data.cartTotalCounts+that.data.productCounts;
                that.setData({
                    isShake:false,
                    cartTotalCounts:counts
                });
            },200);
        },500);
    },




  onShow() {
    const self = this;
    self.data.mainData = api.jsonToArray(wx.getStorageSync('cartData'),'unshift');
    console.log(self.data.mainData)
    self.checkChooseAll()
    self.setData({
      web_isChooseAll:self.data.isChooseAll,
      web_mainData:self.data.mainData
    });
    self.countTotalPrice();
  },

  counter(e){
    const self = this;
    const index = api.getDataSet(e,'index');
    if(api.getDataSet(e,'type')=='+'){  
      self.data.mainData[index].count++;
    }else{
      if(self.data.mainData[index].count > '1'){
  
        self.data.mainData[index].count--;
      }
    };
    api.updateFootOne(self.data.mainData[index].id,'cartData','count',self.data.mainData[index].count);
    self.setData({
      web_mainData:self.data.mainData
    });
    self.countTotalPrice();
  },

  checkChooseAll(){
    const self = this;
    var isChooseAll = true;
    for (var i = 0; i < self.data.mainData.length; i++) {
      if(!self.data.mainData[i].isSelect){
        isChooseAll = false;
      };
    };
    self.data.isChooseAll = isChooseAll;
    self.setData({
      web_isChooseAll:self.data.isChooseAll
    });
  },

  chooseAll(){
    const self = this;
    self.data.isChooseAll = !self.data.isChooseAll;
    for (var i = 0; i < self.data.mainData.length; i++) {
      self.data.mainData[i].isSelect = self.data.isChooseAll;
      api.updateFootOne(self.data.mainData[i].id,'cartData','isSelect',self.data.mainData[i].isSelect)
    };
    self.setData({
      web_isChooseAll:self.data.isChooseAll,
      web_mainData:self.data.mainData
    });
    self.countTotalPrice();
  },

  delete(){
    const self = this;
    for(var i=0;i<self.data.mainData.length;i++){
      if(self.data.mainData[i].isSelect){
        api.deleteFootOne(self.data.mainData[i].id ,'cartData')
      }
    };
    self.data.mainData = api.jsonToArray(wx.getStorageSync('cartData'),'unshift');
    self.checkChooseAll();
    self.setData({
      web_isChooseAll:self.data.isChooseAll,
      web_mainData:self.data.mainData
    });
  },

  choose(e){
    const self = this;
    const index = api.getDataSet(e,'index');
    if(self.data.mainData[index].isSelect){
      self.data.mainData[index].isSelect = false;
    }else{
      self.data.mainData[index].isSelect = true;
    };
    api.updateFootOne(self.data.mainData[index].id,'cartData','isSelect',self.data.mainData[index].isSelect);

    self.setData({
      web_mainData:self.data.mainData
    });
    self.checkChooseAll();
    self.countTotalPrice();
  },

  countTotalPrice(){
    const self = this;
    var totalPrice = 0;
    var cartTotalCounts = 0;
    for(var i=0;i<self.data.mainData.length;i++){
      if(self.data.mainData[i].isSelect){
        totalPrice += self.data.mainData[i].price*self.data.mainData[i].count;
        cartTotalCounts += self.data.mainData[i].count;
      }
    };
    self.setData({
      web_cartTotalCounts:cartTotalCounts,
      web_totalPrice:totalPrice.toFixed(2),
    })
  },



  pay(){
    const self = this;
    const skuDatas = [];
    for(var i=0;i<self.data.mainData.length;i++){
      if(self.data.mainData[i].isSelect){
        skuDatas.push({
          id:self.data.mainData[i].id,
          count:self.data.mainData[i].count
        });
      }
    };
    console.log(skuDatas);
    wx.setStorageSync('payPro',skuDatas);
    api.pathTo('/pages/mall/confirmOrder/confirmOrder','nav')
  },






  
  confirmOrder:function(){
    wx.navigateTo({
      url: '/pages/mall/confirmOrder/confirmOrder'
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


  bindManual(e) {
    const self = this;
    var num = e.detail.value;
    this.setData({
      num: num
    });
  }  
  
})
