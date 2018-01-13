$(function() {

    //获取url参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }
    var shopId = getUrlParam('shopId'); //店铺ID
    var getIrefereeId = getUrlParam('lrefereeId'); //平台号
    var refuserid = getUrlParam('refuserid'); //用户id
    // shopId = 12;
    var all = [
        [],
        [],
        []
    ]; //用于展示所有的产品
    var productList = []; //商品列表

    // var shopService = "192.168.168.17:3005"; //域名变量(内网)
    // var shopService = "192.168.168.16:8088"; //域名变量(内网)
    var shopService = servers.shopServer;
    // var shopService = "appbs.tymshop.com:8088"; //域名变量（外网）
    var coinPic = "images/gouwubi_icon_red_nor.png";
    //return false;
    //6.1获取商店信息(店铺主页)
    function getShopInfo() {
        var shopInfo = {}; //用于存放返回的商家信息
        $.ajax({
            url: 'http://' + shopService + '/shop/shopService/getShopInfo/' + shopId + '/55006',
            type: "get",
            dataType: "json",
            async: false,
            success: function(data) {
                if (data.state == 0) { //正常
                    shopInfo = data.result;
                    var titleImg = decodeURIComponent(shopInfo.titleImg);

                    $('#shopLogo img').attr('src', titleImg);
                    if (shopInfo.adImg) {
                        $('#adImg img').attr('src', shopInfo.adImg);
                    } else {
                        $('#adImg').css('display', 'none');
                    }
                    $('#shopName').html(shopInfo.name);

                    //满减满送包邮
                    var type, str = [];

                    for (var i = 0; i < shopInfo.activity.length; i++) {
                        type = shopInfo.activity[i].type;
                        if (type == 1) {
                            str[i] = "满减";
                        } else if (type == 2) {
                            str[i] = "满送";
                        } else if (type == 3) {
                            str[i] = "包邮";
                        }
                    }
                    if (shopInfo.activity.length != 0) {
                        if (shopInfo.activity.length == 1) {
                            $('.toggle').append('<li><span class="productTake">' + str[0] + '</span>' + shopInfo.activity[0].content + '</li>');
                        } else if (shopInfo.activity.length == 2) {
                            $('.toggle').append('<li><span class="productTake">' + str[0] + '</span>' + shopInfo.activity[0].content + '</li>' +
                                '<div class="activity">' +
                                '<li><span class="productTake">' + str[1] + '</span>' + shopInfo.activity[1].content + '</li>' +
                                '</div>' +
                                ' <div id="clickToggle"><span id="number"></span><img src="images/ty_jiantouxia_icon_nor@2x.png"></div>');
                        } else {
                            $('.toggle').append('<li><span class="productTake">' + str[0] + '</span>' + shopInfo.activity[0].content + '</li>' +
                                '<div class="activity">' +
                                '<li><span class="productTake">' + str[1] + '</span>' + shopInfo.activity[1].content + '</li>' +
                                '<li><span class="productTake">' + str[2] + '</span>' + shopInfo.activity[2].content + '</li>' +
                                '</div>' +
                                ' <div id="clickToggle"><span id="number"></span><img src="images/ty_jiantouxia_icon_nor@2x.png"></div>');
                        }
                    }
                    $('#number').html(shopInfo.activity.length + "个优惠");

                    //店铺标签
                    if (shopInfo.tag) {
                        var tag = JSON.parse(shopInfo.tag);
                        if (tag[0] != "") {
                            $('#shopTag').append("<span>" + tag[0] + "</span>");
                        }
                    }


                }
            },
            error: function(err) {
                console.log("网络异常");
            }
        });
    }

    //点击收藏
    $('#likeBtn').click(function() {
        //跳转到注册页面
        location.href = "../TTD-register/register_app.html?lrefereeId=" + getIrefereeId + "&refuserid=" + refuserid;

    })

    //9.7按综合排序商店获取产品
    function getProductListByShopId(index) {
        //发送服务请求 -- 获取按综合排序产品
        var url = "";
        if (index == 0) {
            url = "getProductListByShopId";
        } else if (index == 1) {
            url = "getShopProductBySales";
        } else if (index == 2) {
            url = "getShopProductByTime";
        } else {

        }

        $.ajax({
            url: 'http://' + shopService + '/shop/productService/' + url + '/' + shopId + '/1/55000',
            type: "get",
            dataType: "json",
            async: false,
            success: function(data) {
                if (data.state == 0) { //正常
                    all[index] = data.result;
                    productList = all[index];
                }
            },
            error: function(err) {
                console.log("网络异常");
            }
        });

        $.each(all[index], function(i, e) {
            var productTag = ""; //产品标签
            if (e.is_bargain == 1) {
                productTag = "砍价";
            } else if (e.is_auth == 1) {
                productTag = "认证";
            } else if (e.is_enoughGif == 1) {
                productTag = "满送";
            } else if (e.is_enoughCut == 1) {
                productTag = "满减";
            }
            if (e.welfare > 0) { //福利值                
                coinPic = "images/sjgouwubi_icon_red_nor.png";
                // $('#goodsList').append('<div class="pd clearfix">' + '<div class="left productPic"><img src="' + e.image + '"></div>' + '<div class=" left productInfo">' + '<div style="margin-top:8px;">' + '<div class="productTag left" style="display:' + (e.is_auth == 1 ? "block" : "none") + '"' + '>认证</div>' + '<div class="productName">' + e.name + '</div>' + '<div class="productTake"  style="display:' + (e.is_enoughCut == 1 ? "block" : "none") + '"' + '>满减</div>' + '</div> ' + '<div class="welfare" style="display: block;">贡献值' + e.welfare + '</div><div class="productMoney" style="color: #427CFF">￥' + e.price + '<img src="' + coinPic + '">' + e.coin + '</div>' + '</div>' + '</div>');
                $('#goodsList').append('<div class="pd clearfix">' + '<div class="left productPic"><img src="' + e.image + '"></div>' + '<div class=" left productInfo">' + '<div style="margin-top:8px;">' + '<div class="productName">' + e.name + '</div>' + '<div class="productTake"  style="display:' + (productTag != "" ? "block" : "none") + '"' + '>' + productTag + '</div>' + '</div> ' + '<div class="welfare" style="display: block;">贡献值' + e.welfare + '</div><div class="productMoney" style="color: #427CFF">￥' + e.price + '<img src="' + coinPic + '">' + e.coin + '</div>' + '</div>' + '</div>');
            } else {
                coinPic = "images/gouwubi_icon_red_nor.png";
                // $('#goodsList').append('<div class="pd clearfix">' + '<div class="left productPic"><img src="' + e.image + '"></div>' + '<div class=" left productInfo">' + '<div style="margin-top:8px;">' + '<div class="productTag left"  style="display:' + (e.is_auth == 1 ? "block" : "none") + '"' + '>认证</div>' + '<div class="productName">' + e.name + '</div>' + '<div class="productTake"  style="display:' + (e.is_enoughCut == 1 ? "block" : "none") + '"' + '>满减</div>' + '</div> ' + '<div class="welfare" style="display: none;">贡献值' + e.welfare + '</div><div class="productMoney" style="color: #FF4848">￥' + e.price + '<img src="' + coinPic + '">' + e.coin + '</div>' + '</div>' + '</div>');
                $('#goodsList').append('<div class="pd clearfix">' + '<div class="left productPic"><img src="' + e.image + '"></div>' + '<div class=" left productInfo">' + '<div style="margin-top:8px;">' + '<div class="productName">' + e.name + '</div>' + '<div class="productTake"  style="display:' + (productTag != "" ? "block" : "none") + '"' + '>' + productTag + '</div>' + '</div> ' + '<div class="welfare" style="display: none;">贡献值' + e.welfare + '</div><div class="productMoney" style="color: #FF4848">￥' + e.price + '<img src="' + coinPic + '">' + e.coin + '</div>' + '</div>' + '</div>');
            }

        });
    }

    getShopInfo(); //获取店铺信息
    getProductListByShopId(0); //供应商产品展示（综合）


    //点击展示方式
    $('#transform').click(function() {
        //获取当前选中导航菜单
        var curIndex = $('ul li.active').index(); //index = 3
        var data = all[curIndex];

        //当前图片是否是默认的图片
        var transformImages = $(this).css('background-image').indexOf('images/sc_xsfs1_butt_nor@2x.png');
        if (transformImages > 0) {
            //一行一列显示
            $(this).css({
                "background": "url('images/dp_xsfs2_butt_nor@2x.png') no-repeat 50% center",
                "background-size": "50%"
            });

            if (data.length > 0) {
                $('#goodsList').html("");
                $.each(data, function(i, e) {
                    var productTag = ""; //产品标签
                    if (e.is_bargain == 1) {
                        productTag = "砍价";
                    } else if (e.is_auth == 1) {
                        productTag = "认证";
                    } else if (e.is_enoughGif == 1) {
                        productTag = "满送";
                    } else if (e.is_enoughCut == 1) {
                        productTag = "满减";
                    }
                    if (e.welfare > 0) { //福利值
                        coinPic = "images/sjgouwubi_icon_red_nor.png";
                        // $('#goodsList').append('<div class="pd clearfix">' + '<div class="left productPic"><img src="' + e.image + '"></div>' + '<div class=" left productInfo">' + '<div style="margin-top:8px;">' + '<div class="productTag left"  style="display:' + (e.is_auth == 1 ? "block" : "none") + '"' + '>认证</div>' + '<div class="productName">' + e.name + '</div>' + '<div class="productTake"  style="display:' + (e.is_enoughCut == 1 ? "block" : "none") + '"' + '>满减</div>' + '</div> ' + '<div class="welfare" style="display:block;">贡献值' + e.welfare + '</div><div class="productMoney" style="color:#427CFF">￥' + e.price + '<img src="' + coinPic + '">' + e.coin + '</div>' + '</div>' + '</div>');
                        $('#goodsList').append('<div class="pd clearfix">' + '<div class="left productPic"><img src="' + e.image + '"></div>' + '<div class=" left productInfo">' + '<div style="margin-top:8px;">' + '<div class="productName">' + e.name + '</div>' + '<div class="productTake"  style="display:' + (productTag != "" ? "block" : "none") + '"' + '>' + productTag + '</div>' + '</div> ' + '<div class="welfare" style="display: block;">贡献值' + e.welfare + '</div><div class="productMoney" style="color: #427CFF">￥' + e.price + '<img src="' + coinPic + '">' + e.coin + '</div>' + '</div>' + '</div>');

                    } else {
                        coinPic = "images/gouwubi_icon_red_nor.png";
                        // $('#goodsList').append('<div class="pd clearfix">' + '<div class="left productPic"><img src="' + e.image + '"></div>' + '<div class=" left productInfo">' + '<div style="margin-top:8px;">' + '<div class="productTag left"  style="display:' + (e.is_auth == 1 ? "block" : "none") + '"' + '>认证</div>' + '<div class="productName">' + e.name + '</div>' + '<div class="productTake"  style="display:' + (e.is_enoughCut == 1 ? "block" : "none") + '"' + '>满减</div>' + '</div> ' + '<div class="welfare" style="display:none;">贡献值' + e.welfare + '</div><div class="productMoney" style="color: #FF4848">￥' + e.price + '<img src="' + coinPic + '">' + e.coin + '</div>' + '</div>' + '</div>');
                        $('#goodsList').append('<div class="pd clearfix">' + '<div class="left productPic"><img src="' + e.image + '"></div>' + '<div class=" left productInfo">' + '<div style="margin-top:8px;">' + '<div class="productName">' + e.name + '</div>' + '<div class="productTake"  style="display:' + (productTag != "" ? "block" : "none") + '"' + '>' + productTag + '</div>' + '</div> ' + '<div class="welfare" style="display: none;">贡献值' + e.welfare + '</div><div class="productMoney" style="color: #FF4848">￥' + e.price + '<img src="' + coinPic + '">' + e.coin + '</div>' + '</div>' + '</div>');

                    }

                });
            }
        } else {
            //一行两列显示
            $(this).css({
                "background": "url('images/sc_xsfs1_butt_nor@2x.png') no-repeat 50% center",
                "background-size": "50%"
            });
            if (data.length > 0) {
                $('#goodsList').html('');

                $.each(data, function(i, e) {
                    var productTag = ""; //产品标签
                    if (e.is_bargain == 1) {
                        productTag = "砍价";
                    } else if (e.is_auth == 1) {
                        productTag = "认证";
                    } else if (e.is_enoughGif == 1) {
                        productTag = "满送";
                    } else if (e.is_enoughCut == 1) {
                        productTag = "满减";
                    }
                    if (e.welfare > 0) { //福利值
                        coinPic = "images/gouwubi@3x.png";
                        //$("#goodsList").append('<div class="goods"><img src="' + e.image + '" class="goodsImg" id="goodsImg"><div style="margin-top:8px;">' + '<div class="productTag left"  style="display:' + (e.is_auth == 1 ? "block" : "none") + '"' + '>认证</div>' + '<div class="productName">' + e.name + '</div>' + '<div class="productTake"  style="display:' + (e.is_enoughCut == 1 ? "block" : "none") + '"' + '>满减</div>' + '</div> ' + '<div class="welfare" style="display:block;">贡献值' + e.welfare + '</div><div class="goodsPrice" style="color:#427CFF">￥' + e.price + '<img src="' + coinPic + '">' + e.coin + '</div></div>');
                        $("#goodsList").append('<div class="goods">' +
                            '<div id="imgBox">' +
                            '<img src="' + e.image + '" class="goodsImg" id="goodsImg">' +
                            ' <div id="shadowBox">' +
                            ' <div class="goodsPrice" style="color:#fff">￥' + e.price +
                            // ' <div class="productTake" style="display:inline-block">' + productTag + '</div>' +
                            '<div class="productTake"  style="display:' + (productTag != "" ? "inline-block" : "none") + '"' + '>' + productTag + '</div>' +
                            ' <br>(<img src="' + coinPic + '">' + e.coin + ')</div>' +
                            '<div class="welfare" style="display:block;">(贡献值' + e.welfare + ')</div>' +
                            '</div>' +
                            '</div>' +
                            ' <div style="margin-top:10px;">' +
                            ' <div class="productName">' + e.name + '</div></div>' +
                            '</div>');

                    } else {
                        // coinPic = "images/gouwubi_icon_red_nor.png";
                        coinPic = "images/gouwubi@3x.png";

                        // $("#goodsList").append('<div class="goods"><img src="' + e.image + '" class="goodsImg" id="goodsImg"><div style="margin-top:8px;">' + '<div class="productTag left"  style="display:' + (e.is_auth == 1 ? "block" : "none") + '"' + '>认证</div>' + '<div class="productName">' + e.name + '</div>' + '<div class="productTake"  style="display:' + (e.is_enoughCut == 1 ? "block" : "none") + '"' + '>满减</div>' + '</div> ' + '<div class="welfare" style="display:none;">贡献值' + e.welfare + '</div><div class="goodsPrice" style="color: #FF4848">￥' + e.price + '<img src="' + coinPic + '">' + e.coin + '</div></div>');
                        $("#goodsList").append('<div class="goods">' +
                            '<div id="imgBox">' +
                            '<img src="' + e.image + '" class="goodsImg" id="goodsImg">' +
                            ' <div id="shadowBox">' +
                            ' <div class="goodsPrice" style="color:#fff">￥' + e.price +
                            // ' <div class="productTake" style="display:inline-block">' + productTag + '</div>' +
                            '<div class="productTake"  style="display:' + (productTag != "" ? "inline-block" : "none") + '"' + '>' + productTag + '</div>' +
                            ' <br>(<img src="' + coinPic + '">' + e.coin + ')</div>' +
                            '</div>' +
                            '</div>' +
                            ' <div style="margin-top:10px;">' +
                            ' <div class="productName">' + e.name + '</div></div>' +
                            '</div>');


                    }

                });
            }
        }

        //商品点击事件
        $('#goodsList .goods').click(function() {
            pEvent($(this).index());
        })
        //商品点击事件
        $('#goodsList .pd').click(function() {
            pEvent($(this).index());
        });

    })





    //交互：用户点击导航栏中的按销量、新品等来展示商品
    $('ul li').click(function() { //获取所有的li元素  
        $('ul li').removeClass('active');
        $(this).addClass('active');

        var index = $(this).index(); //获取li的下标
        if (index == 3) {
            return false;
        }
        $("#goodsList").html(""); //清空
        if (all[index].length > 0) {
            //当前图片是否是默认的图片
            var transformImages = $('#transform').css('background-image').indexOf('images/sc_xsfs1_butt_nor@2x.png');
            if (transformImages < 0) {
                $.each(all[index], function(i, e) {
                    var productTag = ""; //产品标签
                    if (e.is_bargain == 1) {
                        productTag = "砍价";
                    } else if (e.is_auth == 1) {
                        productTag = "认证";
                    } else if (e.is_enoughGif == 1) {
                        productTag = "满送";
                    } else if (e.is_enoughCut == 1) {
                        productTag = "满减";
                    }
                    if (e.welfare > 0) { //福利值
                        coinPic = "images/sjgouwubi_icon_red_nor.png";
                        // $('#goodsList').append('<div class="pd clearfix">' + '<div class="left productPic"><img src="' + e.image + '"></div>' + '<div class=" left productInfo">' + '<div style="margin-top:8px;">' + '<div class="productTag left"  style="display:' + (e.is_auth == 1 ? "block" : "none") + '"' + '>认证</div>' + '<div class="productName">' + e.name + '</div>' + '<div class="productTake"  style="display:' + (e.is_enoughCut == 1 ? "block" : "none") + '"' + '>满减</div>' + '</div> ' + '<div class="welfare" style="display:block;">贡献值' + e.welfare + '</div><div class="productMoney" style="color:#427CFF;">￥' + e.price + '<img src="' + coinPic + '">' + e.coin + '</div>' + '</div>' + '</div>');
                        $('#goodsList').append('<div class="pd clearfix">' + '<div class="left productPic"><img src="' + e.image + '"></div>' + '<div class=" left productInfo">' + '<div style="margin-top:8px;">' + '<div class="productName">' + e.name + '</div>' + '<div class="productTake"  style="display:' + (productTag != "" ? "block" : "none") + '"' + '>' + productTag + '</div>' + '</div> ' + '<div class="welfare" style="display: block;">贡献值' + e.welfare + '</div><div class="productMoney" style="color: #427CFF">￥' + e.price + '<img src="' + coinPic + '">' + e.coin + '</div>' + '</div>' + '</div>');

                    } else {
                        coinPic = "images/gouwubi_icon_red_nor.png";
                        // $('#goodsList').append('<div class="pd clearfix">' + '<div class="left productPic"><img src="' + e.image + '"></div>' + '<div class=" left productInfo">' + '<div style="margin-top:8px;">' + '<div class="productTag left"  style="display:' + (e.is_auth == 1 ? "block" : "none") + '"' + '>认证</div>' + '<div class="productName">' + e.name + '</div>' + '<div class="productTake"  style="display:' + (e.is_enoughCut == 1 ? "block" : "none") + '"' + '>满减</div>' + '</div> ' + '<div class="welfare" style="display:none;">贡献值' + e.welfare + '</div><div class="productMoney" style="color: #FF4848;">￥' + e.price + '<img src="' + coinPic + '">' + e.coin + '</div>' + '</div>' + '</div>');
                        $('#goodsList').append('<div class="pd clearfix">' + '<div class="left productPic"><img src="' + e.image + '"></div>' + '<div class=" left productInfo">' + '<div style="margin-top:8px;">' + '<div class="productName">' + e.name + '</div>' + '<div class="productTake"  style="display:' + (productTag != "" ? "block" : "none") + '"' + '>' + productTag + '</div>' + '</div> ' + '<div class="welfare" style="display: none;">贡献值' + e.welfare + '</div><div class="productMoney" style="color: #FF4848">￥' + e.price + '<img src="' + coinPic + '">' + e.coin + '</div>' + '</div>' + '</div>');

                    }
                });
            } else {
                $.each(all[index], function(i, e) {
                    var productTag = ""; //产品标签
                    if (e.is_bargain == 1) {
                        productTag = "砍价";
                    } else if (e.is_auth == 1) {
                        productTag = "认证";
                    } else if (e.is_enoughGif == 1) {
                        productTag = "满送";
                    } else if (e.is_enoughCut == 1) {
                        productTag = "满减";
                    }
                    if (e.welfare > 0) { //福利值
                        coinPic = "images/gouwubi@3x.png";
                        //$("#goodsList").append('<div class="goods"><img src="' + e.image + '" class="goodsImg" id="goodsImg"><div style="margin-top:8px;">' + '<div class="productTag left"  style="display:' + (e.is_auth == 1 ? "block" : "none") + '"' + '>认证</div>' + '<div class="productName">' + e.name + '</div>' + '<div class="productTake"  style="display:' + (e.is_enoughCut == 1 ? "block" : "none") + '"' + '>满减</div>' + '</div> ' + '<div class="welfare" style="display:block;">贡献值' + e.welfare + '</div><div class="goodsPrice" style="color:#427CFF">￥' + e.price + '<img src="' + coinPic + '">' + e.coin + '</div></div>');
                        $("#goodsList").append('<div class="goods">' +
                            '<div id="imgBox">' +
                            '<img src="' + e.image + '" class="goodsImg" id="goodsImg">' +
                            ' <div id="shadowBox">' +
                            ' <div class="goodsPrice" style="color:#fff">￥' + e.price +
                            '<div class="productTake"  style="display:' + (productTag != "" ? "inline-block" : "none") + '"' + '>' + productTag + '</div>' +
                            ' <br>(<img src="' + coinPic + '">' + e.coin + ')</div>' +
                            '<div class="welfare" style="display:block;">(贡献值' + e.welfare + ')</div>' +
                            '</div>' +
                            '</div>' +
                            ' <div style="margin-top:10px;">' +
                            ' <div class="productName">' + e.name + '</div></div>' +
                            '</div>');
                    } else {
                        // coinPic = "images/gouwubi_icon_red_nor.png";
                        coinPic = "images/gouwubi@3x.png";

                        // $("#goodsList").append('<div class="goods"><img src="' + e.image + '" class="goodsImg" id="goodsImg"><div style="margin-top:8px;">' + '<div class="productTag left"  style="display:' + (e.is_auth == 1 ? "block" : "none") + '"' + '>认证</div>' + '<div class="productName">' + e.name + '</div>' + '<div class="productTake"  style="display:' + (e.is_enoughCut == 1 ? "block" : "none") + '"' + '>满减</div>' + '</div> ' + '<div class="welfare" style="display:none;">贡献值' + e.welfare + '</div><div class="goodsPrice" style="color: #FF4848">￥' + e.price + '<img src="' + coinPic + '">' + e.coin + '</div></div>');
                        $("#goodsList").append('<div class="goods">' +
                            '<div id="imgBox">' +
                            '<img src="' + e.image + '" class="goodsImg" id="goodsImg">' +
                            ' <div id="shadowBox">' +
                            ' <div class="goodsPrice" style="color:#fff">￥' + e.price +
                            // ' <div class="productTake" style="display:inline-block">' + productTag + '</div>' +
                            '<div class="productTake"  style="display:' + (productTag != "" ? "inline-block" : "none") + '"' + '>' + productTag + '</div>' +
                            ' <br>(<img src="' + coinPic + '">' + e.coin + ')</div>' +
                            '</div>' +
                            '</div>' +
                            ' <div style="margin-top:10px;">' +
                            ' <div class="productName">' + e.name + '</div></div>' +
                            '</div>');

                    }

                });
            }

        } else {
            $('#goodsList').html("");
            getProductListByShopId(index); //无缓存数组为空，请求服务
        }
        //商品点击事件
        $('#goodsList .goods').click(function() {
            pEvent($(this).index());
        })
        //商品点击事件
        $('#goodsList .pd').click(function() {
            pEvent($(this).index());
        });

    });


    //商品点击事件
    $('#goodsList .goods').click(function() {
        pEvent($(this).index());
    })
    //商品点击事件
    $('#goodsList .pd').click(function() {
        pEvent($(this).index());
    });
    //满减展示
    $('#number').click(function() {
        // $('.activity').toggle();
        var height = $('#activity').css('height');
        if (height == "39px") {
            $('#activity').css("height", "auto");

        } else {
            $('#activity').css("height", "39px");
        }
    });

    function pEvent(x) {
        var explorer = navigator.userAgent;
        var type = null; //商品类型
        var pId = null; //商品ID

        var pd = productList[x]; //当前点击的产品

        var pWelfare = pd.welfare; //产品福利值
        var pSeckill = pd.is_seckill; //产品秒杀
        pId = pd.id; //产品ID

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

        var urlParam = "id=" + pId + "&type=" + type;

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
    }


})