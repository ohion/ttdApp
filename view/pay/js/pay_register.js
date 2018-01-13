$(function() {

    var url = location.search;

    //用户未注册、未绑定手机号，付款过N+1次的情况，提示用户有？购物币未领取

    //var coin = GetWeiXinUserBalance(sOpenId);//购物币
    //if (coin) {
    //    $('#newUse').text("您有" + coin + "购物币尚未领取");
    //}

    // 获取url参数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;
    }

    var getIrefereeId = getQueryString("lrefereeId"); // 获取url当前平台号参数
    var refuserid = getQueryString("refuserid"); // 获取用户ID参数  
    var orderNo = getQueryString('order');//获取消费订单号
    // var shopSetMoney = getQueryString("shopSetMoney"); //获取商家设置消费金额
    // var noPreferential = getQueryString("noPreferential"); //获取不参与活动的消费金额

    var type = getQueryString("type"); //web微信支付url参数type为1时隐藏支付按钮
    if (type != "" && type == 1) {
        $('.type').css("display", "none");
    }

    //立刻支付
    $('#curpay').click(function() {
        //立即支付頁面
        // var curpay = "http://192.168.168.200:8080/appbs/pay/payNoPhone.html";
        // var curpay = "http://mepay.tymplus.com/WebConsume/payNoPhone.html"; //发布版
        var curpay = "http://mepay.tymplus.com/WebConsume/payNoPhone.html";

        //跳转到微信授权页面
        location.href = curpay + "?lrefereeId=" + getIrefereeId + "&refuserid=" + refuserid+ "&orderNo=" + orderNo;
    });

    //注册天天兑用户
    $('#register').click(function() {
        location.href = "http://appbs.tymshop.com:8080/appbs/TTD-register/register_app.html?lrefereeId=" + getIrefereeId + "&refuserid=" + refuserid;
        // location.href = "http://192.168.168.200:8080/appbs/TTD-register/register_app.html?lrefereeId=" + getIrefereeId + "&refuserid=" + refuserid;

    });

    //下载天天兑APP
    $('#download').click(function() {
        location.href = "http://appbs.tymshop.com:8080/appbs/TTD-register/download.html";
    });

})