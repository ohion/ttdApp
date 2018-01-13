$(function() {
    var url = location.search;
    console.log(url);
    var phoneRegular = /^1[3|4|5|7|8]\d{9}$/; //手机号正则

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

    var sOpenId = getQueryString("sOpenId"); // 获取url sOpenId 参数
    var sAccessToken = getQueryString("sAccessToken"); // 获取url sAccessToken 参数

    var sShopName; //商家名称
    var lPlatformId; //商家账号
    var phone; //手机号码
    var sRemark; //备注信息
    var ignoreMoney; //不参与分成
    var payMoney; //付款金额
    var sCallBackUrl; //回调地址

    //发送服务请求 -- 获取商家名称 
    $.ajax({
        url: "http://mepay.tymplus.com/WeiXinPay/BusinessAPI/ReqShopInfo.ashx",
        dataType: "json",
        data: {
            //lPlatformId: 111000
            lPlatformId: getIrefereeId
        },
        async: false,
        success: function(res) {
            if (res.iRet == 0) {
                sShopName = res.sShopName;
                lPlatformId = res.lPlatformId;
            }

        }
    });

    $("#xf_sjmc").html(sShopName); //商家名称
    $("#xf_sjzh").html(lPlatformId); //商家账号  
    var isClicked = false; //是否已点击获取验证码

    //支付
    $('#pay').click(function() {
        //电话号码
        phone = $('#phoneNumber').val();
        if (phone == '') {
            toast.tips('请输入你的手机号码');
            $('#phoneNumber').focus();
            return;
        }
        if (!phoneRegular.test(phone)) {
            toast.tips("请输入正确的手机号码！");
            $('#phoneNumber').focus();
            return;
        }
        //消费总金额
        payMoney = $('#payMoney').val();
        if (payMoney == '') {
            toast.tips('请输入消费总金额');
            $('#payMoney').focus();
            return;
        }
        if (payMoney <= 0) {
            toast.tips('金额不能小于或等于0！');
            $('#payMoney').focus();
            return;
        }
        if (payMoney > 1000000) {
            toast.tips('金额太大！');
            $('#payMoney').focus();
            return;
        }
        if (payMoney.split(".").length > 1) {
            if (payMoney.split(".")[1].length > 2) {
                toast.tips('不能超过2位小数！');
                $('#payMoney').focus();
                return;
            }
        }

        //店家不参与推广的提成
        ignoreMoney = $('#ignoreMoney').val();
        if(ignoreMoney){
          if (ignoreMoney.split(".").length > 1) {
              if (ignoreMoney.split(".")[1].length > 2) {
                  toast.tips('不能超过2位小数！');
                  $('#ignoreMoney').focus();
                  return;
              }
          }
        }
        ignoreMoney = ignoreMoney == "" ? 0 : ignoreMoney;
        if (ignoreMoney > payMoney * 0.5) {
            toast.tips('不参与活动金额不能超过总金额的50%');
            $('#ignoreMoney').focus();
            return;
        }

        //备注信息
        sRemark = $('#remarkInfo').val();
        //sCallBackUrl = "http://192.168.168.200:8080/appbs/pay/pay_succeed.html"; //支付成功后的跳转地址
        sCallBackUrl = "http://appbs.tymshop.com:8080/appbs/pay/pay_succeed.html"; //支付成功后的跳转地址

        toast.loading(); //等待转圈

        //发送服务请求 -- 判断手机号是否注册
        $.ajax({
            url: "http://mepay.tymplus.com/WeiXinPay/BusinessAPI/IsRegister.ashx",
            type: "post",
            data: {
                sPhone: phone
            },
            dataType: 'json',
            success: function(result) {
                if (result.iRet == 0) { //正常
                    // toast.result('已注册');
                    pay();
                } else { //异常
                    $('#blackBg').css('display', 'block');
                    toast.result("您还未注册");
                }

            },
            error: function(err) {
                toast.result("网络异常");
            }
        });
    });

    //封装支付函数
    function pay() {
        //发送服务请求 -- 获取订单号 
        $.ajax({
            url: "http://mepay.tymplus.com/WeiXinPay/BusinessAPI/CreatePayOrder.ashx",
            type: "post",
            dataType: "json",
            async: false,
            data: {
                lPlatformId: lPlatformId, //商家账号
                sPhone: phone, //用户电话号码
                dMoney: payMoney, //支付总金额
                dNotDividedMoney: ignoreMoney, //不参与提成金额
                sRemark: sRemark //备注信息
            },
            success: function(result) {
                if (result.iRet == 0) { //正常
                    //console.log(result.sOrderNo); // 成功创建订单号
                    location.href = "http://mepay.tymplus.com/WeiXinPay/API/ConsumePay.aspx?sOrderNo=" + result.sOrderNo + "&sCallBackUrl=" + sCallBackUrl + "&sOpenId=" + sOpenId + "&sAccessToken=" + sAccessToken;
                } else { //异常
                    toast.result('付款失败！');

                }

            },
            error: function(err) {
                toast.result("网络异常");
            }
        });
    }


    //获取验证码
    $('#getCode').click(function() {
        if (!isClicked) {
            isClicked = true;
            toast.loading(); //等待转圈

            //发送服务请求 -- 获取验证码 
            $.ajax({
                url: "http://appbs.tymshop.com:8080/appbs/newUserService/getCode",
                type: "post",
                data: {
                    phone: phone
                },
                success: function(result) {
                    if (result.state == 0) { //正常
                        toast.result('验证码已发送！');
                        console.log($('#getCode').html() == '获取验证码');
                        console.log($('#getCode').text());
                        if ($('#getCode').text() == '获取验证码') {

                            var second = 60;
                            var timer = null;

                            $('#getCode').attr("disabled", true);
                            $('#getCode').css({ 'background-color': '#f0f0f0' });

                            timer = setInterval(function() {
                                second -= 1;
                                if (second >= 0) {
                                    $('#getCode').html("还剩 " + second + " 秒");
                                } else {
                                    clearInterval(timer);
                                    $('#getCode').html('获取验证码');
                                    $('#getCode').css({ 'background-color': '#FF4848' });
                                    isClicked = false;
                                }
                            }, 1000);
                        }
                    } else { //异常
                        toast.result('请求失败！');

                    }

                },
                error: function(err) {
                    toast.result("网络异常");
                }
            });
        }


    })

    //取消获取验证码
    $('#cancelBtn').click(function() {
        // alert('取消获取验证码');
        $('#blackBg').css('display', 'none');
        $('.realInput').val("");
        $('.bogusInput input').val("");
    });

    //立即验证
    $('#verBtn').click(function() {
        var code = $('.realInput').val();
        toast.loading(); //等待转圈
        //发送服务请求 -- 注册接口
        $.ajax({
            url: "http://mepay.tymplus.com/WeiXinPay/BusinessAPI/Register.ashx",
            type: "post",
            data: {
                sPhone: phone,
                sCode: code,
                lPlatformId: lPlatformId
            },
            dataType: 'json',
            success: function(result) {
                if (result.iRet == 0) { //正常
                    toast.result('注册成功');
                    pay();

                } else { //异常
                    toast.result(result.err);
                }

            },
            error: function(err) {
                toast.result("网络异常");
            }
        });

    });

    //验证码UI
    /*  var container = document.getElementById("inputBoxContainer");
      boxInput = {
          maxLength: "",
          realInput: "",
          bogusInput: "",
          bogusInputArr: "",
          callback: "",
          init: function(fun) {
              var that = this;
              this.callback = fun;
              that.realInput = container.children[0];
              that.bogusInput = container.children[1];
              that.bogusInputArr = that.bogusInput.children;
              that.maxLength = that.bogusInputArr[0].getAttribute("maxlength");
              that.realInput.oninput = function() {
                  that.setValue();
              }
              that.realInput.onpropertychange = function() {
                  that.setValue();
              }
          },
          setValue: function() {
              this.realInput.value = this.realInput.value.replace(/\D/g, "");
              console.log(this.realInput.value.replace(/\D/g, ""))
              var real_str = this.realInput.value;
              for (var i = 0; i < this.maxLength; i++) {
                  this.bogusInputArr[i].value = real_str[i] ? real_str[i] : "";
              }
              if (real_str.length >= this.maxLength) {
                  this.realInput.value = real_str.substring(0, 6);
                  this.callback();
              }
          },
          getBoxInputValue: function() {
              var realValue = "";
              for (var i in this.bogusInputArr) {
                  if (!this.bogusInputArr[i].value) {
                      break;
                  }
                  realValue += this.bogusInputArr[i].value;
              }
              return realValue;
          }
      }
      boxInput.init(function() {
          getValue();
      });*/
    /* document.getElementById("confirmButton").onclick = function() {
         getValue();
     }*/

    /*$('#confirmButton').onclick = function() {
        getValue();
    }*/

    /*function getValue() {
        boxInput.getBoxInputValue();
    }*/


})
