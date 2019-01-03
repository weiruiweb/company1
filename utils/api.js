import { Base } from 'base.js';



class Api extends Base{


    


    realPay(param,callback){
        wx.requestPayment({
            'timeStamp': param.timeStamp,
            'nonceStr': param.nonceStr,
            'package': param.package,
            'signType': param.signType,
            'paySign': param.paySign,
            success: function (res) {
                console.log(res);
                wx.showToast({
                    title: '支付成功',
                    icon: 'success',
                    duration: 1000,
                    mask:true
                  });
                  
                callback && callback(1);
            },
            fail: function (res) {
                console.log(res);
                wx.showToast({
                    title: '支付失败',
                    icon: 'success',
                    duration: 1000,
                    mask:true
                });
                callback && callback(0);
            }
        });
    }
  


    labelGet(param,callback){
        var allParams ={
            url:'Common/Label/get',
            type:'post',
            noToken:true,
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }



    WxFormIdAdd(form_id,end_time){
        var allParams ={
            url:'Common/WxFormId/add',
            type:'post',
            data:{
                tokenFuncName:'getEntranceToken',
                form_id:form_id,
                end_time:end_time,
            },
        };
        this.request(allParams);       
    }

    upload(param,callback){
        var allParams ={
            url:'Base/FtpImage/upload',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }

    skuGet(param,callback){
        var allParams ={
            url:'Common/Sku/get',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);       
    }

    skuAdd(param,callback){
        var allParams ={
            url:'Common/Sku/add',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);       
    }

    skuDelete(param,callback){
        var allParams ={
            url:'Common/Sku/delete',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);       
    }

    skuUpdate(param,callback){
        var allParams ={
            url:'Common/Sku/update',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);       
    }

    projectGet(param,callback){
        var allParams ={
            url:'Common/Project/get',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);       
    }

    projectDelete(param,callback){
        var allParams ={
            url:'Common/Project/delete',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);       
    }

    projectAdd(param,callback){
        var allParams ={
            url:'Common/Project/add',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);       
    }

    projectUpdate(param,callback){
        var allParams ={
            url:'Common/Project/update',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);       
    }    


    processGet(param,callback){
        var allParams ={
            url:'Common/Process/get',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);       
    }

    processDelete(param,callback){
        var allParams ={
            url:'Common/Process/delete',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);       
    }

    processAdd(param,callback){
        var allParams ={
            url:'Common/Process/add',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);       
    }

    processUpdate(param,callback){
        var allParams ={
            url:'Common/Process/update',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);       
    }

    logGet(param,callback){
        var allParams ={
            url:'Common/Log/get',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);       
    }


    logAdd(param,callback){
        var allParams ={
            url:'Common/Log/add',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);       
    }

    logUpdate(param,callback){
        var allParams ={
            url:'Common/Log/update',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);       
    }

    logDel(param,callback){
        var allParams ={
            url:'Common/Log/delete',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);       
    }

    distributionGet(param,callback){
        var allParams ={
            url:'Common/Distribution/Get',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);       
    }    


    distributionUpdate(param,callback){
        var allParams ={
            url:'Common/Distribution/update',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);       
    }    


    distributionDelete(param,callback){
        var allParams ={
            url:'Common/Distribution/delete',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);       
    }    


    distributionAdd(param,callback){
        var allParams ={
            url:'Common/Distribution/add',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);       
    }


    getRank(param,callback){
        var allParams ={
            url:'Func/Common/getRankByUserInfo',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);       
    } 

    addOrder(param,callback){
        var allParams ={
            url:'Func/Order/addOrder',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);       
    } 


    signIn(param,callback){
        var allParams ={
            url:'Func/Common/signIn',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);       
    }

    getQrCode(param,callback){
        var allParams ={
            url:'Base/Qr/ProgramQrGet',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }      

    decryptWxInfo(param,callback){
        var allParams ={
            url:'Func/Common/decryptWxInfo',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }  



    pay(param,callback){
        var allParams ={
            url:'Base/Pay/pay',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }  


    changeCourseStatus(param,callback){
        var allParams ={
            url:'Project/Yts/changeCourseStatus',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }    


    labelDelete(param,callback){
        var allParams ={
            url:'Common/Label/Delete',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }    


    labelUpdate(param,callback){
        var allParams ={
            url:'Common/Label/update',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }    


    labelAdd(param,callback){
        var allParams ={
            url:'Common/Label/add',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }


    userInfoGet(param,callback){
        var allParams ={
            url:'Common/UserInfo/get',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }    


    userInfoDelete(param,callback){
        var allParams ={
            url:'Common/UserInfo/delete',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }    


    userInfoUpdate(param,callback){
        var allParams ={
            url:'Common/UserInfo/update',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }    


    userInfoAdd(param,callback){
        var allParams ={
            url:'Common/UserInfo/add',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }

    addressAdd(param,callback){
        var allParams ={
            url:'Common/UserAddress/add',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }

    addressGet(param,callback){
        var allParams ={
            url:'Common/UserAddress/get',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }

    addressUpdate(param,callback){
        var allParams ={
            url:'Common/UserAddress/update',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }

    addressDelete(param,callback){
        var allParams ={
            url:'Common/UserAddress/delete',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }


    userGet(param,callback){
        var allParams ={
            url:'Base/User/get',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }    


    userDelete(param,callback){
        var allParams ={
            url:'Base/User/delete',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }    


    userUpdate(param,callback){
        var allParams ={
            url:'Base/User/update',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }    


    userAdd(param,callback){
        var allParams ={
            url:'Base/User/add',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }


    productGet(param,callback){
        var allParams ={
            url:'Common/Product/get',
            type:'post',
            data:param,
            noToken:true,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }    


    productDelete(param,callback){
        var allParams ={
            url:'Common/Product/delete',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }    


    productUpdate(param,callback){
        var allParams ={
            url:'Common/Product/update',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }

    productAdd(param,callback){
        var allParams ={
            url:'Common/Product/add',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }


    skuAdd(param,callback){
        var allParams ={
            url:'Common/Sku/add',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }

    skuGet(param,callback){
        var allParams ={
            url:'Common/Sku/get',
            type:'post',
            data:param,
            noToken:true,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }    




    skuUpadate(param,callback){
        var allParams ={
            url:'Common/Sku/update',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }    


    articleAdd(param,callback){
        var allParams ={
            url:'Common/Article/add',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }

    articleGet(param,callback){
        var allParams ={
            url:'Common/Article/get',
            type:'post',
            data:param,
            noToken:true,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }    




    articleUpdate(param,callback){
        var allParams ={
            url:'Common/Article/update',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }  

    flowLogGet(param,callback){
        var allParams ={
            url:'Common/FlowLog/get',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }

    flowLogUpdate(param,callback){
        var allParams ={
            url:'Common/FlowLog/update',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }

    flowLogAdd(param,callback){
        var allParams ={
            url:'Common/FlowLog/add',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }

    flowLogCompute(param,callback){
        var allParams ={
            url:'Common/FlowLog/compute',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }  



    messageGet(param,callback){
        var allParams ={
            url:'Common/Message/get',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }

    messageUpdate(param,callback){
        var allParams ={
            url:'Common/Message/update',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }

    messageAdd(param,callback){
        var allParams ={
            url:'Common/Message/add',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }

    messageDelete(param,callback){
        var allParams ={
            url:'Common/Message/delete',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }

    orderDelete(param,callback){
        var allParams ={
            url:'Common/Order/delete',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }

    orderUpdate(param,callback){
        var allParams ={
            url:'Common/Order/update',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }

    orderGet(param,callback){
        var allParams ={
            url:'Common/Order/get',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }

    companyAuth(param,callback){
        var allParams ={
            url:'Project/Jzyz/companyAuth',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }  


    tokenGet(param,callback) {
        var allParams = {
            url:'token/user',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }

    directPay(param,callback){
        var allParams ={
            url:'Base/Pay/directPay',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);
    }

    addVirtualOrder(param,callback){
        var allParams ={
            url:'Func/Order/addVirtualOrder',
            type:'post',
            data:param,
            sCallback: function(data) {
                callback && callback(data);
            }
        };
        this.request(allParams);       
    } 



}

export {Api};