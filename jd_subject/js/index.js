/**
 * Created by ohion on 2017/9/9.
 */
$(function () {
    var token = getUrlParam("token");
    var usertoken = getUrlParam("usertoken");
    var openplace = "";// 1微信   0 天天兑   2其他浏览器
    var userAgentInfo = navigator.userAgent;
    var isAndroid = userAgentInfo.indexOf('Android') > -1 || userAgentInfo.indexOf('Adr') > -1;//android终端
    var isiOS = !!userAgentInfo.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    var getIrefereeId = getUrlParam('lrefereeId'); //平台号
    var refuserid = getUrlParam('refuserid'); //用户id
    var isApp = getUrlParam('isApp');
    var type = 0;
    var page = 1;
    var tuijianData = [];
    var brandData = ["美的（Midea）", "海尔（Haier）", "松下", "TCL", "悦诗风吟（Innisfree）", "百雀羚", "SK-II", "欧莱雅", "Apple", "三星（SAMSUNG）", "华为（HUAWEI）", "小米"];//品牌列表的数据
    var moreshopId = "";
    var sortIds=getUrlParam("sortIds");
    window.permissionServer = "appbs.tymshop.com:8080";
    if (isApp) {  //在天天兑打开
        openplace = 0;
    } else if (userAgentInfo.toLocaleLowerCase().match(/MicroMessenger/i) == 'micromessenger') {   //在微信打开
        openplace = 1;
    } else {   //在其他浏览器打开
        openplace = 2;
    }
    var docEl = document.documentElement;
    var clientWidth = docEl.clientWidth;
    var scaleWidth = clientWidth / 375;//不同屏幕的适配比例
    var $img  = $(".bg1 img");
    var num = $img.length;
    $img.load(function() {
        num--;
        if (num > 0) {
            return;
        }
        $("body").css("visibility","visible");
    })
    //配置弹出的领取成功页面
    $('#appDialog').dialog({
        autoOpen: false,
        width: 270 * scaleWidth,
        modal: true,
        resizable: false
    });
    //配置弹出的领取成功页面
    $('#wxDialog').dialog({
        autoOpen: false,
        width: 270 * scaleWidth,
        modal: true,
        resizable: false
    });
    var aguesslike = [];
    if(openplace==0){
    	getSort(sortIds || "[]");
    }else{
    	getSort("[]");
    }
    function getSort(sortIds){
    	$.ajax({
            url:"/shop/productService/getJDProductBySortId/"+sortIds,
            type:"get",
            async:false,
            success:function(res){
            	if(res.state==0){
            		render(res.result);
            	} 
            },
            error:function(err){
                console.log(err);
            }
        })
    }
    function render(arr){
        aguesslike = arr;
        var str = "";
        for(var i=0;i<arr.length;i++){
            str+='<li>';
            str+='<div class="imgbox"><img src="'+arr[i].image+'" alt="'+arr[i].name+'"></div>';
            str+='<div class="detailcon">';
            str+='<div class="title">'+arr[i].name+'</div>';
            str+='<div class="p-content"><p>￥'+arr[i].price+' </p><p>+购物币'+arr[i].coin+'</p><p class="gobuy">立即购买</p>';
            str+='</div></div></li>';
        }
        $(".guesslike ul").html(str);
        $(".imgbox").css("height",scaleWidth*173.5);
    }
    $(".guesslike ul li").on("click",function(){
    	var index = $(this).index();
    	var oguess = aguesslike[index];
        var gid = oguess.product_mark_id;
        var gtype = "";
        if (oguess.welfare > 0) {
            gtype = 2;
        } else if (oguess.is_seckill > 0) {
            gtype = 1;
        } else {
            gtype = 0;
        }
        if (openplace == 0) {  //在天天兑打开
            if (isAndroid) {
                window.jsObj.openProductDetail(gid, gtype);//打开产品详情
            }
            if (isiOS) {
                window.location = "TianTianDui://goodInfoRouter?mark_id=" + gid + "&detail_Type=" + gtype; //打开详情页
            }
        } else{
            window.location.href="http://appbs.tymshop.com:8080/appbs/share/share.html?lrefereeId="+getIrefereeId+"&refuserid="+refuserid+ "&id=" + gid + "&type=" + gtype;
        }
    })
    //京东
    $("#jd_reward").on("click", function () {
        var self = this;
        if (openplace == 0) {//在天天兑打开
            if (token) {  //已登录
                toast.loading();
                $.ajax({
                    url: "http://mepay.tymplus.com/GetDataInterfaceToWeb/Activity/GiveActivityReward.aspx",
                    type: "post",
                    data: {
                        sCondition: token
                    },
                    cache:false,
                    timeout:5000,
                    success: function (res) {
                        var result = JSON.parse(res);
                        if (result.iRet == 0) {
                            toast.result("领取成功");
                            $("#receivecoin").html(result.dGiveShopCoin);
                            $("#appDialog").dialog("open");
                        } else {
                            toast.result(result.err);
                        }
                    },
                    error: function (err) {
                        toast.result(err);
                    }
                });
            } else {  //未登录
                if (isAndroid) {
                    window.jsObj.pickupgwb_unlogin();
                }
                if (isiOS) {
                    //到登陆
                    location.href = "tiantiandui://pickupgwb_unlogin";
                }
            }
        } else {
            $("#wxDialog").dialog("open");
        }
    });
    //转发
    $(".dialogbox .btn").on("click", function () {
        //分享
        if (isAndroid) {
            window.jsObj.forwardShare();
        }
        if (isiOS) {
            $("#appDialog").dialog("close");
            window.location = "tiantiandui://forwarding"; //分享
        }
    });
    $(".close").on("click", function () {
        $("#appDialog").dialog("close");
        $("#wxDialog").dialog("close");
    });
    //领取购物币  确定 到注册页
    $(".btnsure").on("click", function () {
        $("#wxDialog").dialog("close");
        location.href = "http://"+permissionServer+"/appbs/TTD-register/register_app.html?lrefereeId=" + getIrefereeId + "&refuserid=" + refuserid ;
    })
    //品牌
    $(".autumn-new ul li").on("click", function () {
        var index = $(this).index();
        var brand_name = brandData[index];
        if (openplace == 0) {  //在天天兑打开
            if (isAndroid) {
                window.jsObj.jdBrandProduct(brand_name);//打开品牌详情
            }
            if (isiOS) {
                window.location = "tiantiandui://brandProductList?brand_name=" + brand_name; //打开品牌详情页
            }
        } else  if ((userAgentInfo.indexOf("MicroMessenger") > 0 || userAgentInfo.indexOf("QQ/") > 0)) { //微信或者QQ
            if (/(iPhone)/i.test(navigator.userAgent)) {
                $("#phone_browser_word").text("在Safari中打开");
            } else if (/(Android)/i.test(navigator.userAgent)) {
                $("#phone_browser_word").text("在浏览器中打开");
            }
            $("#shadowTips").fadeIn(300);
            $(".shadowTips_mid_left img").click(function () {
                $("#shadowTips").fadeOut(300);
            });
        } else {
            //跳转到注册页面
            location.href = "http://"+permissionServer+"/appbs/TTD-register/register_app.html?lrefereeId=" + getIrefereeId + "&refuserid=" + refuserid + "&brandName=" + brand_name;
        }
    });
    //初始化下拉加载
    $('.shop-content').dropload({
        scrollArea: window,
        autoLoad: true,
        loadDownFn: function (me) {
            if (page > 4) {
                me.noData(true);
                me.resetload();
                return;
            } else {
                sort(type, page, me);
                page++;
            }
        },
        domDown: {
            domClass: 'dropload-down',
            domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
            domLoad: '<div class="dropload-load"><p class="loading"></p><p class="loadtip">加载中...</p></div>',
            domNoData: '<div class="dropload-noData"><div class="bottom" >查看更多商品</div></div>'
        },
    });
    //点击查看更多   跳到店铺
    $("body").on("click", ".bottom", function () {
        var shopId = moreshopId;
        if (openplace == 0) {  //在天天兑打开
            if (isAndroid) {
                window.jsObj.toShop(shopId);//打开店铺
            }
            if (isiOS) {
                window.location = "tiantiandui://storeProductList?storeId=" + shopId;
            }
        } else if ((userAgentInfo.indexOf("MicroMessenger") > 0 || userAgentInfo.indexOf("QQ/") > 0)) { //微信或者QQ
            if (/(iPhone)/i.test(navigator.userAgent)) {
                $("#phone_browser_word").text("在Safari中打开");
            } else if (/(Android)/i.test(navigator.userAgent)) {
                $("#phone_browser_word").text("在浏览器中打开");
            }
            $("#shadowTips").fadeIn(300);
            $(".shadowTips_mid_left img").click(function () {
                $("#shadowTips").fadeOut(300);
            });
        } else {
            location.href = "http://"+permissionServer+"/appbs/TTD-register/register_app.html?lrefereeId=" + getIrefereeId + "&refuserid=" + refuserid + "&shopId=" + shopId;
        }
    });
    //返回顶部
    $("body").on("click", ".toTop", function () {
        $("body").animate({scrollTop: 0}, {
            speed: 5000,
            easing: "swing"
        });
    });
    var oscroll = getScroll();
    window.onscroll = function () {
        if (oscroll.scrollTop > 2700) {
            $(".toTop").fadeIn();
        } else {
            $(".toTop").fadeOut();
        }
    };
    //封装获取scrollTop方法
    function getScroll() {
        if (window.getComputedStyle) {
            return document.body;//支持谷歌
        } else {
            return document.documentElement;//支持IE
        }
    }
    function sort(type, page, me) {
        if (!page) {
            page = 1;
        }
        $.ajax({
            url: "/shop/productService/getProductListByType/10/" + type + "/" + page,//type:0综合排序   1销量排序
            type: "get",
            success: function (res) {
                if (res.state == 0) {
                    var waittime = "";
                    if(page==1){
                        waittime = 0;
                    }else{
                        waittime = 1000;
                    }
                    setTimeout(function () {
                        setListData(res.result);
                        if (me) {
                            me.resetload();
                        }
                    }, waittime);
                } else {
                    if (me) {
                        me.lock();
                        // 无数据
                        me.noData();
                    }
                }
            },
            error: function (err) {
                if (me) {
                    me.noData();
                    me.resetload();
                }
                console.log(err);
            }
        });
    }
    
    function setListData(data) {
        var dataArr = data;
        var str = "";
        moreshopId = data[0].ms_shop_id;
        if ($(".shop-nav ul li:nth-child(3)").hasClass("sortTwo2")) {
            for (var i = 0, length = dataArr.length; i < length; i++) {
                str += '<dl class="dl-all">';
                str += ' <dt  class="dt-all"><img src=' + dataArr[i].image + '  alt='+dataArr[i].name+'  width="120" height="120"></dt>';
                str += '<dd  class="dd-all">';
                str += '<p>' + dataArr[i].name + '</p>';
                str += '<p>￥' + dataArr[i].price.toFixed(2) + ' <img src="image/gouwubi2.png" alt="">' + dataArr[i].coin.toFixed(2) + '</p>';
                str += '</dd>';
                str += '</dl>';
                var tempobj = {};  //存储更多砍价商品 跳转所需的数据
                for (var key in dataArr[i]) {
                    if (key == "is_seckill" || key == "product_mark_id" || key == "welfare") {
                        tempobj[key] = dataArr[i][key];
                    }
                }
                tuijianData.push(tempobj);
            }
            $(".dl-content").append(str);
            var lazywidth = 120*scaleWidth;
            $("dl dt img").attr("height",lazywidth);

        } else {
            for (var i = 0, length = dataArr.length; i < length; i++) {
                str += '<dl>';
                str += ' <dt><img src=' + dataArr[i].image + ' alt="'+dataArr[i].name+'"  width="186" height="186"></dt>';
                str += '<dd>';
                str += '<p>' + dataArr[i].name + '</p>';
                str += '<p>￥' + dataArr[i].price.toFixed(2) + ' <img src="image/gouwubi2.png" alt="">' + dataArr[i].coin.toFixed(2) + '</p>';
                str += '</dd>';
                str += '</dl>';
                var tempobj = {};  //存储更多砍价商品 跳转所需的数据
                for (var key in dataArr[i]) {
                    if (key == "is_seckill" || key == "product_mark_id" || key == "welfare") {
                        tempobj[key] = dataArr[i][key];
                    }
                }
                tuijianData.push(tempobj);
            }
            $(".dl-content").append(str);
            var lazywidth = 186*scaleWidth;
            $("dl dt img").attr("height",lazywidth);
        }
    }
    // 综合排序
    $(".allBy").click(function () {
        $(this).addClass("active").siblings("li").removeClass("active");
        type = 0;
        page = 1;
        $(".dl-content").html("");
        tuijianData = [];
        $(".dropload-down").remove();
        $('.shop-content').dropload({
            scrollArea: window,
            autoLoad: true,
            loadDownFn: function (me) {
                if (page > 4) {
                    me.noData(true);
                    me.resetload();
                    return;
                } else {
                    sort(type, page, me);
                    page++;
                }
            },
            domDown: {
                domClass: 'dropload-down',
                domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
                domLoad: '<div class="dropload-load"><p class="loading"></p><p class="loadtip">加载中...</p></div>',
                domNoData: '<div class="dropload-noData"><div class="bottom" >查看更多商品</div></div>'
            },
        });
    });
    //销量排序
    $(".countBy").on("click", function () {
        $(this).addClass("active").siblings("li").removeClass("active");
        type = 1;
        page = 1;
        $(".dl-content").html("");
        tuijianData = [];
        $(".dropload-down").remove();
        $('.shop-content').dropload({
            scrollArea: window,
            autoLoad: true,
            loadDownFn: function (me) {
                if (page > 4) {
                    me.noData(true);
                    me.resetload();
                    return;
                } else {
                    sort(type, page, me);
                    page++;
                }
            },
            domDown: {
                domClass: 'dropload-down',
                domRefresh: '<div class="dropload-refresh">↑上拉加载更多</div>',
                domLoad: '<div class="dropload-load"><p class="loading"></p><p class="loadtip">加载中...</p></div>',
                domNoData: '<div class="dropload-noData"><div class="bottom" >查看更多商品</div></div>'
            },
        });
    });
    //商品详情
    $(".shop-content").on("click", ".dl-content dl", function () {
        var index = $(this).index();
        var tuijianobj = tuijianData[index];
        var tid = tuijianobj.product_mark_id;
        var itype = "";
        if (tuijianobj.welfare > 0) {
            itype = 2;
            // // detail_Type = 0 //普通详情
            // detail_Type = 1 //秒杀详情
            // detail_Type = 2 //福利值详情
        } else if (tuijianobj.is_seckill > 0) {
            itype = 1;
        } else {
            itype = 0;
        }
        if (openplace == 0) {  //在天天兑打开
            if (isAndroid) {
                window.jsObj.openProductDetail(tid, itype);//打开产品详情
            }
            if (isiOS) {
                window.location = "TianTianDui://goodInfoRouter?mark_id=" + tid + "&detail_Type=" + itype; //打开详情页
            }
        } else{
            window.location.href="http://appbs.tymshop.com:8080/appbs/share/share.html?lrefereeId="+getIrefereeId+"&refuserid="+refuserid+"&product_mark_id="+ "&id=" + tid + "&type=" + itype;
        }
    });
    //切换视图
    $(".sortTwo").on("click", function () {
        $(".dl-content dl").toggleClass("dl-all");
        $(".dl-content dl dt").toggleClass("dt-all");
        $(".dl-content dl dd").toggleClass("dd-all");
        $(this).toggleClass("sortTwo2").toggleClass("sortTwo");
        var lazywidth = "";
        if ($(".shop-nav ul li:nth-child(3)").hasClass("sortTwo2")) {
            lazywidth = 120*(document.documentElement.clientWidth/375);
        }else{
            lazywidth = 186*(document.documentElement.clientWidth/375);
        }
        $("dl dt img").attr("height",lazywidth);
    });
});