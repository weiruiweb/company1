/**
 * Created by jimmy-jiang on 2016/11/21.
 */

import { Token } from 'token.js';
var token = new Token();
var WxParse = require('../wxParse/wxParse.js');

class Base{
   
    //http 请求类, 当noRefech为true时，不做未授权重试机制
    request(params) {
        var that = this;
        getApp().globalData.buttonClick = true;
        var baseRestUrl = 'https://api.solelycloud.com/api/public/index.php/api/v1/';
        var url=baseRestUrl + params.url;
        const callback = (res)=>{
            that.request(params);
        };

        if(params.data.tokenFuncName){
            console.log('params.data.token');
            params.data.token = token[params.data.tokenFuncName](callback);
            console.log('params.data.token',params.data.token);
        };
        
        wx.request({
            url: url,
            data: params.data,
            method:params.type,
            /*header: {
                'content-type': 'application/json',
                'token': wx.getStorageSync('token')
            },*/
            success: function (res) {
                // 判断以2（2xx)开头的状态码为正确
                // 异常不要返回到回调中，就在request中处理，记录日志并showToast一个统一的错误即可
                var code = res.data.solely_code;
                if (res.data.solely_code == '200000') {

                    token[params.data.tokenFuncName](callback,{refreshToken:true});


                    /*var pages = getCurrentPages()    //获取加载的页面
                    var currentPage = pages[pages.length-1]    //获取当前页面的对象
                    var pages = currentPage.route;
                    console.log(pages);
                    var pagesArray = pages.split('/');
                    console.log(pagesArray)
                    
                    if(wx.getStorageSync('threeToken')&&params.data.token == wx.getStorageSync('threeToken')){
                        that.logOff();
                    }else{
                        console.log('pagesArray',pagesArray);
                        if(pagesArray[1]=='mall'){
                            
                            token.getMallToken('mall',callback);      
                        }else if(pagesArray[1]=='exhibition'){
                            token.getExhibitionToken(params,callback); 
                        }else if(pagesArray[1]=='gym'){
                            token.getGymToken(params,callback); 
                        }else if(pagesArray[1]=='hair'){
                            token.getHairToken(params,callback); 
                        }else if(pagesArray[1]=='hotel'){
                            token.getHotelToken(params,callback); 
                        }else if(pagesArray[1]=='restaurant'){
                            token.getRestaurantToken(params,callback);
                        }
                    };*/
                } else {
                    params.sCallback && params.sCallback(res.data);
                };
                getApp().globalData.buttonClick = false;
            },
            fail: function (err) {
                console.log(err)
                //wx.hideNavigationBarLoading();
                //that._processError(err);
                // params.eCallback && params.eCallback(err);
                wx.showToast({
                    title:'网络故障',
                    icon:'fail',
                    duration:2000,
                    mask:true,
                });
                getApp().globalData.buttonClick = false;
            }
        });

       
        
    }

    _processError(err){
        console.log(err);
    }

    _refetch(param) {
        var token = new Token();
        /*token.getTokenFromServer((token) => {
            this.request(param, true);
        });*/
    }

    /*获得元素上的绑定的值*/
    getDataSet(event, key) {
        return event.currentTarget.dataset[key];
    };

    checkArrayEqual(array1,array2){
        
        if(array1.sort().toString() == array2.sort().toString()){
            return true;
        }else{
            return false;
        }
        
    };


    /*wxParse插件返回函数*/
    wxParseReturn(data){
        return WxParse.wxParse('article', 'html', data, this);
    };

    cloneForm(form){
        var res =  JSON.parse(JSON.stringify(form));   
        return res;           
    };

    fillForm(form,pform){
        var res =  JSON.parse(JSON.stringify(form));
        for( var key in form){
            if(pform[key]){
                form[key] = pform[key];
            }
        };   
        return form;           
    };

    dealRes(res){
        if(res.solely_code == 100000){
            
            wx.showToast({
                title: res.msg,
                icon: 'succes',
                duration: 1000,
                mask:true
            });
            return true;

        }else{
            
            wx.showToast({
                title: res.msg,
                icon: 'fail',
                duration: 1000,
                mask:true
            });
            return false;
        }      
    };

    getToday(){
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    };

    getJsonLength(json){
        var length = 0;
        for(var item in json ){
            length++ 
        };
        return length;
    };

    jsonToArray(obj,type) {
        
        const result = [];
        for (let key in obj) {
            //result.push(key);
            if(type=='push'){
                result.push(obj[key]);
            };
            if(type=='unshift'){
                result.unshift(obj[key]);
            };
        };
        return result;
    };


    getStorageArray(storageName,key,value){
        const self = this;
        if(wx.getStorageSync(storageName)){
            var array = JSON.parse(wx.getStorageSync(storageName));
            if(key&&value&&array){
                var index = self.findItemInArray(array,key,value)[0];
                return array[index];
            }else if(array){
                return array;
            }else{
                return false;
            };
        }else{
            return [];
        };
    };

    setStorageArray(storageName,item,key,limit,type='unshift'){

        const self = this;
        if(wx.getStorageSync(storageName)){
            var array = JSON.parse(wx.getStorageSync(storageName));
            if(array.length<limit){
                self.setItemInArray(array,item,key,type);
            }else{
                if(type=='unshift'){
                    array.splice(array.length-1,1);
                }else{
                    array.splice(0,1);
                };
                self.setItemInArray(array,item,key,type);
            };
        }else{
            var array = [];
            array[type](item);
        };
        array = JSON.stringify(array);
        wx.setStorageSync(storageName,array);
        return true;

    };

    delStorageArray(storageName,item,key){

        const self = this;
        var array = JSON.parse(wx.getStorageSync(storageName));
        var index = self.findItemInArray(array,key,item[key])[0];
        array.splice(index,1);
        array = JSON.stringify(array);
        wx.setStorageSync(storageName,array);
        return true;

    };



    findItemInArray(array,fieldName,field){

        for(var i=0;i<array.length;i++){
            if(array[i][fieldName] == field){
                return [i,array[i]];
            }
        };
        return false;

    };

    setItemInArray(array,item,fieldName,type='push'){
        var findI = -1;
        for(var i=0;i<array.length;i++){
            if(array[i][fieldName] == item[fieldName]){
                findI = i;
            };
        };
        if(findI>=0){
            array[findI] = item;
        }else{
            array[type](item);
        };
        return array;
    };

    footOne(res,name,limit,objName){
        const self = this;
        if(wx.getStorageSync(objName)){
          var history = wx.getStorageSync(objName);
          var limitSum = self.getJsonLength(history);
          console.log(limitSum);
          
          if(history[res[name]]){
            history[res[name]] = res;
            wx.setStorageSync(objName,history);
          }else{
            if(limitSum < limit){
              history[res[name]] = res;
            }else{
              const historyArray = self.jsonToArray(history,'push');
              historyArray.splice(0,1);
              historyArray.push(res);
              var history = {};
              for(var i=0;i<historyArray.length;i++){
                history[historyArray[i][name]] = historyArray[i];
              };
            }
            wx.setStorageSync(objName,history);
          }
          
        }else{
          var history = {};
          history[res[name]] = res;
          wx.setStorageSync(objName,history);
        }

    };

    updateFootOne(name,objName,fieldName,field){
        const self = this;
        if(wx.getStorageSync(objName)){
          var history = wx.getStorageSync(objName);
          console.log(history);
          if(history[name]){
            history[name][fieldName] = field;
            wx.setStorageSync(objName,history);
          }
        }else{
          return false;
        }

    };

    deleteFootOne(name,objName){
        const self = this;
        if(wx.getStorageSync(objName)){
          var history = wx.getStorageSync(objName);
          console.log(history);
          if(history[name]){
            delete history[name];
            wx.setStorageSync(objName,history);
          }
        }else{
          return false;
        }

    };

    footTwo(res,limit,objName){
        const self = this;
        if(wx.getStorageSync(objName)){
            var history = wx.getStorageSync(objName);
            var limitSum = history.length;
            if(limitSum < limit){
                history.unshift(res);
            }else{
                history.splice(limitSum-1,1);
                history.unshift(res);
            };
            wx.setStorageSync(objName,history);
        }else{
          var history = [];
          history.unshift(res);
          wx.setStorageSync(objName,history);
        }
    };

    skuChoose(skuData,choosed_sku_item){
        const self = this;

        var can_choose_sku_item = [];
        var choosed_skuData = {};

        for(var i=0;i<skuData.length;i++){ 
          if(JSON.stringify(skuData[i].sku_item.sort())==JSON.stringify(choosed_sku_item.sort())){
            choosed_skuData = self.cloneForm(skuData[i]);
            can_choose_sku_item = choosed_sku_item;
            break;
          }else{
            if(choosed_sku_item.length>0){
                for(var c_i=0;c_i<choosed_sku_item.length;c_i++){ 
                    if(skuData[i].sku_item.indexOf(choosed_sku_item[c_i])!=-1){
                        can_choose_sku_item.push.apply(can_choose_sku_item,skuData[i].sku_item);
                    };
                };
            }else{
                can_choose_sku_item.push.apply(can_choose_sku_item,skuData[i].sku_item);
            };
          };   
        };
        return {
            choosed_skuData:choosed_skuData,
            can_choose_sku_item:can_choose_sku_item
        };
    };

    intersectionInArray(array,array1){
        var newArray = [];
        for(var i=0;i<array.length;i++){ 
            if(array1.indexOf(array[i])!=-1){
                newArray.push(array[i])
            };   
        };
        return newArray;
    };


    clearPageIndex(self){
        self.data.paginate.currentPage = 1;
        self.data.isLoadAll = false;
        self.data.mainData = [];
        
    };


    fillChange(e,self,name){      
        const key = this.getDataSet(e,"key");
        const value = e.detail.value;
        self.data[name][key] = value;

    };


    checkComplete(obj){

        var pass = true;
        for(var key in obj){
          if(!obj[key]||JSON.stringify(obj[key])=='[]'){
            pass = false;
          };
        };
        return pass;

    };


    showToast(title,type,func){
        wx.showToast({
            title:title,
            icon:type,
            duration:1000,
            mask:true,
            complete:func
        })
    };

    pathTo(path,type){

        if(type=='nav'){
            wx.navigateTo({
                url:path
            });
        }else if(type=='tab'){
            wx.switchTab({
                url:path
            });
        }else if(type=='redi'){
            wx.redirectTo({
                url:path
            });
        }else if(type=='rela'){
            wx.reLaunch({
                url:path
            });
        }
        
    };

    

    arrayByItem(field,fieldName,array){

        for(var i=0;i<array.length;i++){
            if(array[i][fieldName] == field){
                return array[i];
            }
        }
    };

    getAuthSetting(callback){
        wx.getSetting({
            success: setting => {
              if(!setting.authSetting['scope.userInfo']){
                wx.hideLoading();
                this.showToast('授权请点击同意','fail');
              }else{
                token.getUserInfo();
                wx.getUserInfo({
                    success: function(user) {
                        callback&&callback(user.userInfo,setting);  
                    }
                });
                
              };
            }
        });
    };

    getAuthSettingOfImg(callback){
        wx.getSetting({
            success: setting => {
              if(!setting.authSetting['scope.writePhotosAlbum']){
                wx.hideLoading();
                this.showToast('授权请点击同意','fail');
              }else{
                wx.getUserInfo({
                    success: function(user) {
                        callback&&callback(user.userInfo,setting);  
                    }
                });

                
              };
            }
        });
    };

    checkTokenLogin(){
        const self = this;
        if(wx.getStorageSync('token')){   
           return wx.getStorageSync('login');
        }else{
          setTimeout(function(){
            self.pathTo('/pages/teacher/login/login','redi');
          },500);                
        }; 
    };

    checkTeacherLogin(){
        const self = this;
        if(wx.getStorageSync('login')&&wx.getStorageSync('token')&&wx.getStorageSync('type')==1){   
           return wx.getStorageSync('login');
        }else{
          setTimeout(function(){
            self.pathTo('/pages/teacher/login/login','redi');
          },500);                
        }; 
    };

    checkThreeLogin(){
        const self = this;
        if(wx.getStorageSync('login')&&wx.getStorageSync('threeToken')&&wx.getStorageSync('threeInfo')){   
           return wx.getStorageSync('login');
        }else{
          setTimeout(function(){
            self.pathTo('/pages/User/user','redi');
          },500);                
        }; 
    };

    checkStudentLogin(){
        const self = this;
        if(wx.getStorageSync('login')&&wx.getStorageSync('token')&&wx.getStorageSync('type')==0){   
           return wx.getStorageSync('login');
        }else{
          setTimeout(function(){
            self.pathTo('/pages/student/login/login','redi');
          },500);                
        }; 
    };

    checkLogin(userType){
        const self = this;
        if(userType){
            if(wx.getStorageSync('login')&&wx.getStorageSync('token')&&wx.getStorageSync('login').userType==userType){
                return wx.getStorageSync('login');
            }else{
                setTimeout(function(){
                    self.pathTo('/pages/user_center/login/login','redi');
                },500);
                
                return false;
            };
        }else{
            if(wx.getStorageSync('login')&&wx.getStorageSync('token')){
                return wx.getStorageSync('login');
            }else{
                setTimeout(function(){
                   self.pathTo('/pages/user_center/login/login','redi'); 
                },500);
                
                return false;
            };
        };

        
        wx.hideLoading();

    };


    extend(target, source) {

        for (var obj in source) {
            target[obj] = source[obj];
        }
        return target;
        
    };


    logOff(){
        const self = this;
        wx.removeStorageSync('login');
        wx.removeStorageSync('threeInfo');
        wx.removeStorageSync('threeToken');
        if(!wx.getStorageSync('login')){
            self.pathTo('/pages/User/user','tab')
        }else{
            self.showToast('系统故障','fail')
        }

    };


    timeToTimestamp(format){
    
        var mydata=format.replace('-', '/'); 
        mydata=mydata.replace('-', '/'); 
        return new Date(mydata)/1000;
        
    }



};





export {Base};
