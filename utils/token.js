// 引用使用es6的module引入和定义
// 全局变量以g_开头
// 私有函数以_开头


class Token {
    g_params={};

    constructor(params) {
        this.g_params = params;
    }

    verify() { 
        var token = wx.getStorageSync('token');
        if (!token) {
            this.getUserInfo();
        };
    }
    
    getEntranceToken(callback,postData) { 

        if((postData&&postData.refreshToken)||!wx.getStorageSync('entrance_token')){
            var params = {
                token_name:'entrance_token',
                info_name:'entrance_info',
                thirdapp_id:17
            };
            this.getUserInfo(params,callback);
        }else{
            return wx.getStorageSync('entrance_token');
        }
    }
    getMallToken(callback,postData) { 

        if((postData&&postData.refreshToken)||!wx.getStorageSync('mall_token')){
            var params = {
                token_name:'mall_token',
                info_name:'mall_info',
                thirdapp_id:2
            };
            this.getUserInfo(params,callback);
        }else{
            return wx.getStorageSync('mall_token');
        }
    }    

    getExhibitionToken(params) { 
        var exhibition_token = wx.getStorageSync('exhibition_token');
        var params ='exhibition'
        this.getUserInfo(params);
    }    

    getGymToken(params) { 
        var gym_token = wx.getStorageSync('gym_token');
        var params ='gym'
        this.getUserInfo(params);
    }    

    getHairToken(params) { 
        var hair_token = wx.getStorageSync('hair_token');
        var params ='hair'
        this.getUserInfo(params);
    }    

    getHotelToken(params) { 
        var hotel_token = wx.getStorageSync('hotel_token');
        var params ='hotel'
        this.getUserInfo(params);
    } 

    getRestaurantToken(params) { 
        var restaurant_token = wx.getStorageSync('restaurant_token');
        var params ='restaurant'
        this.getUserInfo(params);
    }

    getUserInfo(params,callback){
        var self = this;
        var wxUserInfo = {};
        if(wx.canIUse('button.open-type.getUserInfo')){
            wx.getSetting({
                success: res => {
                    if (res.authSetting['scope.userInfo']) { 
                        wx.getUserInfo({
                            success: function(res) {                  
                                wxUserInfo = res.userInfo;
                                self.getTokenFromServer(wxUserInfo,params,callback);                              
                            }
                        });
                    }else{
                        self.getTokenFromServer(wxUserInfo,params,callback);                        
                    };
                },
                fail: res=>{
                    wx.showToast({
                        title:'拉取微信失败',
                        icon:'fail',
                        duration:2000,
                        mask:true
                    })
                }
            });
        }else{
            wx.getUserInfo({
                success: function(res) {
                    wxUserInfo = res.userInfo;
                    self.getTokenFromServer(wxUserInfo,params,callback)                  
                }
            });
        };
        console.log(wxUserInfo)
    }


    getTokenFromServer(wxUserInfo,params,callback) {
        var self  = this;
        console.log('params',params);
        console.log('wxUserInfo',params);
        wx.login({
            success: function (res) {
                console.log(res)
                var postData = {};
                postData.thirdapp_id = params.thirdapp_id;  
                
                postData.code = res.code;
                if(wxUserInfo.nickName&&wxUserInfo.avatarUrl){
                    postData.nickname = wxUserInfo.nickName;
                    postData.headImgUrl = wxUserInfo.avatarUrl;
                };
                if(self.g_params&&self.g_params.parent_no){
                    postData.parent_no = self.g_params.parent_no;
                    console.log(self.g_params)
                };
                if(wx.getStorageSync('openidP')){
                    postData.openid = wx.getStorageSync('openidP');
                };
                console.log(postData)
                wx.request({
                    url: 'https://api.solelycloud.com/api/public/index.php/api/v1/Base/ProgrameToken/get',
                    method:'POST',
                    data:postData,
                    success:function(res){
                        console.log(res)
                        if(res.data&&res.data.solely_code==100000){
                            wx.setStorageSync(params.info_name,res.data.info);
                            wx.setStorageSync(params.token_name, res.data.token);
                            
                            if(callback){
                                callback && callback(res.data.token);
                            };      
                        }else{
                            wx.showToast({
                                title: '获取token失败',
                                icon: 'fail',
                                duration: 1000,
                                mask:true
                            });
                        };
                        
                        
                    }
                })
                
            }
        })
        
    }


    getToken(callback,params){

        if(wx.getStorageSync('login').login_name&&wx.getStorageSync('login').password){
            var postData = {
                login_name:wx.getStorageSync('login').login_name,
                password:wx.getStorageSync('login').password,
            }
            wx.request({
                url: 'https://api.solelycloud.com/api/public/index.php/api/v1/Func/Common/loginByUp',
                method:'POST',
                data:postData,
                success:function(res){
                    console.log(res)
                    if(res.data&&res.data.token){
                        wx.setStorageSync('threeToken', res.data.token);
                        var login = wx.getStorageSync('login');   
                        wx.setStorageSync('login',login);
                        if(params&&callback){  
                            params.data.token = res.data.token;
                             
                            callback && callback(params);
                        }else if(callback){
                            callback && callback(res);
                        };

                        
                    }else{
                        setTimeout(function(){
                            wx.showToast({
                                title: res.data.msg,
                                icon: 'fail',
                                duration: 1000,
                                mask:true
                            });
                        },500);

                       
                        wx.removeStorageSync('token');
                        wx.removeStorageSync('login');

                    }
                    
                    
                }
            })
        }else{
            wx.redirectTo({
              url: '/pages/Index/index'
            });
        };
        

    }
}

export {Token};