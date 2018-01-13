$(document).ready(function() {


    //获取url参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }
    var getIrefereeId = getUrlParam('lrefereeId'); //平台号
    var refuserid = getUrlParam('refuserid'); //用户id
    var urlParam = "";



    /*//打开弹出询问 “是否有注册过天天兑” 页面
    $("#shopCar").click(function() {
        var explorer = navigator.userAgent;
        var type = null; //商品类型

        var pId = null; //当前的产品id//产品ID
        if (getUrlParam("product_mark_id")) {
            pId = getUrlParam("product_mark_id");
        } else {
            pId = getUrlParam('id');
        }


        var pWelfare = product.welfare; //产品福利值
        var pSeckill = product.is_seckill; //产品秒杀

        if (pSeckill == 1) {
            //秒杀产品
            type = 1;
        } else if (pWelfare > 0) {
            //非福利值值产品
            type = 2;
        } else {
            //普通产品
            type = 0;
        }

        urlParam = "id=" + pId + "&type=" + type;
        if ((explorer.indexOf("MicroMessenger") > 0 || explorer.indexOf("QQ/") > 0)) {
            if (/(iPhone)/i.test(navigator.userAgent)) {
                $("#phone_browser_word").text("在Safari中打开");
            } else if (/(Android)/i.test(navigator.userAgent)) {
                $("#phone_browser_word").text("在浏览器中打开");
            }
            $("#shadowTips").fadeIn(300);

            $(".shadowTips_mid_left img").click(function() {
                $("#shadowTips").fadeOut(300);
            });
        } else {

            new Mlink({
                mlink: "https://ahtcoe.mlinks.cc/AdSu?mark_id=" + pId + "&detail_Type=" + type,
                button: document.querySelector('#shopCar')
            });
            //跳转到注册页面
            location.href = "../TTD-register/register_app.html?lrefereeId=" + getIrefereeId + "&refuserid=" + refuserid + "&" + urlParam;
        }

    });*/


    function GetRequest() {
        var url = location.search; //获取url中"?"符后的字串         
        url = encodeURI(url);
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }

    var Request = new Object();
    Request = GetRequest();



    //推荐人id，平台号id
    var refuserid, lrefereeId;
    refuserid = Request["refuserid"];
    lrefereeId = Request["lrefereeId"];

    var logoImageList, image_list, name, money, coin, shipment, address, welfare, shopId, take, is_collected, delivery, is_spot;
    var product_mark_id; //拿到url的产品id就请求商城的获取产品信息接口(后加上来的)
    if (Request["product_mark_id"]) {
        product_mark_id = Request["product_mark_id"];
    } else {
        product_mark_id = Request["id"];
    }
    var productService = servers.shopServer;
    // var productService = "192.168.168.16:8088"; //域名变量(内网)
    // var productService = "appbs.tymshop.com:8088"; //域名变量（外网）


    var product = null; //获取到的商品
    var timer2 = ''; //时间计数器
    if (product_mark_id) {
        //获取产品信息
        $.ajax({
            url: 'http://' + productService + '/shop/productService/getProductInfo/' + product_mark_id + "/0",
            type: 'get',
            async: false,
            success: function(data) {
                var state = data.state;
                if (state == '0') {
                    product = data.result;
                    name = product["name"];
                    money = product["price"].toFixed(2);;
                    yuanjia = product["retails"].toFixed(2);
                    coin = product["coin"].toFixed(2);;
                    shipment = product["shipment"];
                    address = JSON.parse(product["address"]);
                    logoImageList = product["logoImageList"];
                    image_list = product["image_list"];
                    remarks = product["remarks"];
                    is_collected = product["is_collected"]; //收藏 0未收藏 1已收藏
                    if (product['activity']) {
                        take = product['activity'];
                    }
                    shopId = product["ms_shop_id"];
                    welfare = product["welfare"];
                    if (welfare > 0) {
                        $('#welfare').text(welfare);
                        $('#hide').css("display", "block");
                        $(".ttd").css({ "background": "#427CFF", "color": "white" });
                        $('#price').css({ "background": "#F7F7F9", "color": "#427CFF", "border-bottom": "1px solid #eee" });
                        $('#theYuan').css("background", "#F7F7F9");
                    }

                    if (is_collected) {
                        $('#is_collected').text("已收藏");
                    } else {
                        $('#is_collected').text('未收藏');
                    }

                    //运费
                    delivery = JSON.parse(product["delivery"]); //0、邮寄 1、包邮  2、到付
                    is_spot = product['is_spot']; //是否可现场领
                    var str = "";
                    if (is_spot) {
                        str = "(可选自取)";
                    }
                    if (delivery == 1) {
                        $('#shipment').text("包邮" + str);

                    } else if (delivery == 2) {
                        $('#shipment').text("到付" + str);

                    } else {
                        $('#shipment').text("￥" + shipment.toFixed(2) + "起" + str);

                    }


                    // console.log(product.is_bargain);
                    // console.log(product.is_seckill);
                    // console.log(product.welfare);
                    // console.log(product.welfare == 0);

                    //砍价商品
                    if (product.is_bargain == 1 && product.is_seckill == 0 && product.welfare == 0) {
                        console.log(11);
                        $('.barginHide').css('display', 'none'); //非砍价价格隐藏
                        $('#activity').css('display', 'none'); //满减满送等优惠活动隐藏
                        $('.isBargain').css('display', 'block'); //砍价详情显示
                        $('.swipe-posfixed').css('display', 'block'); //砍价最多减多少显示
                        $('.activetime').css('display', 'block'); //砍价倒计时显示

                        var minMoney = accMul(money, accSub(1, accDiv(product["bargain_discount"], 100))).toFixed(2);
                        $('.minMoney').text(minMoney); //最低现金
                        var minCoin = accMul(coin, accSub(1, accDiv(product["bargain_discount"], 100))).toFixed(2);
                        $('.minCoin').text(minCoin); //最低购物币

                        $('.sp_count').text(product["stockpile"]); //库存

                        //天天兑价
                        $('.money').text(money);
                        $('.coin').text(coin);
                        $('.yuanjia').text(yuanjia);



                        //砍价
                        $("#mostcut").html(accDiv(accMul(accAdd(coin, money), product["bargain_discount"]), 100).toFixed(2)); //最多减多少

                        var curTime = ""; //当前时间
                        var activityTime = ""; //活动截止时间
                        curTime = Math.round(new Date().getTime() / 1000).toString(); //当前10位时间戳
                        activityTime = accSub(product['bargainDeadline'], curTime); //活动截止时间戳
                        $("#effectivetime").html(timeStampTwo(activityTime)); //活动结束倒计时

                        function timeout2() {
                            if (activityTime <= 0) return;
                            activityTime -= 60;
                            $("#effectivetime").html(timeStampTwo(activityTime)); //活动结束倒计时
                            timer2 = setTimeout(timeout2, 60000);
                        }
                        timeout2();


                    } else {
                        $('.barginHide').css('display', 'block'); //非砍价价格显示
                        $('#activity').css('display', 'block'); //满减满送等优惠活动显示
                        $('.isBargain').css('display', 'none'); //砍价详情隐藏
                        $('.swipe-posfixed').css('display', 'none'); //砍价最多减多少隐藏
                        $('.activetime').css('display', 'none'); //砍价倒计时隐藏

                        //商家优惠活动
                        if (take && take.length) {
                            var is_free = ""; //包邮
                            var sx = ""; //满减

                            for (var i in take) { //遍历活动个数
                                if (take[i].is_free_shipment) { //1、包邮 //算折扣
                                    if (take[i].price_rate == 10.0) {
                                        is_free += "满" + take[i].conditions + "元包邮,";
                                    } else if (take[i].price_rate > 0 && take[i].price_rate < 10) {
                                        is_free += "满" + accDiv(accMul(take[i].conditions, take[i].price_rate), 10) + "元+" + accDiv(accMul(take[i].conditions, take[i].coin_rate), 10) + "购物币包邮,";
                                    } else if (take[i].price_rate == 0.0) {
                                        is_free += "满" + take[i].conditions + "购物币包邮,";
                                    }
                                    is_free = is_free.substring(0, is_free.length - 1);

                                }

                                //大于0满减 等于0减0元省略
                                if (take[i].gift != 0) {
                                    if (take[i].price_rate == 10.0) {
                                        sx += "满" + take[i].conditions + "元减" + take[i].gift + "元,";
                                    } else if (take[i].price_rate > 0 && take[i].price_rate < 10) {
                                        sx += "现金+购物币满" + take[i].conditions + "减" + take[i].gift + ",";
                                    } else if (take[i].price_rate == 0.0) {
                                        sx += "满" + take[i].conditions + "购物币减" + take[i].gift + "购物币,";
                                    }
                                    sx = sx.substring(0, sx.length - 1);

                                }
                            }
                            $('#activity').append('<div class="omit" style="display: block;">' +
                                '<img src="images/take.png" style="width:20px; padding: 5px; vertical-align:middle;"><span class="take">' + is_free + '</span>' +
                                '</div>');
                            $('#activity').append('<div class="omit" style="display: block;">' +
                                '<img src="images/take.png" style="width:20px; padding: 5px; vertical-align:middle;"><span class="take">' + sx + '</span>' +
                                '</div>');
                            $('#activity').css('display', 'block');

                        } else {
                            $('#activity').css('display', 'none');

                        }

                    }

                } else {
                    location.href = "failure.html";
                }
            },
            error: function(err) {
                console.log(err);
            }
        });
        //运费和地址
        $('#province').text(address["province"]);
        $('#city').text(address["city"]);
        if (address["district"]) {
            $('#district').html("&minus;" + address["district"]);
        }

    } else {
        name = decodeURI(Request["name"]);
        money = Request["money"].toFixed(2);;
        yuanjia = Request["retails"].toFixed(2);
        coin = Request["coin"].toFixed(2);;
        shipment = Request["shipment"];
        address = decodeURI(Request["address"].split(","));

        //运费和地址
        var addr = address.split(",");
        $('#province').text(addr[0]);
        $('#city').text(addr[1]);
        if (shipment > 0) {
            $('#shipment').text("￥" + shipment.toFixed(2) + "起");
        } else {
            $('#shipment').text("￥" + shipment.toFixed(2));
        }
        logoImageList = Request["logoImageList"].split(",");
        image_list = Request["image_list"].split(",");
    }



    $('#name').text(name);
    //商品价格 + 购物币
    $('#money').text(money);
    $('#coin').text(coin);


    //天天兑价
    var ttd = accAdd(parseFloat(money), parseFloat(coin));
    $('#ttdMoney').html(ttd);
    //原价
    $('#yuan').text(yuanjia);

    //产品备注
    if (remarks) {
        $('.remarks').text(remarks);
    }

    //6.1获取商店信息(店铺主页)
    function getShopInfo() {
        var shopInfo = {}; //用于存放返回的商家信息
        $.ajax({
            url: 'http://' + productService + '/shop/shopService/getShopInfo/' + shopId + '/55006',
            type: "get",
            dataType: "json",
            async: false,
            success: function(data) {
                if (data.state == 0) { //正常
                    shopInfo = data.result;
                    var titleImg = decodeURIComponent(shopInfo.titleImg);
                    $('#shop img.shoplogo').attr('src', titleImg);
                    $('.shopName').html(shopInfo.name);
                    var tag = [];
                    if (shopInfo.tag) {
                        var tag = JSON.parse(shopInfo.tag);
                        if (tag[0] != "") {
                            $('.tag').css("display", "block").text(tag[0]);
                            $('.tag').parent().css('padding', '5px');
                        }
                    }
                }
            },
            error: function(err) {
                console.log("网络异常");
            }
        });
    }

    getShopInfo();



    //滚动广告图
    var slideImg = JSON.parse(logoImageList);

    if (slideImg.length == 3) {
        for (var i = 0; i < 3; i++) {
            $('.ws_images ul').append('<li>' + '<a href="#"><img id="wows_"' + i + ' src=' + slideImg[0] + '></a>' + '</li>');

        }

    }
    //滚动图片只有一张
    if (slideImg.length == 1) {
        for (var i = 0; i < 3; i++) {
            $('.ws_images ul').append('<li>' + '<a href="#"><img id="wows_"' + i + ' src=' + slideImg[0] + '></a>' + '</li>');

        }
    }
    //滚动图片小于3张
    if (slideImg.length < 3) {
        for (var i = 0; i < 3; i++) {
            //只有两种图片的时候
            if (slideImg[i] == undefined) {
                $('.ws_images ul').append('<li>' + '<a href="#"><img id="wows_"' + i + ' src=' + slideImg[0] + '></a>' + '</li>');
            }
            $('.ws_images ul').append('<li>' + '<a href="#"><img id="wows_"' + i + ' src=' + slideImg[i] + '></a>' + '</li>');
        }
    } else if (slideImg.length > 3) {
        for (var i = 0; i < 3; i++) {
            $('.ws_images ul').append('<li>' + '<a href="#"><img id="wows_"' + i + ' src=' + slideImg[i] + '></a>' + '</li>');

        }
    }

    //商品详情图片
    var infoImg = JSON.parse(image_list);
    if (infoImg.length < 5) {
        for (var i = 0; i < infoImg.length; i++) {
            $('#ImageInfo ul').append('<li>' + '<a href="#"><img src=' + infoImg[i] + '></a>' + '</li>');

        }
    } else {
        for (var i = 0; i < 5; i++) {
            $('#ImageInfo ul').append('<li>' + '<a href="#"><img src=' + infoImg[i] + '></a>' + '</li>');

        }
    }


    //显示倒计时
    function timeStampTwo(second_time) {
        var time = parseInt(second_time) + "秒";
        if (parseInt(second_time) > 60) {
            var second = parseInt(second_time) % 60;
            var min = parseInt(second_time / 60);
            time = "00:" + addTwo(min) + ":" + addTwo(second);

            if (min > 60) {
                min = parseInt(second_time / 60) % 60;
                var hour = parseInt(parseInt(second_time / 60) / 60);
                time = addTwo(hour) + ":" + addTwo(min) + ":" + addTwo(second);

                if (hour > 24) {
                    hour = parseInt(parseInt(second_time / 60) / 60) % 24;
                    var day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24);
                    time = day + "天" + addTwo(hour) + "小时" + addTwo(min) + "分";
                } else {
                    time = 0 + "天" + addTwo(hour) + "小时" + addTwo(min) + "分";
                }
            }
        }
        return time;
    }

    //时间转换成2位数
    function addTwo(num) {
        if (num < 10) {
            return "0" + num;
        } else {
            return num;
        }
    }
    //满减展示
    $('#number').click(function() {
        var height = $('#activity').css('height');

        if (height == "30px") {
            $('#activity').css('height', 'auto');
        } else {
            $('#activity').css('height', '30px');
        }
    });

    //打开弹出询问 “是否有注册过天天兑” 页面
    var type = null; //商品类型
    var pId = null; //当前的产品id//产品ID
    if (getUrlParam("product_mark_id")) {
        pId = getUrlParam("product_mark_id");
    } else {
        pId = getUrlParam('id');
    }

    var pWelfare = product.welfare; //产品福利值
    var pSeckill = product.is_seckill; //产品秒杀

    if (pSeckill == 1) {
        //秒杀产品
        type = 1;
    } else if (pWelfare > 0) {
        //非福利值值产品
        type = 2;
    } else {
        //普通产品
        type = 0;
    }

    var options = [{
        mlink: "AdSu",
        button: document.querySelector('a#appopen'),
        cparams: { mark_id: pId, detail_Type: type }
    }];
    new Mlink(options);

    //打开弹出询问 “是否有注册过天天兑” 页面
    $("#shopCar").click(function() {
        var explorer = navigator.userAgent;
        urlParam = "id=" + pId + "&type=" + type;
        if ((explorer.indexOf("MicroMessenger") > 0 || explorer.indexOf("QQ/") > 0)) {
            if (/(iPhone)/i.test(navigator.userAgent)) {
                $("#phone_browser_word").text("在Safari中打开");
            } else if (/(Android)/i.test(navigator.userAgent)) {
                $("#phone_browser_word").text("在浏览器中打开");
            }
            $("#shadowTips").fadeIn(300);

            $(".shadowTips_mid_left img").click(function() {
                $("#shadowTips").fadeOut(300);
            });
        } else {
            //跳转到注册页面
            location.href = "../TTD-register/register_app.html?lrefereeId=" + getIrefereeId + "&refuserid=" + refuserid + "&" + urlParam;
        }
    });

});