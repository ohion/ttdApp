/**
 * Created by ohion on 2017/10/30.
 */
$(function(){
    var token = getUrlParam("token");
    var openplace = "";// 1微信   0 天天兑   2其他浏览器
    var userAgentInfo = navigator.userAgent;
    var isAndroid = userAgentInfo.indexOf('Android') > -1 || userAgentInfo.indexOf('Adr') > -1;//android终端
    var isiOS = !!userAgentInfo.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    var getIrefereeId = getUrlParam('lrefereeId'); //平台号
    var refuserid = getUrlParam('refuserid'); //用户id
    var isApp = getUrlParam('isApp');
    if (isApp) {  //在天天兑打开
        openplace = 0;
    } else if (userAgentInfo.toLocaleLowerCase().match(/MicroMessenger/i) == 'micromessenger') {   //在微信打开
        openplace = 1;
    } else {   //在其他浏览器打开
        openplace = 2;
    }
    var param = window.location.search;
    var docEl = document.documentElement;
    var clientWidth = docEl.clientWidth;
    var scaleWidth = clientWidth / 375;//不同屏幕的适配比例
    var singleday = {
        data:[],
        init:function(){
            singleday.getData(0);
            singleday.getData(1);  
            singleday.getData(2);    
            singleday.eventBind();
        },
        getData:function(type){                                                                                                                                                                                                                                                                                                                                                                                                                 
        	var _this = this;
            $.ajax({
                url:"/shop/productService/getActivityProduct/"+type,
                type:"get",
                success:function(res){
                    if(res.state==0){
                        _this.render(res.result,type);
                        _this.data[type] = res.result;
                    }
                },  
                error:function(err){
                    console.log(err);
                    window.history.go(0);
                }
            })
        },
        render:function(arr,type){  // 0是现金，1混合  2购物币
            var htmlstr = '';
                for(var i=0;i<arr.length;i++){
                    htmlstr +='<li>';
                    if(type==1){
	                    if((i+1)%3==0 ){
	                        htmlstr +='<div class="imgbox" style="height:'+138*scaleWidth+'px">';
	                    }else{
	                        htmlstr +='<div class="imgbox" style="height:'+158*scaleWidth+'px">';
	                    }
                    }else if(type==0){
                    	if((i+1)%4==3 || (i+1)%4 ==0){
                            htmlstr +='<div class="imgbox" style="height:'+158*scaleWidth+'px">';
                        }else{
                            htmlstr +='<div class="imgbox" style="height:'+138*scaleWidth+'px">';
                        }
                    }else {
                    	htmlstr +='<div class="imgbox" style="height:'+158*scaleWidth+'px">';
                    }
                    htmlstr +='<img src="'+arr[i].image+'" alt="">';
                    htmlstr +='</div><div class="detailcon"><div class="title">'+arr[i].name+'</div>';
                    htmlstr +='<div class="p-content"><p>￥'+arr[i].price+'</p>';
                    htmlstr +='<p>+购物币'+arr[i].coin+'</p>';
                    htmlstr +='</div>';
                    htmlstr +='<p class="gobuy">立即购买</p>';
                    var str = arr[i].activity[0].type==1?"满减":"满送";
                    htmlstr +='<div class="rule"><span class="manjian">'+str+'</span>'+arr[i].activity[0].content+'</div>';
                    htmlstr +='</div></li>';
                }
            var th = parseInt(type)+1;
            $(".fullcut>div:nth-of-type("+th+")").find("ul").html(htmlstr); 
        },
        eventBind:function(){
        //  现金专区  跳转到优惠商家
            var _this = this;
            $(".bigcontainer").on("click",".priceRe .poUp,.priceRe .cutbottom",function(){
                _this.goShop(0);
            }).on("click",".coinRe .poUp,.coinRe .cutbottom",function(){
            	_this.goShop(2);
            }).on("click",".pricecoinRe .poUp,.pricecoinRe .cutbottom",function(){
            	_this.goShop(1);
            }).on("click",".priceRe ul li",function(){   //    现金专区
                var index = $(this).index();
                _this.goDetail(0,index);
            }).on("click",".pricecoinRe ul li",function () {  //    现金购物币专区
                var index = $(this).index();
                _this.goDetail(1,index);
            }).on("click",".coinRe ul li",function () {   //    购物币专区
                var index = $(this).index();
               _this.goDetail(2,index);
            })
            $("body").on("click", ".toTop", function () {  //返回顶部
		        // $("body").scrollTop(0);
		        $("body").animate({scrollTop: 0}, {
		            speed: 3000,
		            easing: "swing"
		        });
		    });
		   /* var oscroll = getScroll();
		    window.onscroll = function () {
		    	console.log(oscroll.scrollTop)
		        if (oscroll.scrollTop > 1000) {
		        	alert("toTop");
		            $(".toTop").fadeIn(300);
		        } else {
		            $(".toTop").fadeOut(300);
		        }
		    };*/
		    $(window).scroll(function(){
				var wHeight = $(window).height(), dHeight = $(document).height(), wScroll = $(window).scrollTop();
				console.log(wScroll);
				if(wHeight + wScroll >= 1500){
					 $(".toTop").fadeIn();
				}else{
					$(".toTop").fadeOut();
				}
			});
		    //封装获取scrollTop方法
		    function getScroll() {
		        if (window.getComputedStyle) {
		            return document.body;//支持谷歌
		        } else {
		            return document.documentElement;//支持IE
		        }
		    }
        },
        goDetail:function(type,index){
        	var obj = this.data[type][index];
            var id = obj.product_mark_id;
            var type = "";
            if (obj.welfare > 0) {
                type = 2;
            } else if (obj.is_seckill > 0) {
                type = 1;
            } else {
                type = 0;
            }
            if (openplace == 0) {  //在天天兑打开
                if (isAndroid) {
                    window.jsObj.openProductDetail(id, type);//打开产品详情
                }
                if (isiOS) {
                    window.location = "TianTianDui://goodInfoRouter?mark_id=" + id + "&detail_Type=" + type; //打开详情页
                }
            } else{
                window.location.href="http://192.168.168.200:8080/appbs/share/share.html?lrefereeId="+getIrefereeId+"&refuserid="+refuserid+ "&id=" + id + "&type=" + type;
            }
        },
        goShop:function(e){
        	location.href = "http://192.168.168.27:8080/shop/view/app/discountDetail/index.html"+param+"&type="+e;
        }
    }
    singleday.init();
})