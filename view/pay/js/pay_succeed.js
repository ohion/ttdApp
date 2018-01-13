$(function() {
    var url = location.search;
    console.log(url);

    // 获取url参数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;
    }
    var getIrefereeId = getQueryString("lrefereeId"); // 获取url商家平台号ID参数
    var refuserid = getQueryString("refuserid"); // 获取url参数

    var sOrderNo = getQueryString("sOrderNo"); // 获取url订单号
    var orderInfo; //存储订单号信息对象
    //发送服务请求 -- 获取订单号信息 
    toast.loading();
    var timer = setInterval(function() {
        console.log(2134);
        $.ajax({
            url: "http://mepay.tymplus.com/WeiXinPay/BusinessAPI/GetUserOrderAttachInfo.ashx",
            type: "post",
            dataType: "json",
            async: false,
            data: {
                sOrderNo: sOrderNo, //商家账号           
            },
            success: function(result) {
                if (result.iRet == 0) { //正常
                    orderInfo = result;
                    $("#keeper").html(orderInfo.sShopName); // 收款人
                    $("#pay_money").html(orderInfo.dMoney); //消费金额  
                    $("#payTime").html(orderInfo.sPayTime); //支付时间  
                    $("#giving").html(orderInfo.dGiveShopCoin + "购物币"); //赠送购物币数  
                    clearInterval(timer);
                    toast.remove();
                }

            },
            error: function(err) {
                toast.result("网络异常");
            }
        });

    }, 500);
    //下载天天兑APP
    $('#downloadBtn').click(function() {
        location.href = "../TTD-register/download.html?lrefereeId=" + getIrefereeId + "&refuserid=" + refuserid;
        //location.href = "http://appbs.tymshop.com:8080/appbs/TTD-register/register.html?lrefereeId="+getIrefereeId+"&refuserid="+refuserid; //外网注册
    });

  /*  $('#finishBtn').click(function() {
        window.close();
    });*/



})
