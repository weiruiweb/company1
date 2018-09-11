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
    thirdapp_id:2,
    address_id:'',
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

  },



})