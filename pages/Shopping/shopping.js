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

  },
  
  onLoad: function () {
    console.log(this.data.windowHeight)
    this.setData({
      fonts:app.globalData.font
    })
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
  }
})
