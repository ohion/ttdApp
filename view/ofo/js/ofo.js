$(document).ready(function() {
    $("#box").click(function() {
        $('#main').show();
    });
    var timer = null;

    //获取验证码
    var phoneRegular = /^1[3|4|5|7|8]\d{9}$/; //手机号正则
    var isClickRegister = 0; //记录是否允许点击注册，默认允许

    $('#getCode').click(function() {
        var phone = $('#phone').val();
        if (phone == '') {
            toast.tips('请输入您的手机号码');
            $('#phone').focus();
            return;
        }
        if (!phoneRegular.test(phone)) {
            toast.tips("请输入正确的手机号码！");
            $('#phone').focus();
            return;
        }
        $("#checkcode").val("");//清空验证码
        $("#dialog").dialog("open");
        $("#dialog_img").attr("src", "/appbs/newUserService/getImage/" + phone + "?timeStamp=" + (new Date()).valueOf())


    });

    //刷新验证码
    $('#reloadCode').click(function() {
        var phone = $('#phone').val();
        $("#checkcode").val("");//清空验证码
        $("#dialog_img").attr("src", "/appbs/newUserService/getImage/" + phone + "?timeStamp=" + (new Date()).valueOf())
    });

    $("#dialog").dialog({
        resizable: false,
        autoOpen: false,
        height: "auto",
        modal: true,
        width: "auto",
        buttons: {
            // "确认": function() {
            //   $( this ).dialog( "close" );
            //     var code = $('#dialog_code').val();
            //         alert(code);
            //      },
            //     "取消": function() {
            //       $( this ).dialog( "close" );
            //     }

            "确认": function() {
                var code = $('#dialog_code').val();
                var phone = $('#phone').val();
                if (!code) {
                    toast.tips("请输入验证码");
                    return;
                } else {
                    $.ajax({
                        url: "/appbs/newUserService/checkCode",
                        type: "post",
                        data: {
                            phone: phone,
                            code: code
                        },
                        success: function(result) {
                            if (result.state == 0) { //正常
                                toast.tips('验证码已发送！');
                                if ($('#getCode').text() == '获取验证码') {

                                    var second = 60;
                                    $('#getCode').attr("disabled", true);
                                    $('#getCode').css({ 'background': '#848484', 'color': '#fff' });
                                    timer = setInterval(function() {
                                        second -= 1;
                                        if (second >= 0) {
                                            $('#getCode').text("还剩 " + second + " 秒");
                                        } else {
                                            clearInterval(timer);
                                            $('#getCode').text('获取验证码');
                                            $('#getCode').css({ 'background': '#FFD006', 'color': '#000' });
                                            $('#getCode').attr("disabled", false);
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
                }
                $(this).dialog("close");
            },
            "取消": function() {
                $(this).dialog("close");
            }
        }
    });

    //确定
    $('.submit').click(function() {
        var phone = $('#phone').val();
        var checkcode = $("#checkcode").val();

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
            $('#checkcode').focus();
            return;
        }
        var getIrefereeId = getQueryString("lrefereeId"); // 获取url lrefereeId平台号
        var refuserid = getQueryString("refuserid"); // 获取 refuserid推荐人id

        toast.loading();
        var param = { "phone": phone, "code": checkcode, "platformID": getIrefereeId || "", "refuserid": refuserid || "" };
        param = Lock('#*06#', JSON.stringify(param), 4);
        var url = "/appbs/newUserService/registerByCode";
        param = { sCondition: param };


        isClickRegister = 1;
        console.log("isClickRegister=" + isClickRegister);
        $.post(url, param, function(data, state) {
            isClickRegister = 0;
            console.log("isClickRegister=" + isClickRegister);
            if (parseInt(data.state) == 0) {
                $('#phone').val("");
                $('#checkcode').val("");
                clearInterval(timer);

                $('#getCode').text('获取验证码');

                //location.href = 'https://active.clewm.net/Bfl49j?qrurl=c3.clewm.net%2FBfl49j&gtype=1&key=b5e2b159531c7f6f60408969bf77dea03156215559';
                location.href = 'https://active.clewm.net/Bfl49j?qrurl=https%3A%2F%2Fc3.clewm.net%2FBfl49j&gtype=1&key=91a06157628d25a9511261d0ac7e9f3be62412a867';

            } else {
                toast.result(data.result);
            }

        }).error(function() {
            isClickRegister = 0;
            toast.result('没有该服务！');
        });
    });


    // 获取url参数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;
    }
})