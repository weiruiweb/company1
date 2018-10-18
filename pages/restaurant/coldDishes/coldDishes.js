import {Api} from '../../../utils/api.js';
const api = new Api();
const app = getApp();
import {Token} from '../../../utils/token.js';
const token = new Token();


Page({
  data: {
    isTranslate:false,
    windowWidth: wx.getSystemInfoSync().windowWidth,
     windowHeight: wx.getSystemInfoSync().windowHeight,
     hiddenSmallImg:true,
      countsArray:[1,2,3,4,5,6,7,8,9,10],
      productCounts:1,
      currentTabsIndex:0,
      cartTotalCounts:0,
      isShow:false,

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
                x:-30-touches.clientY+'px',
                y:25+this.data.windowHeight-touches.clientY-180+'px',

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
  onLoad: function () {
    this.setData({
      fonts:app.globalData.font
    })
  },
  userInfo:function(){
    wx.navigateTo({
      url:'/pages/restaurant/userInfo/userInfo'
    })
  },
  dishesList:function(){
    wx.navigateTo({
      url:'/pages/restaurant/dishesList/dishesList'
    })
  },
  discount:function(){
    wx.navigateTo({
      url:'/pages/restaurant/discount/discount'
    })
  },
  address:function(){
    wx.navigateTo({
      url:'/pages/restaurant/manageAddress/manageAddress'
    })
  },
  order:function(){
    wx.navigateTo({
      url:'/pages/restaurant/userOrder/userOrder'
    })
  },
 shopping:function(){
     wx.redirectTo({
      url:'/pages/restaurant/Shopping/shopping'
    })
  },
  sort:function(){
     wx.redirectTo({
      url:'/pages/restaurant/Sort/sort'
    })
  },
  index:function(){
     wx.redirectTo({
      url:'/pages/restaurant/Index/index'
    })
  },
  User:function(){
     wx.redirectTo({
      url:'/pages/restaurant/User/user'
    })
  },
  menu_click:function(){
    var isTranslate = !this.data.isTranslate
    this.setData({
      isTranslate:isTranslate
    })
  },
  tabCont:function(){
    
      this.setData({
     
       isTranslate:false
      });

  },
  close:function(){
    // var isShow == !this.data.isShow
    this.setData({
      isShow:true
    })
  }
})
