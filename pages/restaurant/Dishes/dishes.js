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
      isShow:false,
      labelData:[],
    mainData:[],
    count:1,
    num:79,
    isLoadAll:false,
    cartData:[],
    isFirstLoadAllStandard:['getMainData','getLabelData']
  },
  /*添加到购物车*/
    onAddingToCartTap:function(events){
        if(this.data.flayTo){
            return;
        }
        this._flyToCartEffect(events);
        console.log(events.scrollTop)
    },

    _flyToCartEffect:function(events){
        //获得当前点击的位置，距离可视区域左上角
        console.log(events);
        var touches=events.touches[0];
       
        var diff={
                x:-touches.clientX*0.805+'px',
                y:this.data.windowHeight-touches.clientY-125+'px',

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


   onLoad(options) {
    const self = this;
    api.commonInit(self);
    this.setData({
      fonts:app.globalData.font,
      img:app.globalData.restaurant,
    });
    self.data.id = options.id
    self.getLabelData();
    self.setData({
      web_num:self.data.num
    });

    var cartData = api.getStorageArray('cartData');
    var cartRes = api.findItemInArray(cartData,'id',self.data.id);
    self.data.cart_count = cartRes.length>0?cartRes[1].count:0;
   
  },

  onShow() {
    const self = this;
    self.data.cartData = api.jsonToArray(wx.getStorageSync('cartData'),'unshift');
    console.log(self.data.cartData)
    self.setData({
      web_cartData:self.data.cartData
    });
    self.countTotalPrice();
  },

  menuClick: function (e) {
    const self = this;
    api.buttonCanClick(self);
    const num = e.currentTarget.dataset.num;
    self.changeSearch(num);
  },


  changeSearch(num){
    const self = this;
    self.data.num = num;
    self.setData({
      web_num: num
    });
    
    self.getMainData(true);
  },

  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self); 
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.searchItem = {
      thirdapp_id:getApp().globalData.restaurant_thirdapp_id,
      category_id:self.data.num
    };
   
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      };
      api.buttonCanClick(self,true);
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getMainData',self);
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    api.productGet(postData,callback);
  },


  getLabelData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.restaurant_thirdapp_id,
      type:3
    };
    postData.order = {
      listorder:'normal'
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.labelData.push.apply(self.data.labelData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
      }
      api.checkLoadAll(self.data.isFirstLoadAllStandard,'getLabelData',self);
      self.setData({
        web_labelData:self.data.labelData,
      });
      self.getMainData();
    };
    api.labelGet(postData,callback);   
  },

  addCart(e){
    const self = this;
    var index = api.getDataSet(e,'index');
    var id = api.getDataSet(e,'id');
    self.data.mainData[index].count = self.data.count;
    var res = api.setStorageArray('cartData',self.data.mainData[index],'id',999); 
    if(res){
      api.showToast('加入成功','success');
    };
    var cartData = api.getStorageArray('cartData');
    var cartRes = api.findItemInArray(cartData,'id',id);
    self.data.cart_count = cartRes.length>0?cartRes[1].count:0;
    self.setData({
      web_cart_count:self.data.cart_count,
    }); 
    self.countTotalPrice()
  },

  


  countTotalPrice(){
    const self = this;
    var totalPrice = 0;
    var cartTotalCounts = 0;
    for(var i=0;i<self.data.cartData.length;i++){
      
        totalPrice += self.data.cartData[i].price*self.data.cartData[i].count;
        cartTotalCounts += self.data.cartData[i].count;
    
    };
    self.setData({
      web_cartTotalCounts:cartTotalCounts,
      web_totalPrice:totalPrice.toFixed(2),
    })
  },



  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathRedirect(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
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
