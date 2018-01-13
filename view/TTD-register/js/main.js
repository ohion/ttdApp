    /*
         * author：lin
         * date: 2016-9-04
         * note: 注册页面,本页面引用的是 *author = ruiping* 写的toast

         /* // toast.loading();

                // setTimeout(function(){
                //  toast.result("请求成功");
                // },500)

                toast.tips("密码不能为空")
                */
    // 获取url参数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            // return unescape(r[2]);
            return decodeURI(r[2]);

        return null;
    }

    var getIrefereeId = getQueryString("lrefereeId"); // 获取url推荐人参数
    var refuserid = getQueryString("refuserid"); // 获取refuserid参数
    var download = getQueryString("download"); //获取download参数，显示下载按钮
    var specId = getQueryString("specId"); //规格id


    $(document).ready(function() {
        var timer = null;

        var url = location.search;
        console.log(url);

        // //微信等支付进来，隐藏下载按钮
        // if (download == 0) {
        //     $('.btn').css('display', 'none');
        // }

        var element = document.getElementById('on');
        var element2 = document.getElementById('on2');
        $('#register').removeAttr("disabled");
        $('#register').css('background-color', '#FF4848');

        $('#rules img').click(function() {
            if (element.src.match("un")) {
                element.src = "img/select.png";
                if (element2.src = "img/select.png") {
                    $('#register').css({ 'background-color': '#FF4848', "box-shadow": "0px 2px 30px #FF4848" });
                    $('#register').removeAttr("disabled");
                }

            } else {
                element.src = "img/unselect.png";
                $('#register').css({ 'background-color': '#d0d0d0', "box-shadow": "0px 2px 30px #d0d0d0" });
                $('#register').attr('disabled', true);
            }
        });

        $('#rulesofgoods img').click(function() {
            if (element2.src.match("un")) {
                element2.src = "img/select.png";
                if (element.src = "img/select.png") {
                    $('#register').css({ 'background-color': '#FF4848', "box-shadow": "0px 2px 30px #FF4848" });
                    $('#register').removeAttr("disabled");
                }

            } else {
                element2.src = "img/unselect.png";
                $('#register').css({ 'background-color': '#d0d0d0', "box-shadow": "0px 2px 30px #d0d0d0" });
                $('#register').attr('disabled', true);
            }

        });

        //联盟商家产品分享
        var pId = getQueryString('id'); //产品ID
        var type = getQueryString('type'); //产品类型
        var discountsId = getQueryString('productId'); //优惠券id
        var platformId = getQueryString('platformId'); //优惠券 平台号
        var brandName = getQueryString('brandName'); //品牌
        var shopId = getQueryString('shopId'); //店铺名称
        //积分商城
        var topiId = getQueryString('topiId'); //品牌id
        var sortId = getQueryString('sortId'); //分类id
        var name = getQueryString('name'); //品牌名称

        //判断iOS || Android
        var u = navigator.userAgent,
            app = navigator.appVersion;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //g
        var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

        if (pId && type >= 0) {

            if (isAndroid) {
                // alert("安卓机！");
                var iframe = $("<iframe>").css({ display: 'none', width: 0, height: 0 });
                $("body").append(iframe);
                iframe.attr("src", "ttdapp://ttdwebsite.com/openApp?mark_id=" + pId + "&detail_Type=" + type);
            }
            if (isIOS) {
                // alert("苹果果机！");
                window.location = "TianTianDui://goodInfoRouter?mark_id=" + pId + "&detail_Type=" + type; //打开详情页

            }
        }

        if (brandName) {
            if (isAndroid) {
                // alert("安卓机！");
                var iframe = $("<iframe>").css({ display: 'none', width: 0, height: 0 });
                $("body").append(iframe);
                iframe.attr("src", "ttdapp://ttdwebsite.com/openApp?brandName=" + brandName);
            }
            if (isIOS) {
                // alert("苹果果机！");
                window.location = "tiantiandui://brandProductList?brand_name=" + brandName; //打开品牌详情页

            }
        }

        if (shopId) {
            if (isAndroid) {
                // alert("安卓机！");
                var iframe = $("<iframe>").css({ display: 'none', width: 0, height: 0 });
                $("body").append(iframe);
                iframe.attr("src", "ttdapp://ttdwebsite.com/openApp?shopId=" + shopId);
            }
            if (isIOS) {
                // alert("苹果果机！");
                window.location = "tiantiandui://storeProductList?storeId=" + shopId;

            }
        }



        if (discountsId) {
            if (isAndroid) {
                var iframe = $("<iframe>").css({ display: 'none', width: 0, height: 0 });
                $("body").append(iframe);
                iframe.attr("src", "ttdapp://ttdwebsite.com/openApp?productID=" + discountsId + "&platformId=" + platformId);
            }
            if (isIOS) {
                // alert("苹果果机！");
                window.location = "tiantiandui://couponGoodDetail?productID=" + discountsId + "&platformId=" + platformId;

            }
        }

        // 积分商城 topiId品牌id 0为分类ID, 1为品牌ID 20为京东,21为积分商城
        if (topiId) {
            if (isAndroid) {
                 window.jsObj.brandProductList(id, 21, 1, name);//打开店铺 
            }
            if (isIOS) {
                // alert("苹果果机！");
                window.location = 'tiantiandui://brandProductList?topiId=' + id + '&sortType=21&reqType=1&brand_name=' + name;

            }
        }
        // 积分商城 sortId 分类id 0为分类ID, 1为品牌ID 20为京东,21为积分商城
        if (sortId) {
            if (isAndroid) {
                window.jsObj.brandProductList(id, 21, 0, name);//打开店铺
            }
            if (isIOS) {
                // alert("苹果果机！");
                window.location = 'tiantiandui://brandProductList?sortId=' + id + '&sortType=21&reqType=0&brand_name=' + name;
            }
        }




        var phoneRegular = /^1[3|4|5|7|8|9]\d{9}$/; //手机号正则

        var verify = 0;

        if (getIrefereeId == null) {
            getIrefereeId = "100012";
        }
        if (refuserid == null) {
            refuserid = "";
        }
        $("#lrefereeId").html(getIrefereeId); //当前关注平台号
        $("#refuserid").html(refuserid); //用户ID


        $('#getCode').click(function() {
            var phone = $('#phone').val();
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
            $("#dialog").dialog("open");
            //$("#dialog_img").attr("src","/appbs/newUserService/getImage/"+phone+"?timeStamp="+(new Date()).valueOf())
            $("#dialog_img").attr("src", "http://appbs.tymshop.com:8080/appbs/newUserService/getImage/" + phone + "?timeStamp=" + (new Date()).valueOf())


        });


        $('#reloadCode').click(function() {
            var phone = $('#phone').val();
            $("#dialog_img").attr("src", "http://appbs.tymshop.com:8080/appbs/newUserService/getImage/" + phone + "?timeStamp=" + (new Date()).valueOf())
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



        // //倒计时
        // $('#getCode').click(function() {
        //     var phone = $('#phone').val();
        //     if (phone == '') {
        //         toast.tips('请输入你的手机号码');
        //         $('#phone').focus();
        //         return;
        //     }
        //     if (!phoneRegular.test(phone)) {
        //         toast.tips("请输入正确的手机号码！");
        //         $('#phone').focus();
        //         return;
        //     }


        //     toast.loading(); //等待转圈

        //     //发送服务请求 -- 获取验证码 
        //     $.ajax({
        //         url: "/appbs/newUserService/getCode",
        //         type: "post",
        //         data: {
        //             phone: phone
        //         },
        //         success: function(result) {
        //             if (result.state == 0) { //正常
        //                 toast.result('验证码已发送！');
        //                 if ($('#getCode').text() == '获取验证码') {

        //                     var second = 60;


        //                     $('#getCode').attr("disabled", true);
        //                     $('#getCode').css({ 'background': '#848484', 'color': '#fff' });
        //                     timer = setInterval(function() {
        //                         second -= 1;
        //                         if (second >= 0) {
        //                             $('#getCode').text("还剩 " + second + " 秒");
        //                         } else {
        //                             clearInterval(timer);
        //                             $('#getCode').text('获取验证码');
        //                             $('#getCode').css({ 'background': '#FFD006', 'color': '#000' });
        //                             $('#getCode').attr("disabled", false);
        //                         }
        //                     }, 1000);
        //                 }
        //             } else { //异常
        //                 toast.result('请求失败！');

        //             }

        //         },
        //         error: function(err) {
        //             toast.result("网络异常");
        //         }
        //     });
        // });

        //登入密码是否可见
        $('.visible').click(function() {
            if ($(this).attr("src") === "img/qb_xsje_butt_nor_2x.png") {
                $(this).attr("src", "img/qb_xsje_butt_sel_2x.png"); //不可见
                $('#password').attr('type', 'password');

            } else {
                $(this).attr("src", "img/qb_xsje_butt_nor_2x.png"); //可见
                $('#password').attr('type', 'text');
            }
        });

        //注册
        $('#register').click(function() {
            var phone = $('#phone').val();
            var checkcode = $("#checkcode").val();
            var password = 888888;

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
                url: "/appbs/newUserService/register",
                type: "post",
                data: { sCondition: param },
                success: function(data) {
                    if (data.state == 0 || data.state == 2) {
                        $("#phone").val("");
                        $("#checkcode").val("");

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
                        toast.result('此用户已注册！');
                    } else if (data.state == -101) {
                        toast.result('平台号不存在！');
                    } else if (data.state == -100) {
                        toast.result('推广人不存在！');
                    } else {
                        //toast.result('网络异常！' + data.result);
                        toast.result(data.result);
                    }
                },
                error: function(err) {
                    toast.result("网络异常");
                }
            });
        });

        //下载按钮
        $('#downloadBtn').click(function() {

            var r = confirm("是否注册成功？");
            if (r == true) {
                location.href = 'download.html';
            } else {
                return;
            }
        })

    });