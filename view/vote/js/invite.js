// 获取url参数
getQueryString = function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return decodeURI(r[2]);
    return null;
}
var lrefereeId = getQueryString("lrefereeId");
var refuserid = getQueryString("refuserid");
var specId = getQueryString("specId"); //规格id
// var url_param = window.location.search;
//    控制字体大小
(function (doc, win) {
    var docEl = doc.documentElement,retime,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 100 * (clientWidth / 375) + 'px';
        };
    // Abort if browser does not support addEventListener
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
$(function(){
    var votehost = servers.voteService;
    // $("#head").attr("src",getQueryString("headimg"));
    // $("#title").text(getQueryString("name"));
    var isClicked = false; //是否已点击获取验证码

	 //获取绑定窗口手机号
    function GetBindPhone(text) {
        var phone = text.replace(/\s/g,"");
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
    // 解决 安卓弹起输入法时底部的固定栏弹起
    var h = document.body.scrollHeight;
    window.onresize = function(){
        if (document.body.scrollHeight < h) {
           $(".bottom").hide();
        }else{
            $(".bottom").show();
        }
    };

    //获取图形验证码
    function GetBindImgCode() {
        var verCode = $('#imgCodeString').val();
        if (verCode == '') {
            toast.tips('请输入你的验证码');
            $('#imgCodeString').focus();
            return null;
        }
        return verCode;
    }

    function ImgCodeDialog(isShow) {
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
    $(".labelbox").on("click",function(e){
        e.preventDefault();
    })
    //获取验证码
    $('#getCode').on("click",function (e) {
        var evt = e || event;
        console.log(evt);
        e.stopPropagation();
        e.preventDefault();
        
        $("#imgCodeString").focus();
        //电话号码
        var phone = GetBindPhone($("#phone").val());
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
            if(!sImgCode){
                return;
            }
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
                            toast.remove();
                        }
                    } else { //异常
                        toast.tips(result.result);
                        toast.remove();
                    }
                },
                error: function() {
                    toast.tips("网络异常");
                    toast.remove();
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
            url: "/appbs/newUserService/register",
            type: "post",
            data: { sCondition: param },
            success: function(data) {
                if (data.state == 0 || data.state == 2) {
                    clearInterval(timer);
                    $('#getCode').text('获取验证码');
                    // toast.result('注册成功！');
                    if(data.userId){
                        vote(data.userId,phone);
                    }
                } else if (data.state == 1) {
                    toast.result('注册异常');
                } else if (data.state == -3) {
                    toast.result('用户已存在！');
                } else if (data.state == -8) {
                    toast.result('验证码错误！');
                } else if (data.state == -9) {
                    // toast.result('您已注册！');
                    if(data.userId){
                        vote(data.userId,phone);
                    }
                } else if (data.state == -101) {
                    toast.result('平台号不存在！');
                } else if (data.state == -100) {
                    toast.result('推广人不存在！');
                } else {
                    toast.result(data.result);
                }
                toast.remove();

            },
            error: function(err) {
                toast.result("网络异常");
                toast.remove();

            }
        });
    });
    $(".delad").on("click",function(){
        $(".bottom").remove();
    })
    function vote(userid,phone){
        var id = getQueryString("id");  //投票对象的id
        var obj = {
             userId: userid,
             id: id,
             phone:phone
         }

         // 投票
         $.ajax({
             url:"http://"+votehost+"/vote/userVote",
             type:"post",
             data:obj,
             success:function(res){
                 res = JSON.parse(res);
                 if(res.state ==0){
                    toast.result('投票成功',function(){
                         window.location.href = "/appbs/vote/index.html?lrefereeId="+lrefereeId+"&refuserid="+refuserid+"&userid="+userid+"&phone="+phone;
                    });
                 }else if(res.state == -1){
                     toast.result(res.msg,function(){
                         window.location.href = "/appbs/vote/index.html?lrefereeId="+lrefereeId+"&refuserid="+refuserid+"&userid="+userid+"&phone="+phone;
                     });
                 }
             },
             error:function(err){
                 toast.tips('网络不顺畅，请稍后再试');

             }
         })
    }
})


