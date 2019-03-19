//app.js
import { Token } from 'utils/token.js';
import { Api } from 'utils/api.js';
var api = new Api();

App({
  onLaunch: function () {
      // 展示本地存储能力
  //var token = new Token();
  //token.verify();
  },

  globalData: {
    mall_thirdapp_id:2,
    exhibition_thirdapp_id:26,
    hair_thirdapp_id:24,
    hotel_thirdapp_id:27,
    restaurant_thirdapp_id:25,
    solely_thirdapp_id:22,
    gym_thirdapp_id:12,
    address_id:'',
    buttonClick:false,
    coupon:{},
    paginate: {
        count: 0,
        currentPage:1,
        pagesize:10,
        is_page:true,
    },
    categoryIndex:'',
    userInfo: null,
    font:[{font:'font-size:20rpx'},{font:'font-size:22rpx'},{font:'font-size:24rpx'},{font:'font-size:28rpx'},{font:'font-size:30rpx'},{font:'font-size:32rpx'}],
    img:"background:url('http://www.solelytech.com/solelynet/images/small.png')",
    restaurant:"background:url('http://www.solelytech.com/solelynet/images/restaurant.png')",
    hair:"background:url('http://www.solelytech.com/solelynet/images/hair.png')",
    hotel:"background:url('http://www.solelytech.com/solelynet/images/hotel.png')",
    website:"background:url('http://www.solelytech.com/solelynet/images/website.png')",
    gym:"background:url('http://www.solelytech.com/solelynet/images/gym.png')",
  },



})