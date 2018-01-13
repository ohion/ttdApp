/**
 * Created by ganruip on 2015/11/19.
 */
$(document).ready(function(){
    location.href = "#top";
    var windowScroll = 0;//初始化滚动位置，记录滚动(安卓端监听滚动)
    
    //var seckillProisRoaded = false;//记录秒杀商品是否已加载
    //var seckillProImgisRoaded = false;//记录秒杀商品图片是否已加载
    var nearShopisRoaded = false;//记录附近消费商家是否已加载
    var indianaProisRoaded = false;//记录夺宝商品是否已加载
    var indianaProImgisRoaded = false;//记录夺宝商品图片是否已加载
    var vipProisRoaded = false;//记录vip商品是否已加载
    var firLineVipProImgisRoaded = false;//记录vip商品12两张图片是否已加载
    var secLineVipProImgisRoaded = false;//记录vip商品34两张图片是否已加载
    var thirdLineVipProImgisRoaded = false;//记录vip商品56两张图片是否已加载
    var fourLineVipProImgisRoaded = false;//记录vip商品78两张图片是否已加载

    var pageIsFinishRoaded = false;//记录页面是否滚动至底部

    var requestNearShopErrOrNull = false;//请求附近商家是否有数据或请求错误
    //var requestSeckillErrOrNull = false;//请求秒杀是否有数据或请求错误
    var requestIndianaErrOrNull = false;//请求夺宝是否有数据或请求错误
    var requestVipErrOrNull = false;//请求vip是否有数据或请求错误
    
    //var seckillImgInterval = null;//秒杀图片加载计时器
    var indianaImgInterval = null;//夺宝图片加载计时器
    var firLineVipImgInterval = null;//第1-2张vip图片加载计时器
    var secLineVipImgInterval = null;//第3-4张vip图片加载计时器
    var thirdLineVipImgInterval = null;//第5-6张vip图片加载计时器
    var fourLineVipImgInterval = null;//第7-8张vip图片加载计时器

    //获取url参数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var url = decodeURI(window.location.search);
        var r = url.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    }
    var cityName = getQueryString("cityName");//截取城市
    var xLoc = getQueryString("x");//截取x
    var yLoc = getQueryString("y");//截取y
    var phone = getQueryString("phone");//截取phone
    var userId = getQueryString("userId");//截取userId
    console.log('城市'+cityName+'x:'+xLoc+'y:'+yLoc+'phone:'+phone+'userId:'+userId);

    //还应考虑网络异常情况的处理
    //请求的图片太大
    setSecToEleUrl();
    setUI();
    requestFirstLogoData();//请求生活圈数据
    setNearShopUrl();//设置附近消费8分类url
    //requestVipData();
    setScrollListen();//设置滚动监听

    //设置UI
    function setUI(){
        if(!(/(Android)/i.test(navigator.userAgent))){//ios边框略粗应减淡颜色
            $(".box").css("border-color","#EEEEEE");
            $(".big-box").css("border-color","#EEEEEE");
            $(".sudoku").css("border-color","#EEEEEE");
        }
    }
    //请求生活圈数据
    function requestFirstLogoData(){
        //异步请求
        //var url = 'http://main.tymplus.com/Interface/HomeInterface.aspx?user_id='+userId+'&CityName='+cityName;
        var tymUrl = 'http://main.tymplus.com/Interface/HomeInterface2.aspx?user_id='+userId+'&CityName='+cityName;
        //请求生活圈第一个图标
        $.ajax({
           url : tymUrl,
            timeout : 5000,
            type : 'post',
            success : function(data){ //请求成功的回调函数
                if(data.length == 0){
                    console.log("tym腕表数据为空");
                    firstLogoErrOrNull();
                }else{
                    var tymshopBox = $(".tymshop");
                    //tymshopBox.css("opacity","0");
                    if(data[0].URL != ''){
                        tymshopBox.attr("href",data[0].URL);
                    }
                    //tymshopBox.find("div").eq(0).css("background-image","url("+data[0].pic+")");
                    tymshopBox.find("div").eq(1).text(decodeURI(data[0].shopname));
                    $("#tymText").css("visibility","visible");
                    //tymshopBox.animate({opacity:"1"},300);
                }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                console.log("tymwb:" + status);
                if(status == 'timeout' || status == 'error'){//超时,status还有success,error等值的情况
                    console.log("tym腕表请求超时或错误");
                    firstLogoErrOrNull();
                }
            }
        });
    }

    //生活圈请求错误或者数据为空处理,type: 0-tym腕表错误，1-其他错误
    function firstLogoErrOrNull(){
        //var url = "http://main.tymplus.com/newSkin/meyou-shop.aspx?isClient=Main&shopname=%e7%8f%a0%e6%b5%b7…%e5%8f%b8&matoId=100001&CityName=珠海市&title=TIYOUME腕表";
        $("#tymText").css("visibility","visible");//显示文本
        var url = "http://main.tymplus.com/newSkin/Meyou-NewShop.aspx?user_id="+userId+"&type=1&isClient=Main&shopname=%e7%8f%a0%e6%b5%b7%e5%a4%a9%e7%bc%98%e7%be%8e%e6%8a%95%e8%b5%84%e6%8e%a7%e8%82%a1%e6%9c%89%e9%99%90%e5%85%ac%e5%8f%b8&matoId=100001&CityName=%e7%8f%a0%e6%b5%b7%e5%b8%82";
        $(".box").eq(0).attr("href",url);
    }

    //设置2-11图标链接地址
    function setSecToEleUrl(){
        var info = {
          sMobile : phone,
          lUserid : userId
        };
        var aesString = encodeURI(Lock("!@#$%^&*()QWERTY",JSON.stringify(info),4));
        console.log(aesString);

        //bigBoxAddBuzzAnim();//全面推广抖动动画
        setLivingCircleColor();//设置颜色防止部分手机(安卓)背景色异常
        var urls = [
            "http://vip2.tymplus.com/index-1.aspx?user_id=" + userId + "&CityName=" + cityName + "&title=购物币商城"+'&phone=' + phone,
            "http://vip2.tymplus.com/good_hot.aspx?orderby=add&user_id=" + userId + "&NewProducts=1",//新品上市
            "http://main.tymplus.com/newSkin/shop-Newlist.aspx?search_text=&oderType=0&City=&leibie=&oderZiDuan=Price&ClassID=&Price=全部&isClient=Main&user_id=" + userId + "&Attribute=限购",//天天特价
            //"http://main.tymplus.com/newSkin/shop-Newlist.aspx?search_text=&oderType=1&City=&leibie=&oderZiDuan=AddTime&ClassID=&Price=全部&isClient=Main&user_id=" + userId + "&Attribute=限购",//天天特价
            "http://seabuyshop.tymplus.com/HomePage.aspx?user_id=" + userId + "&CityName=" + cityName + "&title=尚进乐购"+'&phone=' + phone,
            "http://tym.bstoapp.com/ThePeopleExtension?user_id=" + userId + "&CityName=" + cityName + "&title=全民推广"+'&phone=' + phone,
            "http://taking2.tymplus.com/LocalTaking.aspx?user_id=" + userId + "&phone=" + phone + "&CityName=" + cityName + "&title=1元云购",
            "../cardbag/cardbag.html?userId=" + userId + "&phone=" + phone,//卡包
            //"http://main.tymplus.com/newSkin/shop-Newlist.aspx?search_text=&oderType=1&City=&leibie=&oderZiDuan=AddTime&ClassID=&Price=全部&NoLogisics=0&isClient=Main&user_id=" + userId + "&Attribute=",//美淘
            //"http://main.tymplus.com/newSkin/shop-Newlist.aspx?search_text=&oderType=1&City=&leibie=&oderZiDuan=AddTime&ClassID=&Price=全部&NoLogisics=1&isClient=Main&user_id=" + userId + "&Attribute=",//美淘券
            //"seckill_ticket/tips.html?Phone=" + phone,//秒杀
            "http://mepay.tymplus.com/ExternalCallsUI/PersonalAgent/PersonalAgentOrder.aspx?sCondition=" + aesString,//个人申请
            //"http://mepay.tymplus.com/MobileClient/PosRecord/ReceiveRecords.aspx?phone=" + phone,//pos机
            "http://vip2.tymplus.com/good_hot.aspx?orderby=add&user_id=" + userId + "&NewProducts=2",//货架商品
            "../enjoy_shop/index.html",
            //"http://yigong.tymplus.cn/APP/Index.aspx?user_id=" + userId + "&CityName=" + cityName + "&title=义工"+'&phone=' + phone,
        ];
        for(var i in urls){
            $(".sec-ele").eq(i).attr("href",urls[i]);
        }
        $("#indiana-more").attr("href",urls[5]);//赋值"更多"url
        //$("#seckill-more").attr("href",urls[1]);//赋值"更多"url
        $("#vip-more").attr("href",urls[0]);//赋值"更多"url
    }

    //解决安卓低版本a标签背景红色
    function setLivingCircleColor(){
        $(".box").css({
            'background-color':"transparent",
            'color':"black"
        });
        $(".big-box").css({
            'background-color':"transparent",
            'color':"black",
        });
    }

    //为全民推广图添加抖动动画
    function bigBoxAddBuzzAnim(){
        setInterval(function(){
            $(".big-box").find("div").removeClass("buzz");
            var aniTimeout = setTimeout(function(){
                $(".big-box").find("div").addClass("buzz");
                clearTimeout(aniTimeout);
            },1);
        },2000);
    }

    //设置附近消费八大分类url
    function setNearShopUrl(){
        $("#nearShopCateBox a").each(function(){
            //$(this).attr("href","http://mepay.tymplus.com/MobileClient/PointShop/index.aspx?type=%27"+$(this).find("div").eq(1).text()+"%27&userID="+userId+"&x="+xLoc+"&y="+yLoc);
            $(this).attr("href","http://toGround?type="+$(this).find("div").eq(1).text());
        })
    }

    //请求附近联盟消费
    function requesrNearShopData(){
        console.log("requesrNearShopData");
        var url = "http://mepay.tymplus.com/GetDataInterface/GetTopTenData.aspx?x="+xLoc+"&y="+yLoc;
        $.ajax({
            url : url,
            timeout : 5000,
            type : 'post',
            success : function(data){ //请求成功的回调函数
                if(data.length == 0){
                    requestNearShopErrOrNull = true;
                    errorAnim($("#near-shop-box"),'没有找到相关商店!',0);
                }else{
                    console.log("near==="+data);
                    console.log("requesr near成功");
                    console.log(data);
                    console.log("覆盖附近商家数据");
                    data.splice(data.length-1,1);//获取json数组里的商铺数组(除更多url外的数据)
                    for(var i = 0;i < data.length; i++){
                        data[i].detailUr += '&UserID='+userId+'&x='+xLoc+'&y='+yLoc;//补上美信号、坐标xy
                        if(data[i].Distance >= 1000){//如果超过1000m则变成km单位
                            data[i].Distance = Math.floor(data[i].Distance / 1000) + 'k';
                        }
                    }
                    var template = '<a class="c-wh ub ub-ver shop-box">'+
                        '<ul class="ubb ub b-gra-pM1 bc-text lis near-box">'+
                        '<li class="ub-img ub ub-ver mar-ar1 near-top-left">'+
                        '<div class="img shop-img"></div>'+
                        '</li>'+
                        '<li class="uw-pM2 ub ub-ver">'+
                        '<div class="uof ulev0 line-hei mar-ar1 shop-name"></div>'+
                        '<div class="uof ulev-p1 line-hei mar-t near-color">'+
                        '<span class="ulev0">消费送</span><span class="present-num"><span class="shop-give-card">50</span><span class="ulev-4">%</span></span><span class="ulev-4">购物币</span>'+
                        '<div class="ulev-4 exchange-point">兑换点</div>'+
                        '</div>'+
                        '<div class="ulev-1" style="color: gray;">'+
                        '<div class="ut-s mar-t" style="width: 40%;float: left;"><span class="major-sell">其他</span>|<span class="city">珠海</span></div>'+
                        '<div class="ut-s uw-app2 mar-t tx-r" style="width: 53%;float: right;padding-right: 1em;">'+
                        '<span class="avg-box">人均:<span class="shop-per-avg">20</span>元&nbsp;</span>'+
                        '<span class="shop-distance">2000</span>m'+
                        '</div>'+
                        '</div>'+
                        '</li>'+
                        '</ul>'+
                        '</a>';
                    if(data.length > 3){
                        for(var i in data.slice(3)){//多于3条数据，往后添加模板
                            $("#near-shop-box").append(template);
                        }
                    }
                    var newNearShops = data;
                    for(var i in newNearShops){
                        var curShopBox = $(".shop-box").eq(i);
                        if(newNearShops[i].detailUr != ''){
                            curShopBox.attr("href",newNearShops[i].detailUr);
                        }
                        curShopBox.find(".shop-img").attr("data-img",newNearShops[i].TitlePhoto);
                        curShopBox.find(".shop-distance").text(newNearShops[i].Distance);
                        curShopBox.find(".shop-name").text(newNearShops[i].ShopName);
                        if(newNearShops[i].AverageCpt == '0'){//如果人均为0则不显示
                            curShopBox.find(".avg-box").css("display","none");
                        }else{
                            curShopBox.find(".shop-per-avg").text(newNearShops[i].AverageCpt);
                        }
                        //curShopBox.find(".shop-per-avg").text(newNearShops[i].AverageCpt);
                        curShopBox.find(".shop-give-card").text(newNearShops[i].Proportion);
                        curShopBox.find(".exchange-point").css("display",(newNearShops[i].MoneyExchange == '1') ? "block" : "none");
                        curShopBox.find(".major-sell").text(newNearShops[i].MainProduct);
                        curShopBox.find(".city").text(newNearShops[i].City);
                        roadImg($(".shop-img").eq(i));
                    }
                    //设置第一个商家图片切换淡入动画
                }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                console.log("near:" + status);
                if(status == 'timeout' || status == 'error'){//超时,status还有success,error等值的情况
                    console.log("附近商店请求超时或错误");
                    requestNearShopErrOrNull = true;
                    errorAnim($("#near-shop-box"),'没有找到相关商店!',0);
                }
            }
        });
    }

    //网络异常或无数据的动画,msg=显示的提示,type=动画类型,值为0-同时淡出缩短,为1-先淡出再缩短(针对较长模块,即vip模块)
    function errorAnim(box,msg,type){
        var fadeIn = function(){
            box.html('<div style="text-align: center;color: gray;height: 5em;line-height: 5em;">'+msg+'</div>');
            box.animate({opacity:'1'},"500");
        }
        if(type == 0){
            box.animate({height:'5em',opacity:'0'},"2000",fadeIn);
        }else{
            box.animate({opacity:'0'},"1250");
            box.animate({height:'5em'},"750",fadeIn);
        }
    }

    //图片延时加载淡入效果
    function roadImg(img){
        if(img.attr("data-img") != undefined){
            console.log("替换图片");
            img.css({opacity:'0'});
            img.css("background-image","url("+img.attr("data-img")+")");
            img.removeAttr("data-img");
            img.animate({opacity:'1'},"1500");
            console.log(img.attr("data-img"));
            return true;
        }
    }

    //请求夺宝数据
    function requestIndianaData(){
        var url = 'http://taking2.tymplus.com/taking/TakeProNew.aspx?CityName='+cityName;
        $.ajax({
            url : url,
            timeout : 5000,
            type : 'post',
            dataType : 'json',
            success : function(data){ //请求成功的回调函数
                if(data.length == 0){
                    //清空加载图片计时器
                    if(indianaImgInterval != null){
                        clearInterval(indianaImgInterval);//清除计时器(知道图片加载完才停止的计时器，若无数据则立即去清除此计时器)
                    }
                    requestIndianaErrOrNull = true;
                    errorAnim($("#indiana-box"),'没有找到相关商品!',0);
                }else{
                    for(var i = 0;i < data.length;i++){
                        console.log(data[i]);
                        data[i].Url += '&user_id=' + userId;//加上用户ID参数值
                    }
                    var indianaPros = data;
                    console.log("覆盖夺宝数据");
                    for(var i in indianaPros){
                        if(indianaPros[i].Url != ''){
                            $("#indiana-box").find(".product-box").eq(i).attr("href",indianaPros[i].Url);
                        }
                        $("#indiana-box").find(".product-box").eq(i).find(".product-img").attr("data-img",indianaPros[i].TitlePic);
                        $("#indiana-box").find(".product-box").eq(i).find(".product-name").text(indianaPros[i].ProductName);
                        $("#indiana-box").find(".product-box").eq(i).find(".shop-coin").text(indianaPros[i].Integral);
                        $("#indiana-box").find(".product-box").eq(i).find(".bind-cash").text(indianaPros[i].Integral);
                        $("#indiana-box").find(".product-box").eq(i).find(".inventory").text(indianaPros[i].Residue);
                        $("#indiana-box").find(".product-box").eq(i).find(".join-num").text(indianaPros[i].LastBuyNo);//缺少参与人数
                    }
                }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                console.log("夺宝:" + status);
                if(status == 'timeout' || status == 'error'){//超时,status还有success,error等值的情况
                    console.log("夺宝请求超时或错误");
                    if(indianaImgInterval != null){
                        clearInterval(indianaImgInterval);//清除计时器(知道图片加载完才停止的计时器，若无数据则立即去清除此计时器)
                    }
                    requestIndianaErrOrNull = true;
                    errorAnim($("#indiana-box"),'没有找到相关商品!',0);
                }
            }
        });
    }

    //处理vip请求数据为空或出现错误
    function handleVipReqNullOrERR(){
        //清空加载图片计时器
        if(firLineVipImgInterval != null){
            clearInterval(firLineVipImgInterval);
        }
        if(secLineVipImgInterval != null){
            clearInterval(secLineVipImgInterval);
        }
        if(thirdLineVipImgInterval != null){
            clearInterval(thirdLineVipImgInterval);
        }
        if(fourLineVipImgInterval != null){
            clearInterval(fourLineVipImgInterval);
        }
        requestVipErrOrNull = true;
        errorAnim($("#vip-box"),'没有找到相关商品!',1);
    }

    //请求vip数据
    function requestVipData(){
        var url = 'http://vip2.tymplus.com/IVip/IGetProduct.aspx?user_id='+userId;
        //var url = 'http://vip.tymplus.com/IVip/IGetProduct.aspx?user_id='+userId;
        $.ajax({
            url : url,
            timeout : 5000,
            type : 'post',
            success : function(data){ //请求成功的回调函数
                if(data.length == 0){
                    handleVipReqNullOrERR();
                }else{
                    var vipPros = data;
                    console.log("覆盖vip数据");
                    if(vipPros.length > 4){
                        console.log("超过4条:"+vipPros.length);
                        var index = 2;
                        var curIndex = 0;
                        var template = '<a class="c-wh ub ub-ver product-box mar-r">'+
                            '<div class="product-img ub-fh"></div>'+
                            '<div class="product-box-bottom">'+
                            '<div class="ub">'+
                            '<div class="ulev0 t-gra-ele umw-eleL ut-s ub-f1 product-name">奢谷SHEGU 2015女士韩版上衣啊是的代购费</div>'+
                            '</div>'+
                            '<div class="ub seckill-line2 mar-mt">'+
                            '<div class="font-lev-1 t-gra-ele umw-eleL ut-s ub-f1">'+
                            '<span class="vip-color">￥<span class="ulev2 shop-coin">10</span></span>购物币'+
                            '<div>&nbsp;+<span class="inventory">5</span>元现金</div>'+
                            '</div>'+
                            '<div class="ufm1 t-red-eleL ulev0 ub-pe sc-text-warn tx-c vip-bg vip-btn">立即抢</div>'+
                            '</div>'+
                            '</div>'+
                            '</a>';
                        for(var i in vipPros.slice(4)){
                            if(i % 2 == 0){
                                $("#vip-box").append('<div class="ub mar-mt mar-r vip-line-box">');
                                curIndex = index++;
                            }
                            $(".vip-line-box").eq(curIndex).append(template);
                        }
                    }
                    for(var i in vipPros){
                        if(vipPros[i].ProductDetailsUrl != ''){
                            $("#vip-box").find(".product-box").eq(i).attr("href",vipPros[i].ProductDetailsUrl);
                        }
                        $("#vip-box").find(".product-box").eq(i).find(".product-img").attr("data-img",vipPros[i].Picintroduct);
                        //if(i > 3){
                        //    roadImg($("#vip-box").find(".product-img").eq(i));
                        //}
                        $("#vip-box").find(".product-box").eq(i).find(".product-name").text(vipPros[i].ProductName);
                        $("#vip-box").find(".product-box").eq(i).find(".shop-coin").text(vipPros[i].Money);
                        $("#vip-box").find(".product-box").eq(i).find(".inventory").text((vipPros[i].cash == "") ? 0 : vipPros[i].cash);
                    }
                }
            },
            complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
                console.log("vip:" + status);
                if(status == 'timeout' || status == 'error'){//超时,status还有success,error等值的情况
                    console.log("vip请求超时或错误");
                    handleVipReqNullOrERR();
                }
            }
        });
    }

    //设置滚动监听
    function setScrollListen(){
        window.onscroll = scrollListen;
    }

    //滑动事件监听
    //注意!需要判断是否已加载数据
    function scrollListen(){
        //滑动到底部作为滚动监听结束基准
        if(pageIsFinishRoaded){
            console.log('滚动监听结束');
            window.onscroll = null;//安卓取消滚动监听
        }else{
            if($(window).scrollTop() - windowScroll > 0) {
                windowScroll = $(window).scrollTop();//记录滚动条向下最远走到哪
                // console.log("向下");
                // console.log("向下");
                console.log("currentScroll:"+windowScroll);
                //记录页面滚动到哪个位置显示相应部分商品图片
                //var seckillBoxOffset = $("#seckill-box").offset().top - $("#seckill-box").height();
                var indianaBoxOffset = $("#indiana-box").offset().top - $("#indiana-box").height();
                var vipBoxOffset = $("#vip-box").offset().top - $("#vip-box").height() * 3 / 4;
                var vipBoxOffsetTwo = $("#vip-box").offset().top - $("#vip-box").height() / 4;
                var vipBoxOffsetThree = $("#vip-box").offset().top;
                var vipBoxOffsetFour = $("#vip-box").offset().top + $("#vip-box").height() / 4;

                //动一下就加载附近消费，为了不加载页面时请求2个ajax(tym腕表、附近消费)
                if(windowScroll >= 50 && !nearShopisRoaded){
                    nearShopisRoaded = true;
                    console.log("load near");
                    requesrNearShopData();
                }

                //滚动到vip附近开始请求数据
                if(windowScroll >= vipBoxOffset && !vipProisRoaded){
                    vipProisRoaded = true;
                    console.log("arrived vip");
                    requestVipData();
                }

                //滚动到vip商品1-2图片附近加载图片
                if(windowScroll >= vipBoxOffset + $("#vip-box").find(".product-img").outerHeight() / 3 && !firLineVipProImgisRoaded && !requestVipErrOrNull){
                    firLineVipProImgisRoaded = true;
                    firLineVipImgInterval = setInterval(function(){
                        console.log("vip img 12run.......");
                        if(roadImg($("#vip-box").find(".product-img").eq(0)) && roadImg($("#vip-box").find(".product-img").eq(1))){
                            clearInterval(firLineVipImgInterval);
                            console.log("clear12vipinterval...");
                            console.log(firLineVipImgInterval);
                        }
                    },400);
                }

                //滚动到vip商品3-4图片附近加载图片
                if(windowScroll >= vipBoxOffsetTwo + $("#vip-box").find(".product-img").outerHeight() / 2 && !secLineVipProImgisRoaded &&　!requestVipErrOrNull){
                    secLineVipProImgisRoaded = true;
                    secLineVipImgInterval = setInterval(function(){
                        console.log("vip 34img run.......");
                        if(roadImg($("#vip-box").find(".product-img").eq(2)) && roadImg($("#vip-box").find(".product-img").eq(3))){
                            console.log("clear34vipinterval...");
                            clearInterval(secLineVipImgInterval);
                        }
                    },400);
                }

                //滚动到vip商品5-6图片附近加载图片
                if(windowScroll >= vipBoxOffsetThree + $("#vip-box").find(".product-img").outerHeight() / 2 && !thirdLineVipProImgisRoaded &&　!requestVipErrOrNull){
                    thirdLineVipProImgisRoaded = true;
                    thirdLineVipImgInterval = setInterval(function(){
                        console.log("vip 56img run.......");
                        if(roadImg($("#vip-box").find(".product-img").eq(4)) && roadImg($("#vip-box").find(".product-img").eq(5))){
                            clearInterval(thirdLineVipImgInterval);
                        }
                    },400);
                }

                //滚动到vip商品7-8图片附近加载图片
                if(windowScroll >= vipBoxOffsetFour + $("#vip-box").find(".product-img").outerHeight() / 2 && !fourLineVipProImgisRoaded &&　!requestVipErrOrNull){
                    fourLineVipProImgisRoaded = true;
                    fourLineVipImgInterval = setInterval(function(){
                        console.log("vip 78img run.......");
                        if(roadImg($("#vip-box").find(".product-img").eq(6)) && roadImg($("#vip-box").find(".product-img").eq(7))){
                            clearInterval(fourLineVipImgInterval);
                        }
                    },400);
                }

                //滚动到夺宝附近开始请求数据
                if(windowScroll >= indianaBoxOffset && !indianaProisRoaded){
                    console.log("arrived indiana");
                    indianaProisRoaded = true;
                    requestIndianaData();
                }

                //滚动到夺宝商品图片附近加载图片
                if(windowScroll >= indianaBoxOffset + 1 && !indianaProImgisRoaded && !requestIndianaErrOrNull){
                    indianaProImgisRoaded = true;
                    pageIsFinishRoaded = true;
                    //启动计时器，直到图片加载完毕时，及时销毁计时器(作用是防止用户快速从顶部滑动至底部，导致图片未加载完)
                    indianaImgInterval = setInterval(function(){
                        console.log("indiana img run.......");
                        if(roadImg($("#indiana-box").find(".product-img").eq(0)) && roadImg($("#indiana-box").find(".product-img").eq(1))){
                            clearInterval(indianaImgInterval);
                        }
                    },400);
                }
            }
        }
    }
})