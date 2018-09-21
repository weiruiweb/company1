//index.js
//获取应用实例
const app = getApp()

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
    totalPrice:0

  },
  
  onLoad() {
    const self = this;
    console.log(this.data.windowHeight)
    this.setData({
      fonts:app.globalData.font
    });
    if(getApp().globalData.user_discount){
      self.data.user_discount = getApp().globalData.user_discount;
      self.data.user_level = getApp().globalData.user_level;
    }else{
      getApp().copyUser_discount = (res) => {
          self.data.user_discount = res.discount;
          self.data.user_level = res.user_level;
      };
    };
    self.setData({
      web_user_level:self.data.user_level,
      web_user_discount:getApp().globalData.user_discount
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




  onShow: function () {
    const self = this;
    self.data.mainData = api.jsonToArray(wx.getStorageSync('cartData'),'unshift');
    self.setData({
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
    api.updateFootOne(self.data.mainData[index].model_id,'cartData','count',self.data.mainData[index].count);
    self.setData({
      web_mainData:self.data.mainData
    });
    self.countTotalPrice();

  },

  choose(e){
    const self = this;
    const index = api.getDataSet(e,'index');
    if(self.data.mainData[index].isSelect == 'true'){
      self.data.mainData[index].isSelect = 'false';
    }else{
      self.data.mainData[index].isSelect = 'true';
    }
    console.log(self.data.mainData[index]);
    api.updateFootOne(self.data.mainData[index].model_id,'cartData','isSelect',self.data.mainData[index].isSelect)
    self.setData({
      web_mainData:self.data.mainData
    });
    self.countTotalPrice();
  },

  countTotalPrice(){
    const self = this;
    var totalPrice = 0;
    for(var i=0;i<self.data.mainData.length;i++){
      if(self.data.mainData[i].isSelect == 'true'){
        totalPrice += self.data.mainData[i].price*self.data.mainData[i].count
      }
    };
    if(self.data.user_level=='super'){
      totalPrice = totalPrice*self.data.user_discount/10;
    };
    self.setData({
      web_totalPrice:totalPrice.toFixed(2)
    })
  },



  check(){
    const self = this;
    const callback = res =>{
      const products = [];
      for(var i=0;i<self.data.mainData.length;i++){
        if(self.data.mainData[i].isSelect == 'true'){
          
          products.push(self.data.mainData[i]);
        }
      };
      console.log(products);
      wx.setStorageSync('payPro',products);
      api.pathTo('/pages/mine/order/cat/cat','nav')
    };
    api.checkPhoneCallback(callback);
  },
  
  confirmOrder:function(){
    wx.navigateTo({
      url: '/pages/confirmOrder/confirmOrder'
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
})
