getQueryString = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return decodeURI(r[2]);
    return null;
}
$(function(){
    $("#head").attr("src",getQueryString("headimg"));
    var titlestr = "“"+getQueryString("name")+"”"+"邀请<br/>您加入天天兑";
    $("#title").html(titlestr);
    var isClicked = false; //是否已点击获取验证码
    // 解决 安卓弹起输入法时底部的固定栏弹起
    var h = document.body.scrollHeight;
    window.onresize = function(){
        if (document.body.scrollHeight < h) {
           $(".bottom").hide();
        }else{
            $(".bottom").show();
        }
    };
	 //获取绑定窗口手机号
    function GetBindPhone(text) {
        var phone = text.replace(/\s/g,"");
        console.log(phone);
        if (phone == '') {
            toast.tips('请输入你的手机号码');
            return null;
        }
        var phoneRegular = /^1\d{10}$/; //手机号正则
        if (!phoneRegular.test(phone)) {
            toast.tips("请输入正确的手机号码！");
            return null;
        }
        return phone;
    }
    //获取绑定窗口验证码
    function GetBindCode() {
        var verCode = $('#verCode').val();
        if (verCode == '') {
            toast.tips('请输入你的验证码');
            $('#verCode').focus();
            return null;
        }
        return verCode;
    }

    //获取图形验证码
    function GetBindImgCode() {
        var verCode = $('#imgCodeString').val();
        if (verCode == '') {
            toast.tips('请输入你的验证码');
            $('#verCode').focus();
            return null;
        }
        return verCode;
    }

    function ImgCodeDialog(isShow) {
        // $("#showPhone").css('display', isShow?'none':'block');
        // $("#publichttp").css('display', isShow ? 'none' : 'block');
        // $("#get").css('display', isShow ? 'none' : 'block');
        $("#imgCodeDialog").css('display', isShow ? 'block' : 'none');
        if (isShow) {
            $("#imgCodeString").val("");
            var phone = GetBindPhone($("#phone").val());
            if (phone == null) {
                return;
            }
            $("#imgCode").attr("src", "http://appbs.tymshop.com:8080/appbs/newUserService/getImage/" + phone + "?timestamp=" + Date.parse(new Date()));
        }
    }
    //获取验证码
    $('#getCode').click(function () {

        //电话号码
        phone = GetBindPhone($("#phone").val());
        console.log(phone);
        if (phone == null) {
            return;
        }
        // console.log(isClicked);   // 关闭时 
        if (!isClicked) {
            //显示图形验证码
            ImgCodeDialog(true);
        }
    });
    var timer = null;
    $('#okImgCode').click(function () {
        if (!isClicked) {
            var sImgCode = GetBindImgCode();
            toast.loading(); //等待转圈
            //发送服务请求 -- 获取验证码 
            var newphone = GetBindPhone($("#phone").val());
             $.ajax({
                url: "/appbs/newUserService/checkCode",
                type: "post",
                data: {
                    phone: newphone,
                    code: sImgCode
                },
                success: function(result) {
                    if (result.state == 0) { //正常
                        isClicked = true;
                        toast.result('验证码已发送！');
                        if ($('#getCode').text() == '获取验证码') {
                            var second = 60;
                            $('#getCode').attr("disabled", false);
                            $('#getCode').css({ 'background-color': '#f0f0f0' });
                            timer = setInterval(function () {
                                second -= 1;
                                if (second >= 0) {
                                    $('#getCode').html("还剩 " + second + " 秒");
                                } else {
                                    clearInterval(timer);
                                    $('#getCode').html('获取验证码');
                                    $('#getCode').css({ 'background-color': '#D75142' });
                                    isClicked = false;
                                }
                            }, 1000);
                            
                        }
                    } else { //异常
                        toast.tips(result.result);
                        $('#dialog_code').val("");
                    }
                },
                error: function() {
                    toast.tips("网络异常");
                }
            });
            ImgCodeDialog(false);
        }
    });
    $("#imgCodeDialog .closedialog").on("click",function(){
        clearInterval(timer);
        isClicked = false;
        $("#imgCodeDialog").hide();
        // $("#phone").val("");//清空手机号码的值
        $("#verCode").val("");  // 清空验证码的值
        ImgCodeDialog(false);
        $("#getCode").html("获取验证码").removeAttr("disabled").css("background-color"," #D75142");
    })
    $('#imgCodeReset').click(function () {
        ImgCodeDialog(true);
    });

    // 立即注册
    $("#regBtn").on("click",function(){
        var phone = $('#phone').val();
        var checkcode = $("#imgcode").val();
        var password = 888888;
        var phoneRegular = /^1\d{10}$/; //手机号正则

        if (phone == '') {
            toast.tips('请输入你的手机号码');
            $('#phone').focus();
            return;
        }
        if (!phoneRegular.test(phone)) {
            toast.tips("请输入正确的手机号码！");
            $('#phone').focus();
            return;
        }
        if (checkcode == '') {
            toast.tips('请输入验证码');
            $('#imgcode').focus();
            return;
        }

        password = $.md5("T" + password);
        var getIrefereeId = getQueryString("lrefereeId"); // 获取url推荐人参数
        var refuserid = getQueryString("refuserid"); // 获取refuserid参数
        var bargain = getQueryString('bargain'); //获取砍价参数
        if (bargain == null) {
            bargain = "";
        }
        if (getIrefereeId == null) {
            getIrefereeId = "100012";
        }
        if (refuserid == null) {
            refuserid = "";
        }

        var data = {
            phone: phone,
            code: checkcode,
            password: password,
            platformID: getIrefereeId,
            refuserid: refuserid,
            specId: specId || ""
        };

        var param = Lock('#*06#', JSON.stringify(data), 4);

        toast.loading();

        //发送服务请求：--用户注册
        $.ajax({
            url: "http://"+reghost+"/appbs/newUserService/register",
            type: "post",
            data: { sCondition: param },
            success: function(data) {
                console.log(data);
                if (data.state == 0 || data.state == 2) {
                    // $("#phone").val("");
                    // $("#imgCodeString").val("");
                    clearInterval(timer);
                    $('#getCode').text('获取验证码');

                    toast.result('注册成功！');
                    if (window.location.href.indexOf("regist_app.html") > 0) {
                        location.href = 'mapay.tymshop.com/registerSuccess';
                    } else if (data.state == 2) {
                        location.href = 'succeed.html?bargain=1';
                    } else {
                        location.href = 'succeed.html?bargain=0';
                    }
                } else if (data.state == 1) {
                    toast.result('注册异常');
                } else if (data.state == -3) {
                    toast.result('用户已存在！');
                } else if (data.state == -8) {
                    toast.result('验证码错误！');
                } else if (data.state == -9) {
                    toast.result('您已注册！');
                    // window.location.href = "/appbs/vote/index.html"+url_param+"&id="+data.result;
                } else if (data.state == -101) {
                    toast.result('平台号不存在！');
                } else if (data.state == -100) {
                    toast.result('推广人不存在！');
                } else {
                    toast.result(data.result);
                }
            },
            error: function(err) {
                toast.result("网络异常");
            }
        });
    });
    $(".delad").on("click",function(){
        $(".bottom").remove();
    })
})