/**
 * Created by ganruiping on 2015/7/20.
 */
//定位左上角
self.moveTo(0,0);
//调整屏幕
self.resizeTo(screen.availWidth,screen.availHeight);//强制全屏，支持IE.safari
var explorer = navigator.userAgent;
//判断是否PC端
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
//判断是否手机端
function IsMobile() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone"];
    var flag = false;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = true;
            break;
        }
    }
    return flag;
}
//加载css文件
function loadCss(path){
    if(!path || path.length === 0){
        throw new Error('argument "path" is required !');
    }
    var head = document.getElementsByTagName('head')[0];
    var link = document.createElement('link');
    link.href = path;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    head.appendChild(link);
}

if(IsMobile()){
    loadCss("css/mobile.css");
}else if(IsPC()){
    loadCss("css/pc.css");
}else{
    loadCss("css/ipad.css");
}



//居中函数
jQuery.fn.center = function () {
    this.css("position","absolute");
    var scrollHeight = window.screen.height - 101;//获取窗口高度

    if(explorer.indexOf("Firefox") >= 0){
        scrollHeight = window.screen.height - 137;//获取窗口高度
    }else if(explorer.indexOf("Chrome") >= 0){
        scrollHeight = window.screen.height - 101;//获取窗口高度
    }
    this.css("top", ((scrollHeight - this.outerHeight()) / 2) + $(window).scrollTop() + "px");
    //this.css("top", (($(window).height() - this.outerHeight()) / 2) + $(window).scrollTop() + "px");
    this.css("left", ((window.screen.width - this.outerWidth()) / 2) + $(window).scrollLeft() + "px");
    //this.css("left", (($(window).width() - this.outerWidth()) / 2) + $(window).scrollLeft() + "px");
    return this;
}

//获取url参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
$(document).ready(function () {
    var explorer = navigator.userAgent;//获取浏览器信息
	location.href = "#top";//强制跳至顶部
    //给显示推荐平台号span设置样式
    $(".main span").eq(0).css({
        "position":"absolute",
        "left":"0",
        "top":"0",
        "color":"white",
    });
    var areaName = window.location.host;//获取当前域名
    var lrefereeid = getQueryString("lrefereeid");//获取推荐人id
    var url = "http://"+areaName+"/appbs/UserService?method=getAccountById&lrefereeid="+lrefereeid;
    console.log(url);
    $.post(
        url,
        function(data,state){
        	if(data.account != 'error'){
        		$(".main span").eq(0).text(data.account);
        	}
        }
    );
    var xx,yy,XX,YY,swipeX,swipeY ;
	document.body.addEventListener('touchstart',function(event){
	     xx = event.targetTouches[0].screenX ;
	     yy = event.targetTouches[0].screenY ;
	     swipeX = true;
	     swipeY = true;
	 })
	 //判断滑动方向，阻止左右滑动
	 document.body.addEventListener('touchmove',function(event){
	      XX = event.targetTouches[0].screenX ;
	      YY = event.targetTouches[0].screenY ;
	      if(swipeX && Math.abs(XX-xx)-Math.abs(YY-yy)>0)  //左右滑动
	      {
	          event.stopPropagation();//阻止冒泡
	          event.preventDefault();//阻止浏览器默认事件
	          swipeY = false;
	          //左右滑动
	      }
	      else if(swipeY && Math.abs(XX-xx)-Math.abs(YY-yy)<0){  //上下滑动
	          swipeX = false;
	          //上下滑动，使用浏览器默认的上下滑动
	      }
	 })
	 
    $("a").last().css("display","none");//隐藏计算访问量的js里面解析出来的a标签
	
    console.log("设备分辨率宽"+window.screen.width+"高"+window.screen.height);

    var screenWidth = Number(window.innerWidth);//获取屏幕宽度
    var scrollHeight = Number(window.innerHeight);//获取窗口高度
    console.log("窗口宽度"+screenWidth+"高度:"+scrollHeight);

    //设置整个div宽高
    var divWidth = screenWidth + "px";
    var divHeight = scrollHeight + "px";
    console.log("第一部分宽度"+divWidth+"高度:"+divHeight);
    $(".main").css("height",divHeight);
    
    if(IsMobile()){
    	if(screenWidth > 500){
            $(".main span").eq(0).css({
                "font-size":"16px",
            });
    	}else{
            $(".main span").eq(0).css({
                "font-size":"12px",
            });
    	}
    }else{
    	$(".main span").eq(0).css({
    		"font-size":"20px",
    	});
    }

    if(IsPC()){
        screenWidth = window.screen.width;//获取屏幕宽度
        //scrollHeight = window.innerHeight;//获取窗口高度
        scrollHeight = window.screen.height - 101;//获取窗口高度(chrome、opera、IE除去顶部工具栏)
        if(window.innerWidth > (Number(screenWidth)-150)){
    		$("html").css("overflow-x","hidden");//全屏则隐藏水平滚动条
    		$("body").css("overflow-x","hidden");//全屏则隐藏水平滚动条
    		console.log("隐藏滚动");
    	}else{
    		$("html").css("overflow-x","");//显示水平滚动条
    		$("body").css("overflow-x","");//显示水平滚动条
    	}
        if(window.outerHeigth==screen.heigth && window.outerWidth==screen.width){
            $("html").css("overflow-x","hidden");//全屏隐藏水平滚动条
            $("body").css("overflow-x","hidden");//全屏隐藏水平滚动条
        }else{
        	$("html").css("overflow-x","");//显示水平滚动条
        	$("body").css("overflow-x","");//显示水平滚动条
        }
        if(explorer.indexOf("Firefox") >= 0){
            scrollHeight = window.screen.height - 137;//获取窗口高度(firfox除去顶部工具栏)
        }else if(explorer.indexOf("Chrome") >= 0){
            scrollHeight = window.screen.height - 101;//获取窗口高度
        }
        $(".main").css("height",scrollHeight);


        var explorer = navigator.userAgent;


        $("body").css("width",screenWidth + "px");
        $(".buttom").css("width",screenWidth + "px");
        console.log("被卷去"+document.body.offsetWidth);
        //监听浏览器窗口缩放
        $(window).resize(function () {

            screenWidth = window.screen.width;//获取屏幕宽度
            scrollHeight = window.screen.height - 101;//获取窗口高度
            if(explorer.indexOf("Firefox") >= 0){
                scrollHeight = window.screen.height - 137;//获取窗口高度
            }else if(explorer.indexOf("Chrome") >= 0){
                scrollHeight = window.screen.height - 101;//获取窗口高度
            }
            $(".main").css("height",scrollHeight);
            //设置首页底部属性
            $(".buttom").css({
                "height":scrollHeight * 0.55 + "px",
                "top":scrollHeight * 0.45 + "px",
            });
            //设置第一页底部padding-top
            $(".buttom").css("padding-top",scrollHeight * 0.55 * 2/5 + "px");
            $(".buttom").find("img").attr({
                "width":screenWidth * 0.03 + "px",
                "height":screenWidth * 0.03 + "px"
            });
            $(".buttom").find("img").css({
                "margin-right":screenWidth * 0.03 + "px",
            });
            //设置第一部分底部按钮width
            $(".ios-download-btn").css("width",screenWidth * 0.3 + "px");
            $(".android-download-btn").css("width",screenWidth * 0.3 + "px");
            //设置第一部分底部按钮line-height
            console.log("按钮高度"+$(".btns").css("height"));
            $(".btns").css({
                "height":scrollHeight * 0.1 + "px",
                "font-size":screenWidth * 0.02 + "px"
            });
            //设置行高使其内容垂直居中
            $(".btns").css({
                "line-height":$(".btns").css("height"),
            });
            console.log("按钮高度"+$(".btns").css("height"));

            if(window.innerWidth > (Number(screenWidth)-150)){
            	console.log("隐藏滚动");
            	$("html").css("overflow-x","hidden");//全屏隐藏水平滚动条
            	$("body").css("overflow-x","hidden");//全屏隐藏水平滚动条
            }else{
            	$("html").css("overflow-x","");//显示水平滚动条
            	$("body").css("overflow-x","");//显示水平滚动条
            }
            if(window.outerHeigth == screen.heigth && window.outerWidth == screen.width){
                $("html").css("overflow-x","hidden");//全屏隐藏水平滚动条
                $("body").css("overflow-x","hidden");//全屏隐藏水平滚动条
            }else{
            	$("html").css("overflow-x","");//显示水平滚动条
            	$("body").css("overflow-x","");//显示水平滚动条
            }
        });
    }else{
        $(".main").css("width","100%");
    }

    //设置手机图片宽高(平板、电脑)
    var phoneImgWidth = screenWidth * 0.17 + "px";
    var topImgsWidth = screenWidth * 0.17 * 3 + "px";
    var phoneImgHeight = screenWidth * 0.34 + "px";
    $(".phone").attr({
        width:phoneImgWidth,
        height:phoneImgHeight
    });

    //根据分辨率设置手机图片圆角弧度
    var topimg_border_radius = '';
    var part_border_radius = '';
    if(screenWidth > 1366 && screenWidth < 1600){
    	topimg_border_radius = "36px";
    	part_border_radius = "35px";
    }
    if(screenWidth >= 1600 && screenWidth < 1920){
    	topimg_border_radius = "40px";
    	part_border_radius = "39px";
    }
    if(screenWidth >= 1920 && screenWidth < 2560){
    	topimg_border_radius = "45px";
    	part_border_radius = "44px";
    }
    if(screenWidth >= 2560){
    	topimg_border_radius = "50px";
    	part_border_radius = "49px";
    }
    $(".top img").css("border-radius",topimg_border_radius);
    $(".part1_left img").css("border-radius",part_border_radius);
    $(".part2_right img").css("border-radius",part_border_radius);
    $(".part3_left img").css("border-radius",part_border_radius);
    $(".part4_right img").css("border-radius",part_border_radius);
    $(".part5_left img").css("border-radius",part_border_radius);
    
    //在手机显示温馨提示，并修改各部分图片圆角度数和阴影
    if(IsMobile()) {
        ///(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
    	$("body").css("width",divWidth);
    	$(".buttom").css("width",divWidth);

//    	alert(navigator.userAgent);//ios9safari浏览器问题
    	if(screenWidth > 500){
    		$(".buttom").css("background-image","url('images/bottom_bg_for_bigscreen.png')");
    	}else{
    		$(".buttom").css("background-image","url('images/bottom_bg_meitu.png')");
    	}
    	if(window.screen.width < window.innerWidth && window.screen.height < window.innerHeight){//ios9-safari浏览器
    		$(".main span").eq(0).css({
    			"font-size":"30px",
    		});
    		$(".buttom").css("background-image","url('images/bottom_bg_meitu.png')");
    	}
    	
        //通过判断是否iphone和android显示相应下载按钮
        if (/(iPhone)/i.test(navigator.userAgent)) {
            $(".android-download-btn").css("display","none");
            $(".buttom").find("label").eq(1).css("display","none");
        } else if (/(Android)/i.test(navigator.userAgent)) {
            $(".buttom").find("div").eq(0).css("display","none");
            $(".buttom").find("label").eq(0).css("display","none");
        }
        //二维码阴影
        $(".part1_right_bottom_right img").css({
            "-webkit-box-shadow":"2px 3px 4px rgba(0, 0, 0, 0.5)",
            "-o-box-shadow":"2px 3px 4px rgba(0, 0, 0, 0.5)",
            "-moz-box-shadow":"2px 3px 4px rgba(0, 0, 0, 0.5)",
            "box-shadow":"2px 3px 4px rgba(0, 0, 0, 0.5)",
        });
        $("#topimg5").css({
            "-webkit-box-shadow":"5px 4px 6px rgba(0, 0, 0, 0.5)",
            "-moz-box-shadow":"5px 4px 6px rgba(0, 0, 0, 0.5)",
            "-o-box-shadow":"5px 4px 6px rgba(0, 0, 0, 0.5)",
            "box-shadow":"5px 4px 6px rgba(0, 0, 0, 0.5)",
        });
    }
    //设置第一张手机图片动画
    $("#topimg5").css("left","0px");
    setTimeout(function () {
    	if(screenWidth < 640 || IsMobile()){
    		$(".top img").eq(4).css({
    			"visibility": "visible",
    			"-webkit-animation":"imgmove1 1s ease 1",
    			"-o-animation":"imgmove1 1s ease 1",
    			"animation":"imgmove1 1s ease 1",
    		});
    	}else{
    		//解决firefox首页手机图闪现
            $(".top img").eq(4).css({
                "display":"inline",
                "-webkit-animation":"imgmove1 1s ease 1",
                "-o-animation":"imgmove1 1s ease 1",
                "animation":"imgmove1 1s ease 1",
            });
    	}

    },500);
    //设置顶部手机图动画  PC端
    if(IsPC()){
        $(".topImgs").css({
            "width":topImgsWidth,
            "height":phoneImgHeight,
        });
        $(".topImgs").center();//使5张图片水平垂直居中
        $(".top img").css({
            "position":"absolute"
        });
        var topimgWidth = parseInt(phoneImgWidth);//手机图片宽度
        //设置4张图片在合适位置
        var img4left = (topimgWidth * 0.5).toString() + "px";
        var img3left = topimgWidth;
        var img2left = (topimgWidth * 1.5).toString() + "px";
        var img1left = (topimgWidth * 2).toString() + "px";
        $("#topimg4").css("left",img4left);
        $("#topimg3").css("left",img3left);
        $("#topimg2").css("left",img2left);
        $("#topimg1").css("left",img1left);

        setTimeout(function () {
            $(".top img").eq(3).css({
                "display":"block",
                "-webkit-animation":"imgmove2 0.5s ease-out 1",
                "-o-animation":"imgmove2 0.5s ease-out 1",
                "animation":"imgmove2 0.5s ease-out 1",
            });
        },1500);
        setTimeout(function () {
            $(".top img").eq(2).css({
                "display":"block",
                "-webkit-animation":"imgmove2 0.5s ease-out 1",
                "-o-animation":"imgmove2 0.5s ease-out 1",
                "animation":"imgmove2 0.5s ease-out 1",
            });
        },2000);
        setTimeout(function () {
            $(".top img").eq(1).css({
                "display":"block",
                "-webkit-animation":"imgmove2 0.5s ease-out 1",
                "-o-animation":"imgmove2 0.5s ease-out 1",
                "animation":"imgmove2 0.5s ease-out 1",
            });
        },2500);
        setTimeout(function () {
            $(".top img").eq(0).css({
                "display":"block",
                "-webkit-animation":"imgmove2 0.5s ease-out 1",
                "-o-animation":"imgmove2 0.5s ease-out 1",
                "animation":"imgmove2 0.5s ease-out 1",
            });
        },3000);

        //手机鼠标移入事件函数
        var mousein = function () {
            $(this).css({
                "-webkit-transform":"translate(85px,-50px)",
                "-moz-transform":"translate(85px,-50px)",
                "-o-transform":"translate(85px,-50px)",
                "-ms-transform":"translate(85px,-50px)",
                "transform":"translate(85px,-50px)",
            });
        }
        //手机鼠标移入事件函数
        var mouseout = function () {
            $(this).css({
                "-webkit-transform":"translate(0px,0px)",
                "-moz-transform":"translate(0px,0px)",
                "-ms-transform":"translate(0px,0px)",
                "-o-transform":"translate(0px,0px)",
                "transform":"translate(0px,0px)",
            });
        }
        //给首页手机4张图片添加hover事件
        setTimeout(function () {
            $("#topimg1").hover(mousein,mouseout);
            $("#topimg1").nextUntil("#topimg5").hover(mousein,mouseout);
        },3000);
    }
    //如果在QQ或微信打开则显示温馨提示
    if((explorer.indexOf("MicroMessenger") > 0 || explorer.indexOf("QQ/") > 0)){
    	var shareImg = '';//iPhone、android手机微信图标不同
    	if(navigator.userAgent.indexOf("MicroMessenger") > 0){
    		if (/(iPhone)/i.test(navigator.userAgent)) {
    			shareImg = "./images/weixinshare.jpg";
    		}else if(/(Android)/i.test(navigator.userAgent)){
    			shareImg = "./images/andr_weixin_share.jpg";
			}
    	}else if(navigator.userAgent.indexOf("QQ/") > 0){
    		shareImg = "./images/qqshare.jpg";
    	}
    	if (/(iPhone)/i.test(navigator.userAgent)) {
    		$("#phone_browser_word").text("在Safari中打开");
    	}else if(/(Android)/i.test(navigator.userAgent)){
    		$("#phone_browser_word").text("在浏览器中打开");
    	}
    	$(".shadowTips_bottom_tipsone img").attr("src",shareImg);
    	$(".btns").click(function () {
    		$("#shadowTips").fadeIn(300);
    	});
    	$(".shadowTips_mid_left img").click(function() {
    		$("#shadowTips").fadeOut(300);
    	});
    }else{
    	//给按钮设置点击链接  安卓下载
    	$(".android-download-btn").click(function () {
    		location.href = "http://tiyoumeapp.oss-cn-shenzhen.aliyuncs.com/MeChat.apk";
    	});
    	//给按钮设置点击链接  ios下载
    	if(IsPC()){
    		$(".ios-download-btn").click(function () {
                location.href = "https://itunes.apple.com/cn/app/mei-zhi-fu/id1112806209?mt=8";
    			// location.href = "https://itunes.apple.com/cn/app/ben-de-sheng-huo-quan/id1023314197?mt=8";
//    			location.href = "http://tiyoumeapp.oss-cn-shenzhen.aliyuncs.com/TYM_MeiXins.ipa";
    		});
    	}else{
    		$(".ios-download-btn").click(function () {
                location.href = "https://itunes.apple.com/cn/app/mei-zhi-fu/id1112806209?mt=8";
    			// location.href = "https://itunes.apple.com/cn/app/ben-de-sheng-huo-quan/id1023314197?mt=8";
//    			location.href = "itms-services://?action=download-manifest&url=https://tiyoumeapp.oss-cn-shenzhen.aliyuncs.com/manifest1.plist";
    		});
    	}
    }
    //设置首页按钮label字体大小
    if(!IsMobile()){
        $(".buttom label").css({
            "font-size":screenWidth * 0.015 + "px"
        });
    }else{
        $(".buttom label").css({
            "font-size":screenWidth * 0.03 + "px"
        });
    }
    //设置首页底部属性
    $(".buttom").css({
        "height":scrollHeight * 0.55 + "px",
        "top":scrollHeight * 0.45 + "px",
        "padding-top":scrollHeight * 0.225 + "px",
    });
    if(IsPC())
    {
        //设置第一页底部padding-top
    	if(screenWidth <= 1024){
    		$(".buttom").css("padding-top",scrollHeight * 0.55 * 3/5 + "px");
    	}else{
    		$(".buttom").css("padding-top",scrollHeight * 0.55 * 2/5 + "px");
    	}
        $(".buttom").find("img").attr({
            "width":screenWidth * 0.03 + "px",
            "height":screenWidth * 0.03 + "px"
        });
        $(".buttom").find("img").css({
            "margin-right":screenWidth * 0.03 + "px",
        });
        //设置第一部分底部按钮width
        $(".ios-download-btn").css("width",screenWidth * 0.3 + "px");
        $(".android-download-btn").css("width",screenWidth * 0.3 + "px");
        //设置第一部分底部按钮line-height
        console.log("按钮高度"+$(".btns").css("height"));
        $(".btns").css({
            "height":scrollHeight * 0.1 + "px",
            "font-size":screenWidth * 0.02 + "px"
        });
        //设置行高使其内容垂直居中
        $(".btns").css({
            "line-height":$(".btns").css("height"),
        });
        console.log("按钮高度"+$(".btns").css("height"));
    }
    if(!IsPC() && !IsMobile()){
        if(screenWidth <= 1024 && screenWidth >= 800)
        {
            //设置手机图片宽高
            var phoneImgWidth = screenWidth * 0.35 + "px";
            var phoneImgHeight = screenWidth * 0.55 + "px";
            if(IsPC()){
                phoneImgWidth = screenWidth * 0.2 + "px";
                phoneImgHeight = screenWidth * 0.4 + "px";
            }

            $(".phone").attr({
                width:phoneImgWidth,
                height:phoneImgHeight
            });
            $(".phone").css({
                "border-radius": "36px",
            });
            //设置行高使其内容垂直居中
            $(".top").css({
                "line-height":$(".top").css("height"),
            });
            //设置第一页底部padding-top
            $(".buttom").css("padding-top",scrollHeight * 0.6 * 2/5 + "px");
            $(".buttom").find("img").attr({
                "width":screenWidth * 0.03 + "px",
                "height":screenWidth * 0.03 + "px"
            });
            $(".buttom").find("img").css({
                "margin-right":screenWidth * 0.03 + "px",
            });
            //设置第一部分底部按钮width
            $(".ios-download-btn").css("width",screenWidth * 0.35 + "px");
            $(".android-download-btn").css("width",screenWidth * 0.35 + "px");
            //设置第一部分底部按钮line-height
            console.log("按钮高度"+$(".btns").css("height"));
            $(".btns").css({
                "height":scrollHeight * 0.1 + "px",
                "font-size":screenWidth * 0.025 + "px"
            });
            //设置行高使其内容垂直居中
            $(".btns").css({
                "line-height":$(".btns").css("height"),
            });
        }else if(screenWidth < 800 && screenWidth > 640){
            //设置手机图片宽高
            var phoneImgWidth = screenWidth * 0.35 + "px";
            var phoneImgHeight = screenWidth * 0.7 + "px";
            $(".phone").attr({
                width:phoneImgWidth,
                height:phoneImgHeight
            });
            $(".phone").css({
                "border-radius": "40px",
            });
            //设置行高使其内容垂直居中
            $(".top").css({
                "line-height":$(".top").css("height"),
            });
            //设置第一页底部padding-top
            $(".buttom").css("padding-top",$(".buttom").height() * 3/4 + "px");
            $(".buttom").find("img").attr({
                "width":screenWidth * 0.03 + "px",
                "height":screenWidth * 0.03 + "px"
            });
            $(".buttom").find("img").css({
                "margin-right":screenWidth * 0.03 + "px",
            });
            //设置第一部分底部按钮width
            $(".ios-download-btn").css("width",screenWidth * 0.3 + "px");
            $(".android-download-btn").css("width",screenWidth * 0.3 + "px");
            //设置第一部分底部按钮line-height
            console.log("按钮高度"+$(".btns").css("height"));
            $(".btns").css({
                "height":scrollHeight * 0.1 + "px",
                "font-size":screenWidth * 0.02 + "px"
            });
            //设置行高使其内容垂直居中
            $(".btns").css({
                "line-height":$(".btns").css("height"),
            });
            console.log("按钮高度"+$(".btns").css("height"));
        }
    }
    if(IsMobile()){
        if(screenWidth > 480){
            $(".top img").eq(0).css("display","none");    //通过判断宽度隐藏哪些图片
            $(".top img").eq(1).css("display","none");    //通过判断宽度隐藏哪些图片
            $(".top img").eq(2).css("display","none");    //通过判断宽度隐藏哪些图片
            $(".top img").eq(3).css("display","none");    //通过判断宽度隐藏哪些图片
            
            //设置手机图片宽高
            //ios9
        	var phoneImgWidth = screenWidth * 0.35 + "px";
        	var phoneImgHeight = screenWidth * 0.55 + "px";
            $(".phone").attr({
                width:phoneImgWidth,
                height:phoneImgHeight
            });
            $(".phone").css({
                "border-radius": "40px",
                "-webkit-box-shadow":"7px 3px 8px rgba(0, 0, 0, 0.5)",
                "-o-box-shadow":"7px 3px 8px rgba(0, 0, 0, 0.5)",
                "-moz-box-shadow":"7px 3px 8px rgba(0, 0, 0, 0.5)",
                "box-shadow":"7px 3px 8px rgba(0, 0, 0, 0.5)",
            });
            //设置行高使其内容垂直居中
            $(".top").css({
                "line-height":$(".top").css("height"),
            });
            //设置第一页底部padding-top
            $(".buttom").css({
            	"padding-top":$(".buttom").height() * 4/5  + "px",
            });
            $(".buttom").find("img").attr({
                "width":screenWidth * 0.05 + "px",
                "height":screenWidth * 0.05 + "px"
            });
            $(".buttom").find("img").css({
                "margin-right":screenWidth * 0.03 + "px",
            });
            //设置第一部分底部按钮width
            $(".ios-download-btn").css("width",screenWidth * 0.4 + "px");
            $(".android-download-btn").css("width",screenWidth * 0.4 + "px");
            //设置第一部分底部按钮line-height
            console.log("按钮高度"+$(".btns").css("height"));
            $(".btns").css({
                "font-size":screenWidth * 0.03 + "px"
            });
            if(screenWidth > scrollHeight){
                $(".btns").css({
                    "height":scrollHeight * 0.15 + "px",
                });
            }else{
            	$(".buttom").css({
            		"padding-top":$(".buttom").height()  + "px",
            	});
            	if(window.screen.width < window.innerWidth && window.screen.height < window.innerHeight){
            		$(".phone").attr({
            			width:screenWidth * 0.5 + "px",
            			height:screenWidth * 0.85 + "px"
            		});
            		$(".phone").css({
            			"border-radius": "40px",
            		});
            		$(".btns").css({
            			"width":screenWidth * 0.5 + "px",
            			"height":scrollHeight * 0.08 + "px",
            			"border-radius": "15px",
            			"font-size":screenWidth * 0.045 + "px"
            		});
                	$(".main span").eq(0).css({
                		"font-size":"16px",
                	});
                	$("#copyright").css("width",screenWidth + "px");
            	}else{
            		$(".phone").attr({
            			width:screenWidth * 0.4 + "px",
            			height:screenWidth * 0.6 + "px"
            		});
            		$(".phone").css({
            			"border-radius": "30px",
            		});
            		$(".btns").css({
            			"height":scrollHeight * 0.1 + "px",
            		});
            	}
            }
            if(window.screen.width < window.innerWidth && window.screen.height < window.innerHeight){
            	$(".buttom label").css({
            		"font-size":screenWidth * 0.025 + "px",
            	});
            }else{
            	$(".buttom label").css({
            		"font-size":screenWidth * 0.02 + "px",
            	});
            }
            //设置行高使其内容垂直居中
            $(".btns").css({
                "line-height":$(".btns").css("height"),
            });
            console.log("按钮高度"+$(".btns").css("height"));
        }else if(screenWidth <= 480){
            //在手机上只显示一张手机图片
            $(".top img").eq(0).css("display","none");
            $(".top img").eq(1).css("display","none");
            $(".top img").eq(2).css("display","none");
            $(".top img").eq(3).css("display","none");
            var phoneImgWidth = screenWidth * 0.5 + "px";
            var phoneImgHeight = screenWidth * 0.9 + "px";
            $(".phone").attr({
                width:phoneImgWidth,
                height:phoneImgHeight
            });
            $(".phone").css({
                "border-radius": "23px",
            });
            setTimeout(function () {
                $(".top img").eq(4).css({
                    "visibility": "visible",
                    "-webkit-animation":"imgmove1-for-mobile 1.3s ease 1",
                    "-o-animation":"imgmove1-for-mobile 1.3s ease 1",
                    "animation":"imgmove1-for-mobile 1.3s ease 1",
                });
            },500);

            //设置第一页底部padding-top
            $(".buttom").css({
                "height":scrollHeight * 0.45 + "px",
                "top":scrollHeight * 0.55 + "px",
            });
            $(".buttom").css({
                "padding-top":scrollHeight * 0.45 * 1/2 + "px",
            });

            $(".buttom").find("img").attr({
                "width":screenWidth * 0.05 + "px",
                "height":screenWidth * 0.05 + "px"
            });
            $(".buttom").find("img").css({
                "margin-right":screenWidth * 0.03 + "px",
            });
            //设置第一部分底部按钮width
            $(".ios-download-btn").css("width",screenWidth * 0.55 + "px");
            $(".android-download-btn").css("width",screenWidth * 0.55 + "px");
            //设置第一部分底部按钮line-height
            console.log("按钮高度"+$(".btns").css("height"));
            $(".btns").css({
                "height":screenWidth * 0.11 + "px",
                "font-size":screenWidth * 0.04 + "px"
            });
            //设置行高使其内容垂直居中
            $(".btns").css({
                "line-height":$(".btns").css("height"),
            });
            console.log("按钮高度"+$(".btns").css("height"));
            $(".top").css({
                "line-height":$(".top").css("height"),
            });
        }
    }


    //设置行高使其内容垂直居中,平板或手机
    if(!IsPC()){
        $(".top").css({
            "line-height":$(".top").css("height"),
        });
    }

    //通过判断是否iphone和android显示相应下载按钮
    ///(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)
    if (/(iPhone)/i.test(navigator.userAgent)) {
        setTimeout(function () {
            $(".buttom").children(".ios-download-btn").css({
                display:"block",
                "-webkit-animation":"movetoright 1s ease 1",
                "-o-animation":"movetoright 1s ease 1",
                "animation":"movetoright 1s ease 1",
            });
        },1500);
        setTimeout(function () {
            $(".buttom label").eq(0).css({
                "visibility": "visible",
                "-webkit-animation":"fade 1s ease 1",
                "-o-animation":"fade 1s ease 1",
                "animation":"fade 1s ease 1",
            });
        },2500);
        $(".buttom label").eq(1).css({
            "display": "none"
        });
    } else if (/(Android)/i.test(navigator.userAgent)) {
        setTimeout(function () {
            $(".buttom").children(".android-download-btn").css({
                display:"block",
                "-webkit-animation":"movetoleft 1s ease 1",
                "-o-animation":"movetoleft 1s ease 1",
                "animation":"movetoleft 1s ease 1",
            });
        },1500);
        setTimeout(function () {
            $(".buttom label").eq(1).css({
                "visibility": "visible",
                "-webkit-animation":"fade 1s ease 1",
                "-o-animation":"fade 1s ease 1",
                "animation":"fade 1s ease 1",
            });
        },2500);
    } else {
        console.log("pc端");
        setTimeout(function () {
            $(".buttom").children(".ios-download-btn").css({
                display:"block",
                "-webkit-animation":"movetoright 1s ease 1",
                "-o-animation":"movetoright 1s ease 1",
                "animation":"movetoright 1s ease 1",
            });
            $(".buttom").children(".android-download-btn").css({
                display:"block",
                "-webkit-animation":"movetoleft 1s ease 1",
                "-o-animation":"movetoleft 1s ease 1",
                "animation":"movetoleft 1s ease 1",
            });
        },1500);
        setTimeout(function () {
            $(".buttom label").css({
                "visibility": "visible",
                "-webkit-animation":"fade 1s ease 1",
                "-o-animation":"fade 1s ease 1",
                "animation":"fade 1s ease 1",
            });
        },2500);
    };

    //设置part1-5的高度
    $(".main").nextUntil(".part6").css("height",screenWidth * 0.4 + "px");
    //设置part6的高度和行高
    if(screenWidth > 480)
    {
        var part6Height = screenWidth * 0.45 + "px";
    }else if(screenWidth > 320 && screenWidth <= 480){
        var part6Height = screenWidth * 0.65 + "px";
    }else if(screenWidth <= 320){
        var part6Height = scrollHeight * 0.7 + "px";
    }
	if(window.screen.width < window.innerWidth && window.screen.height < window.innerHeight){
		$(".part6").css({
			"height": screenWidth * 0.6 + "px",
		});
	}else{
		$(".part6").css({
			"height": part6Height,
		});
	}
	var part6Height = $(".part6").css("height").split("px")[0];
//	alert(part6Height);
    //版权样式
    $("#copyright").css({
        "font-size": part6Height * 0.025 + "px",
        "height" : part6Height * 0.07 + "px",
        "margin-top" : "-"+ part6Height * 0.07 + "px"
    });
    $("#copyright").css({
        "line-height" : part6Height * 0.07 + "px",
    });
	
	
    //设置part1左边部分line-height
    $(".part1_left").css("line-height",$(".part1_left").css("height"));
    //设置part1左边图片width
    $(".part1_left").find("img").css("width",screenWidth * 0.16 + "px");
    //设置part1右边的下部分的左边line-height
    $(".part1_right_bottom_left").css("line-height",$(".part1_right_bottom_left").css("height"));

    //设置字体大小
    $(".part1_right").css("font-size",screenWidth * 0.0355 + "px");
    $(".part6 strong").css("font-size",screenWidth * 0.037 + "px");
    
    
    if(IsMobile()){
    	if(screenWidth / scrollHeight  >= 2/3){
    		$(".part6 p").css("font-size",screenWidth * 0.026 + "px");
    	}else{
    		$(".part6 p").css("font-size",screenWidth * 0.022 + "px");
    	}
    	//解决手机UC浏览器和chrome浏览器字体偏大
    	if(navigator.userAgent.indexOf("UCBrowser") > 0){
    		$(".part6 p").css("font-size",screenWidth * 0.02 + "px");
    	}else if(navigator.userAgent.indexOf("Chrome") > 0){
            $(".part6_content div").addClass("part6_p");
        }
    }else{
        $(".part6 p").css("font-size",screenWidth * 0.022 + "px");
    }
    //统一设置字体
    $(".main").nextUntil(".part6").css("font-size",screenWidth * 0.0355 + "px");
    //设置美信字体图片大小
    $(".part1_right_middle_img1").attr({
        "width":screenWidth * 0.225 + "px",
        "height":screenWidth * 0.055 + "px"
    });
    //设置二维码图片大小
    $(".part1_right_bottom_right img").attr({
        "width":screenWidth * 0.12 + "px",
        "height":screenWidth * 0.12 + "px"
    });

    //设置part2右边部分line-height
    $(".part2_right").css("line-height",$(".part2_right").css("height"));
    //设置part2右边图片width
    $(".part2_right").find("img").css("width",screenWidth * 0.16 + "px");
    //设置字体大小
    $(".part2_left").css("font-size",screenWidth * 0.0355 + "px");
    //设置钱包字体图片大小
    $(".part1_left_qianbao").attr({
        "width":screenWidth * 0.12 + "px",
        "height":screenWidth * 0.05 + "px"
    });
    console.log("第二部分左下高"+$(".part2_left_bottom").height());

    //设置part3左边部分line-height
    $(".part3_left").css("line-height",$(".part3_left").css("height"));
    //设置part3左边图片width
    $(".part3_left").find("img").css("width",screenWidth * 0.16 + "px");
    //设置字体大小
    $(".part3_right").css("font-size",screenWidth * 0.0355 + "px");
    //设置夺宝字体图片大小
    $(".part3_right_center img").attr({
        "width":screenWidth * 0.225 + "px",
        "height":screenWidth * 0.055 + "px"
    });

    //设置各部分大图片高度
    //设置第二部分左下房子图片高度
    $(".part2_left_bottom img").attr({
        "height":$(".part2_left_bottom").height() * 0.8 + "px"
    });
    //设置第3部分右下房子图片大小
    $(".part3_right_bottom img").attr({
        "height":$(".part2_left_bottom").height() * 0.95 + "px"
    });
    //设置第三部分右下部分行高
    $(".part3_right_bottom").css({
        "line-height":$(".part3_right_bottom").css("height")
    });
    //设置第4部分左下大云朵图片大小
    $(".part4_left_bottom img").attr({
        "height":$(".part2_left_bottom").height() * 0.6 + "px"
    });
    //设置第5部分右下大房子大小
    $(".part5_right_bottom img").attr({
        "height":$(".part2_left_bottom").height() * 0.65 + "px"
    });
    //640窗口宽度下
    if(IsMobile())
    {
        //设置第二部分左下房子图片宽度
        $(".part2_left_bottom img").attr({
            "width":$(".part2_left_bottom").width() * 0.4 + "px",
        });
        //设置第3部分右下房子图片宽度
        $(".part3_right_bottom img").attr({
            "width":$(".part2_left_bottom").width() * 0.5 + "px",
        });
        //设置第4部分左下大云朵图片宽度
        $(".part4_left_bottom img").attr({
            "width":$(".part2_left_bottom").width() * 0.52 + "px",
        });
        //设置第5部分右下大房子宽度
        $(".part5_right_bottom img").attr({
            "width":$(".part2_left_bottom").width() * 0.52 + "px",
        });
    }else{
        //设置第二部分左下房子图片宽度
        $(".part2_left_bottom img").attr({
            "width":$(".part2_left_bottom").width() * 0.45 + "px",
        });
        //设置第3部分右下房子图片宽度
        $(".part3_right_bottom img").attr({
            "width":$(".part2_left_bottom").width() * 0.7 + "px",
        });
        //设置第4部分左下大云朵图片宽度
        $(".part4_left_bottom img").attr({
            "width":$(".part2_left_bottom").width() * 0.72 + "px",
        });
        //设置第5部分右下大房子宽度
        $(".part5_right_bottom img").attr({
            "width":$(".part2_left_bottom").width() * 0.72 + "px",
        });
    }

    //设置part4右边部分line-height
    $(".part4_right").css("line-height",$(".part4_right").css("height"));
    //设置part4右边图片width
    $(".part4_right").find("img").css("width",screenWidth * 0.16 + "px");
    //设置积分字体图片大小
    $(".part4_left_center img").attr({
        "width":screenWidth * 0.12 + "px",
        "height":screenWidth * 0.06 + "px"
    });

    //设置part5左边部分line-height
    $(".part5_left").css("line-height",$(".part5_left").css("height"));
    //设置part5右边图片width
    $(".part5_left").find("img").css("width",screenWidth * 0.16 + "px");
    //设置百分十字体图片大小
    $(".part5_right_center img").attr({
        "width":screenWidth * 0.12 + "px",
        "height":screenWidth * 0.05 + "px"
    });
    
//    alert(window.orientation);
    //判断平板是否竖屏，设置样式
    if((window.orientation == 0 || window.orientation == 180) && !IsPC() && !IsMobile()){
		$("#topimg5").attr("width",screenWidth * 0.4 + "px");
		$(".buttom label").css({
			"font-size":screenWidth * 0.02 + "px"
		});
		//设置第一页底部padding-top
		$(".buttom").css("padding-top",scrollHeight * 0.45 * 3/5 + "px");
		$(".buttom img").attr({
			"width":screenWidth * 0.04 + "px",
			"height":screenWidth * 0.04 + "px"
		});
		$(".buttom img").css({
			"margin-right":screenWidth * 0.03 + "px",
		});
		//设置第一部分底部按钮width
		$(".ios-download-btn").css("width",screenWidth * 0.4 + "px");
		$(".android-download-btn").css("width",screenWidth * 0.4 + "px");
		//设置第一部分底部按钮line-height
		console.log("按钮高度"+$(".btns").css("height"));
		$(".btns").css({
			"height":scrollHeight * 0.085 + "px",
			"font-size":screenWidth * 0.03 + "px"
		});
		//设置行高使其内容垂直居中
		$(".btns").css({
			"line-height":$(".btns").css("height"),
		});
		$(".part1_left img").css("border-radius","20px");
		$(".part2_right img").css("border-radius","20px");
		$(".part3_left img").css("border-radius","20px");
		$(".part4_right img").css("border-radius","20px");
		$(".part5_left img").css("border-radius","20px");
		
		$(".part6").css("height",scrollHeight * 0.43 + "px");
    }
    
	 //判断横竖屏
	 function orient() {
       if (window.orientation == 0 || window.orientation == 180) {
           $("body").attr("class", "portrait");
           orientation = 'portrait';
           location.reload();//页面重新加载
           return false;
       }else if (window.orientation == 90 || window.orientation == -90) {
           $("body").attr("class", "landscape");
           orientation = 'landscape';
           location.reload();//页面重新加载
           //alert("横屏");
           return false;
       }
     }

   //监听横竖屏切换
   $(window).bind( 'orientationchange', function(e){
       orient();
   });


    var windowScroll = 0;//记录滑动标记
    //定义窗口滚动监听事件
    window.onscroll = function () {
        if($(window).scrollTop() - windowScroll > 0) {
            windowScroll = $(window).scrollTop();//记录滚动条向下最远走到哪
            console.log("向下");
            var derToTop1 = $(".part1").get(0).offsetTop + Math.floor($(".part1").height() / 2);
            var derToTop2 = $(".part1").get(0).offsetTop + Math.floor($(".part1").height() * 3 / 4);
            var part2ToTop1 = $(".part2").get(0).offsetTop + Math.floor($(".part2").height() / 2);
            var part2ToTop2 = $(".part2").get(0).offsetTop + Math.floor($(".part2").height() * 3 / 4);
            var part3ToTop1 = $(".part3").get(0).offsetTop + Math.floor($(".part3").height() / 2);
            var part3ToTop2 = $(".part3").get(0).offsetTop + Math.floor($(".part3").height() * 3 / 4);
            var part4ToTop1 = $(".part4").get(0).offsetTop + Math.floor($(".part4").height() / 2);
            var part4ToTop2 = $(".part4").get(0).offsetTop + Math.floor($(".part4").height() * 3 / 4);
            var part5ToTop1 = $(".part5").get(0).offsetTop + Math.floor($(".part5").height() / 2);
            var part5ToTop2 = $(".part5").get(0).offsetTop + Math.floor($(".part5").height() * 3 / 4);
            var part6ToTop1 = $(".part6").get(0).offsetTop + Math.floor($(".part6").height() * 1 / 6);
            var part6ToTop2 = $(".part6").get(0).offsetTop + Math.floor($(".part6").height() * 2 / 6);
            console.log("part1的一半到顶部距离"+derToTop1);
            console.log("part1的3/4到顶部距离"+derToTop2);
            //console.log($(".part1").get(0).offsetTop);
            //console.log(Math.floor($(".part1").height() / 2));
            var docHeight = $(document).height();
            console.log(docHeight);
            var windowScrollHeight = $(window).scrollTop();
            console.log(windowScrollHeight);
            //到part1的一半到3/4之间开始二维码动画
            if((derToTop2 < (scrollHeight + windowScrollHeight)) && (derToTop2 > derToTop1)){
                setTimeout(function () {
                    $(".part1_right_bottom_right img").css({
                        "visibility": "visible",
                        "-webkit-animation": "part2_left_houseanim 1s ease 1",
                        "-o-animation": "part2_left_houseanim 1s ease 1",
                        "animation": "part2_left_houseanim 1s ease 1",
                    });
                },1100);
            }
            //到part1的一半开始字体动画
            if (derToTop1 < (scrollHeight + windowScrollHeight)) {
                $(".part1 img").eq(0).css({
                    "visibility": "visible",
                    "-webkit-animation":"part1_letf_imgmove 0.8s ease 1",
                    "-o-animation":"part1_letf_imgmove 0.8s ease 1",
                    "animation":"part1_letf_imgmove 0.8s ease 1",
                });
                setTimeout(function () {
                    $(".part1_right_middle strong").eq(0).css({
                        "visibility": "visible",
                        "-webkit-animation": "part2_left_fontmove 0.5s ease 1",
                        "-o-animation": "part2_left_fontmove 0.5s ease 1",
                        "animation": "part2_left_fontmove 0.5s ease 1",
                    });
                },500);
                setTimeout(function () {
                    $(".part1_right_middle strong").eq(1).css({
                        "visibility": "visible",
                        "-webkit-animation": "part2_left_fontmove 0.5s ease 1",
                        "-o-animation": "part2_left_fontmove 0.5s ease 1",
                        "animation": "part2_left_fontmove 0.5s ease 1",
                    });
                },800);
                setTimeout(function () {
                    $(".part1_right_middle_img1").css({
                        "visibility": "visible",
                        "-webkit-animation": "part2_left_fontmove 0.5s ease 1",
                        "-o-animation": "part2_left_fontmove 0.5s ease 1",
                        "animation": "part2_left_fontmove 0.5s ease 1",
                    });
                },1300);
            }
            //到part2的一半到3/4之间开始房子动画
            if((part2ToTop1 < (scrollHeight + windowScrollHeight)) && (part2ToTop2 > part2ToTop1)){
                setTimeout(function () {
                    $(".part2_left_bottom img").css({
                        "visibility": "visible",
                        "-webkit-animation": "part2_left_houseanim 1s ease 1",
                        "-o-animation": "part2_left_houseanim 1s ease 1",
                        "animation": "part2_left_houseanim 1s ease 1",
                    });
                },1000);
            }
            //到part2的一半开始字体动画
            if (part2ToTop1 < (scrollHeight + windowScrollHeight)) {
                $(".part2_right img").css({
                    "visibility": "visible",
                    "-webkit-animation": "part2_right_imgmove 0.8s ease 1",
                    "-o-animation": "part2_right_imgmove 0.8s ease 1",
                    "animation": "part2_right_imgmove 0.8s ease 1",
                });
                $(".part2_left_center_right strong").eq(0).css({
                    "visibility": "visible",
                    "-webkit-animation": "part2_left_fontmove 0.5s ease 1",
                    "-o-animation": "part2_left_fontmove 0.5s ease 1",
                    "animation": "part2_left_fontmove 0.5s ease 1",
                });
                setTimeout(function () {
                    $(".part2_left_center_right img").css({
                        "visibility": "visible",
                        "-webkit-animation": "part2_left_fontmove 0.5s ease 1",
                        "-o-animation": "part2_left_fontmove 0.5s ease 1",
                        "animation": "part2_left_fontmove 0.5s ease 1",
                    });
                },500);
                setTimeout(function () {
                    $(".part2_left_center_right strong").eq(1).css({
                        "visibility": "visible",
                        "-webkit-animation": "part2_left_fontmove 0.5s ease 1",
                        "-o-animation": "part2_left_fontmove 0.5s ease 1",
                        "animation": "part2_left_fontmove 0.5s ease 1",
                    });
                },800);
                setTimeout(function () {
                    $(".part2_left_center_right strong").eq(2).css({
                        "visibility": "visible",
                        "-webkit-animation": "part2_left_fontmove 0.5s ease 1",
                        "-o-animation": "part2_left_fontmove 0.5s ease 1",
                        "animation": "part2_left_fontmove 0.5s ease 1",
                    });
                },1300);
            }
            //到part3的一半到3/4之间开始房子动画
            if((part3ToTop1 < (scrollHeight + windowScrollHeight)) && (part3ToTop2 > part3ToTop1)){
                setTimeout(function () {
                    $(".part3_right_bottom img").css({
                        "visibility": "visible",
                        "-webkit-animation": "part2_left_houseanim 1s ease 1",
                        "-o-animation": "part2_left_houseanim 1s ease 1",
                        "animation": "part2_left_houseanim 1s ease 1",
                    });
                },1500);
            }
            //到part3的一半开始字体动画
            if (part3ToTop1 < (scrollHeight + windowScrollHeight)) {
                $(".part3_left img").css({
                    "visibility": "visible",
                    "-webkit-animation": "part1_letf_imgmove 0.8s ease 1",
                    "-o-animation": "part1_letf_imgmove 0.8s ease 1",
                    "animation": "part1_letf_imgmove 0.8s ease 1",
                });
                setTimeout(function () {
                    $(".part3_right_center strong").eq(0).css({
                        "visibility": "visible",
                        "-webkit-animation": "part2_left_fontmove 0.5s ease 1",
                        "-o-animation": "part2_left_fontmove 0.5s ease 1",
                        "animation": "part2_left_fontmove 0.5s ease 1",
                    });
                },500);
                setTimeout(function () {
                    $(".part3_right_center img").css({
                        "visibility": "visible",
                        "-webkit-animation": "part2_left_fontmove 0.5s ease 1",
                        "-o-animation": "part2_left_fontmove 0.5s ease 1",
                        "animation": "part2_left_fontmove 0.5s ease 1",
                    });
                },1000);
            }

            //到part4的一半开始字体动画
            if (part4ToTop1 < (scrollHeight + windowScrollHeight)) {
                $(".part4_right img").css({
                    "visibility": "visible",
                    "-webkit-animation": "part2_right_imgmove 0.8s ease 1",
                    "-o-animation": "part2_right_imgmove 0.8s ease 1",
                    "animation": "part2_right_imgmove 0.8s ease 1",
                });
                setTimeout(function () {
                    $(".part4_left_center span").eq(0).css({
                        "visibility": "visible",
                        "-webkit-animation": "part2_left_fontmove 0.5s ease 1",
                        "-o-animation": "part2_left_fontmove 0.5s ease 1",
                        "animation": "part2_left_fontmove 0.5s ease 1",
                    });
                },500);
                setTimeout(function () {
                    $(".part4_left_center img").css({
                        "visibility": "visible",
                        "-webkit-animation": "part2_left_fontmove 0.5s ease 1",
                        "-o-animation": "part2_left_fontmove 0.5s ease 1",
                        "animation": "part2_left_fontmove 0.5s ease 1",
                    });
                },1000);
                setTimeout(function () {
                    $(".part4_left_center span").eq(1).css({
                        "visibility": "visible",
                        "-webkit-animation": "part2_left_fontmove 0.5s ease 1",
                        "-o-animation": "part2_left_fontmove 0.5s ease 1",
                        "animation": "part2_left_fontmove 0.5s ease 1",
                    });
                },1500);
            }
            //到part4的一半到3/4之间开始大云朵动画
            if((part4ToTop1 < (scrollHeight + windowScrollHeight)) && (part4ToTop2 > part4ToTop1)){
                setTimeout(function () {
                    $(".part4_left_bottom img").css({
                        "visibility": "visible",
                        "-webkit-animation": "part2_left_houseanim 1s ease 1",
                        "-o-animation": "part2_left_houseanim 1s ease 1",
                        "animation": "part2_left_houseanim 1s ease 1",
                    });
                },1500);
            }

            //到part5的一半开始字体动画
            if (part5ToTop1 < (scrollHeight + windowScrollHeight)) {
                $(".part5_left img").css({
                    "visibility": "visible",
                    "-webkit-animation": "part1_letf_imgmove 0.8s ease 1",
                    "-o-animation": "part1_letf_imgmove 0.8s ease 1",
                    "animation": "part1_letf_imgmove 0.8s ease 1",
                });
                setTimeout(function () {
                    $(".part5_right_center span").eq(0).css({
                        "visibility": "visible",
                        "-webkit-animation": "part2_left_fontmove 0.5s ease 1",
                        "-o-animation": "part2_left_fontmove 0.5s ease 1",
                        "animation": "part2_left_fontmove 0.5s ease 1",
                    });
                },500);
                setTimeout(function () {
                    $(".part5_right_center img").css({
                        "visibility": "visible",
                        "-webkit-animation": "part2_left_fontmove 0.5s ease 1",
                        "-o-animation": "part2_left_fontmove 0.5s ease 1",
                        "animation": "part2_left_fontmove 0.5s ease 1",
                    });
                },1000);
                setTimeout(function () {
                    $(".part5_right_center span").eq(1).css({
                        "visibility": "visible",
                        "-webkit-animation": "part2_left_fontmove 0.5s ease 1",
                        "-o-animation": "part2_left_fontmove 0.5s ease 1",
                        "animation": "part2_left_fontmove 0.5s ease 1",
                    });
                },1500);
            }
            //到part5的一半到3/4之间开始建筑动画
            if((part5ToTop1 < (scrollHeight + windowScrollHeight)) && (part5ToTop2 > part5ToTop1)){
                setTimeout(function () {
                    $(".part5_right_bottom img").css({
                        "visibility": "visible",
                        "-webkit-animation": "part2_left_houseanim 0.8s ease 1",
                        "-o-animation": "part2_left_houseanim 0.8s ease 1",
                        "animation": "part2_left_houseanim 0.8s ease 1",
                    });
                },1800);
            }

            //到part6的6/1
            if (part6ToTop1 < (scrollHeight + windowScrollHeight)) {
                $(".part6_content strong").css({
                    "visibility": "visible",
                    "-webkit-animation": "part6_fontmove1 0.8s ease 1",
                    "-o-animation": "part6_fontmove1 0.8s ease 1",
                    "animation": "part6_fontmove1 0.8s ease 1",
                });
            }
            //到part6的6/2
            if (part6ToTop2 < (scrollHeight + windowScrollHeight)) {
//                if(screenWidth > 640) {
                    setTimeout(function () {
                        $(".part6_content_model1 p").eq(0).css({
                            "visibility": "visible",
                            "-webkit-animation": "part6_fontmove1 0.5s ease 1",
                            "-o-animation": "part6_fontmove1 0.5s ease 1",
                            "animation": "part6_fontmove1 0.5s ease 1",
                        });
                    }, 300);
                    setTimeout(function () {
                        $(".part6_content_model1 p").eq(1).css({
                            "visibility": "visible",
                            "-webkit-animation": "part6_fontmove1 0.5s ease 1",
                            "-o-animation": "part6_fontmove1 0.5s ease 1",
                            "animation": "part6_fontmove1 0.5s ease 1",
                        });
                    }, 800);
                    setTimeout(function () {
                        $(".part6_content_model1 p").eq(2).css({
                            "visibility": "visible",
                            "-webkit-animation": "part6_fontmove1 0.5s ease 1",
                            "-o-animation": "part6_fontmove1 0.5s ease 1",
                            "animation": "part6_fontmove1 0.5s ease 1",
                        });
                    }, 1300);
                    setTimeout(function () {
                        $(".part6_content_model1 p").eq(3).css({
                            "visibility": "visible",
                            "-webkit-animation": "part6_fontmove1 0.5s ease 1",
                            "-o-animation": "part6_fontmove1 0.5s ease 1",
                            "animation": "part6_fontmove1 0.5s ease 1",
                        });
                    }, 1800);
                    setTimeout(function () {
                        $(".part6_content_model1 p").eq(4).css({
                            "visibility": "visible",
                            "-webkit-animation": "part6_fontmove1 0.5s ease 1",
                            "-o-animation": "part6_fontmove1 0.5s ease 1",
                            "animation": "part6_fontmove1 0.5s ease 1",
                        });
                    }, 2300);
                    setTimeout(function () {
                        $(".part6_content_model1 p").eq(5).css({
                            "visibility": "visible",
                            "-webkit-animation": "part6_fontmove1 0.5s ease 1",
                            "-o-animation": "part6_fontmove1 0.5s ease 1",
                            "animation": "part6_fontmove1 0.5s ease 1",
                        });
                    }, 2800);
                    setTimeout(function () {
                        $(".part6_content_model1 p").eq(6).css({
                            "visibility": "visible",
                            "-webkit-animation": "part6_fontmove1 0.5s ease 1",
                            "-o-animation": "part6_fontmove1 0.5s ease 1",
                            "animation": "part6_fontmove1 0.5s ease 1",
                        });
                    }, 3300);
                    setTimeout(function () {
                        $(".part6_content_model1 p").eq(7).css({
                            "visibility": "visible",
                            "-webkit-animation": "part6_fontmove1 0.5s ease 1",
                            "-o-animation": "part6_fontmove1 0.5s ease 1",
                            "animation": "part6_fontmove1 0.5s ease 1",
                        });
                    }, 3800);
                }
        }else{
            console.log("向上");
        }
    };
})