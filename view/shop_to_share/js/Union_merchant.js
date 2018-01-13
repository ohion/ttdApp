 $(function() {

     //获取url参数
     function getUrlParam(name) {
         var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
         var r = window.location.search.substr(1).match(reg); //匹配目标参数
         if (r != null) return unescape(r[2]);
         return null; //返回参数值
     }
     // var token = getUrlParam('token');
     // var appkey = getUrlParam('appKey');


     //全局变量
     var shopInfo = {}; //用于存储返回商家数据的变量
     var goodsInfo = []; //用于存储返回商品数据的变量
     // var nearService = "192.168.168.69:2314"; //域名变量(内网)
     // var nearService = "120.25.129.101:2314"; //域名变量（外网）
     var nearService = servers.nearshopService;
     var lPlatformId = getUrlParam('lPlatformId');
     // lPlatformId = 7602339;

     //获取商家信息
     function getEntity() {
         //发送服务请求 -- 获取商家信息/near/getEntity/平台号
         $.ajax({
             url: "http://" + nearService + "/near/getEntity/" + lPlatformId,
             type: "get",
             dataType: "json",
             async: false,
             success: function(data) {
                 if (data.state == 0) { //正常
                     shopInfo = data.result;
                     //广告图 headImage
                     if (shopInfo.advLink.length > 0) {
                         $('#header').css("background", "url(" + shopInfo.advLink[0] + ") no-repeat center");
                         $('#header').css("background-size", "100%");
                     }
                     $('#name').text(shopInfo.shopName); //店铺名
                     $('#site').text(shopInfo.address); //地址
                 }
             },
             error: function(err) {
                 toast.result("网络异常");
             }
         });
     }
     //跳转到导航地图
     $('#address').click(function() {
         location.href = "MapLocation.html?gpsLat=" + shopInfo.gpsLat + "&gpsLon=" + shopInfo.gpsLon + "&address=" + shopInfo.address; //跳转后没有后退功能 
     });
     getEntity();

     //获取商家评论
     function getCommtent() {
         var comments = {};
         //发送服务请求 -- 获取商家评论 /near/getCommtent/平台号/时间
         $.ajax({
             url: "http://" + nearService + "/near/getCommtent/" + lPlatformId + "/0",
             type: "get",
             dataType: "json",
             async: false,
             success: function(data) {
                 if (data.state == 0) { //正常
                     comments = data.result;
                 }
             },
             error: function(err) {
                 toast.result("网络异常");
             }
         });

         if (comments.length > 0) {
             if (comments.length == 1) {
                 $('#sayList').append('<div class="useSay">' + '<div class="use"><div class="left"><img src="' + comments[0].headImage + '" /></div><div class="useName">' + comments[0].nickName + '</div><div class="time">' + comments[0].addTime + '</div></div>' + '<div class="opinion">' + comments[0].content + '</div>' + '</div>');

             } else {
                 for (var i = 0; i < 2; i++) {
                    if(comments[i].headImage==""){
                        var headImage = "images/dd_mrtx_img_nor@2x.png";
                        comments[i].nickName = comments[i].nickName==""?"未设置昵称":comments[i].nickName;
                     $('#sayList').append('<div class="useSay">' + '<div class="use"><div class="left"><img src="' + headImage + '" /></div><div class="useName">' + comments[i].nickName + '</div><div class="time">' + comments[i].addTime + '</div></div>' + '<div class="opinion">' + comments[i].content + '</div>' + '</div>');
                    }else{
                        comments[i].nickName = comments[i].nickName==""?"未设置昵称":comments[i].nickName;
                     $('#sayList').append('<div class="useSay">' + '<div class="use"><div class="left"><img src="' + comments[i].headImage + '" /></div><div class="useName">' + comments[i].nickName + '</div><div class="time">' + comments[i].addTime + '</div></div>' + '<div class="opinion">' + comments[i].content + '</div>' + '</div>');
                    }
                 }
             }

         } else {
             $('#useSaybar').css('display', 'none');
         }
     }


     //联盟商家产品展示
     function getProduct() {
         //发送服务请求 -- 获取随机推送商品
         $.ajax({
             url: "http://" + nearService + "/near/showProduct/" + lPlatformId + "/1",
             type: "get",
             dataType: "json",
             async: false,
             success: function(data) {
                 if (data.state == 0) { //正常
                     goodsInfo = data.result;
                 }
             },
             error: function(err) {
                 toast.result("网络异常");
             }
         });

         $.each(goodsInfo, function(i, e) {

             if (e.coinType == 1) { //专属购物币                
                 coinPic = "images/ty_zsgwb_icon_sel@2x.png";
                 //class="productMoney" style="color: #427CFF">￥' + e.price + '<img src="' + coinPic + '">' + e.coin + '</div>' + '</div>' + '</div>');
                 $("#productList").append('<div class="goods"><img src="' + e.picLink + '" class="goodsImg" id="goodsImg"><div class="goodsName">' + e.name + '</div>' + '<div class="goodsPrice" style="color:#5400B6;">￥' + e.price.toFixed(2) + '<img src="' + coinPic + '">' + e.coin.toFixed(2) + '</div>' + '</div>' + '</div>');

             } else { //普通购物币
                 coinPic = "images/gouwubi_icon_red_nor.png";
                 // <div class="productMoney" style="color: #FF4848">￥' + e.price + '<img src="' + coinPic + '">' + e.coin + '</div>' + '</div>' + '</div>');
                 $("#productList").append('<div class="goods"><img src="' + e.picLink + '" class="goodsImg" id="goodsImg"><div class="goodsName">' + e.name + '</div>' + '<div class="goodsPrice" style="color:#FF4848;">￥' + e.price.toFixed(2) + '<img src="' + coinPic + '">' + e.coin.toFixed(2) + '</div>' + '</div>' + '</div>');

             }

             // $("#productList").append('<div class="goods"><img src="' + e.picLink + '" class="goodsImg" id="goodsImg"><div class="goodsName">' + e.name + '</div>' + '<div class="goodsPrice">￥' + e.price);

         });
     }


     //展开V (商家营业详情)
     function showInfo() {
         $('#platformId').html(shopInfo.lPlatformId); //平台号
         $('#productFid').html(shopInfo.business); //主营产品
         if (shopInfo.hours == "null" || shopInfo.hours == "") {
             $('#time').html("无信息"); //营业时间
         } else {
             $('#time').html(shopInfo.hours); //营业时间
         }

         $('#ISplace').html(shopInfo.awardingPoints = shopInfo.awardingPoints == "0" ? "否" : "是"); //是否兑换点

     }
     $('#showOrhide').click(function() {
         $('#hideInfo').toggle();
     });


     //商家提供的服务
     function provider() {
         var iPark = shopInfo.park;
         var iWifi = shopInfo.wifi;
         var iDelivery = shopInfo.delivery;

         if (iPark) {
             $('#ipark').css({
                 "background": "url('./images/lmsj_mftc_icon_sel@2x.png') no-repeat",
                 "color": "#FF4848"
             });
         }
         if (iWifi) {
             $('#iWifi').css({
                 "background": "url('./images/lmsj_wifi_icon_sel@2x.png') no-repeat",
                 "color": "#FF4848"
             });
         }
         if (iDelivery) {
             $('#iDelivery').css({
                 "background": "url('./images/lmsj_mfsh_icon_sel@2x.png') no-repeat",
                 "color": "#FF4848"
             });
         }
     }


     //商家点评分
     function pointScore() {
         var score = shopInfo.score; //店铺点评分
         var half = 0; //半颗星数量0

         //判断是否为整数类型   Number.isInteger(3) true
         if (!Number.isInteger(score)) {
             half = 1; //半颗星数量 1
         }
         var scoreInt = parseInt(score);
         var nor = 5 - scoreInt;

         //整数颗数打分
         for (var i = 0; i < scoreInt; i++) {
             $('#level').append('<div><img src="images/lmsjpf_fenshu_butt_sel@2x.png"></div>');
         }

         //不够整颗数打分
         if (half) {
             $('#level').append('<div><img src="images/lmsjpf_fenshuban_butt_sel@2x.png"></div>');
             //未打分的颗数
             for (var i = 0; i < nor - 1; i++) {
                 $('#level').append('<div><img src="images/lmsjpf_fenshu_butt_nor@2x.png"></div>');
             }
         } else { //没有半颗星的分数
             for (var i = 0; i < nor; i++) {
                 $('#level').append('<div><img src="images/lmsjpf_fenshu_butt_nor@2x.png"></div>');
             }
         }

         //显示点评分
         $('#level').append('<div id="core">' + score + '</div>');

     }

     //phone
     $('#call').click(function() {
         window.location.href = 'tel://' + shopInfo.shopPhone;
     });

     getEntity(); //获取商家资料
     provider(); //商家提供的服务
     pointScore(); //显示商家点评分
     getCommtent(); //商家评论
     showInfo(); //点开展示商家详情
     getProduct(); //联盟商家产品展示

 })