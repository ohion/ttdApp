// GWG
!(function(){
  var bonusPoint = {
		openplace: "",   // 1微信   0 天天兑   2其他浏览器
		userAgentInfo: navigator.userAgent,
		isAndroid: navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1,//android终端
		isiOS: navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
		// permissionServer: "appbs.tymshop.com:8080",
    permissionServer: "192.168.168.16:8088",
    getIrefereeId: '',           //平台号
    refuserid: '',               //用户id
    init: function(){
      this.bindEvent();
      // this.openPlace();
      // this.getLikeData();
      this.allData();
      //this.isSortId();
    },
    bindEvent: function(){
    	// 猜你喜欢默认页
      var pages = 1;    
      var self = this;
      $('.nav').on('click', ' li',function(){
        // 新品推荐导航
        self.nav($(this));
      });
      // 下拉刷新
      $(window).bind('scroll', function(){
    	  if($(document).height() === ($(window).height() + $(window).scrollTop())){
    		  pages++;
    		  if(pages > 5){
    			  $(window).off();
    			  $('.footers').addClass('show');
    			  return false;
    		  }
    		  self.getLikeData(pages);
    	  }
      });
      // 点击商品跳转商品详情
			$('.section').on('click', '.content-box', function(){
        // 产品id
        var productId, $this = $(this);
				if($this.hasClass('content-box')){
          productId = $this.data('id');
				} else {
          productId = $this.parents('.content-box').data('id');
				}
				self.detailPage(productId);
			});
			// 点击分类跳转
			$('.header img').click(function(){
				// 分类id
				var sortId = $(this).data('sortid');
				// 分类名称
				var name = $(this).data('name');
				self.sort(sortId, name, 0);
			});
			// 点击品牌
			$('.best-pdct').on('click', '.best-cover img', function(){
				// topicId
				var topicId = $(this).data('topid');
				// 品牌名称
				var name = $(this).data('name');
				self.sort(topicId, name, 1);
			});
			// 点击全局搜索
			$('.search').click(function(){
        // window.location = ''
			});
    },
    sort: function(id, name, reqType){
      var id = JSON.stringify(id);
			// console.log(id);
			// console.log(name);
			// console.log(reqType);

			// 分类
			if(reqType === 0){
        if (bonusPoint.openplace === 0) {  //在天天兑打开
					$('.search').removeClass('hide');    // 打开搜索框
					 if (bonusPoint.isAndroid) {
							 window.jsObj.brandProductList(id, 21, 0, name);//打开店铺
					 }
					 if (bonusPoint.isiOS) {
							 window.location = 'tiantiandui://brandProductList?sortId='+ id +'&sortType=21&reqType=0&brand_name=' + name;
					 }
				 } else if ((bonusPoint.userAgentInfo.indexOf("MicroMessenger") > 0 || bonusPoint.userAgentInfo.indexOf("QQ/") > 0)) { //微信或者QQ
					// 隐藏搜索框
					$('.search').addClass('hide');
						 if (/(iPhone)/i.test(navigator.userAgent)) {
								 $(".brower-name").text("在Safari中打开");
						 } else if (/(Android)/i.test(navigator.userAgent)) {
								 $(".brower-name").text("在浏览器中打开");
						 }
						 $(".pop").show(300);
						 $(".pop-close").click(function () {
								 $(".pop").hide(300);
						 });
				 } else {
					// 隐藏搜索框
					$('.search').addClass('hide');
						 //location.href = "http://"+bonusPoint.permissionServer+"/appbs/TTD-register/register_app.html?lrefereeId=" + bonusPoint.getIrefereeId + "&refuserid=" + bonusPoint.refuserid + "&sortId=" + id;
          location.href = 'http://'+bonusPoint.permissionServer+'/appbs/TTD-register/register_app.html?sortId='+ id +'&sortType=21&reqType=0&brand_name=' + name;
				 }
			}
			// 品牌
      if(reqType === 1){
        if (bonusPoint.openplace === 0) {  //在天天兑打开
          $('.search').removeClass('hide');    // 打开搜索框
          if (bonusPoint.isAndroid) {
            window.jsObj.brandProductList(id, 21, 1, name);//打开店铺
          }
          if (bonusPoint.isiOS) {
            window.location = 'tiantiandui://brandProductList?topiId='+ id +'&sortType=21&reqType=1&brand_name=' + name;
          }
        } else if ((bonusPoint.userAgentInfo.indexOf("MicroMessenger") > 0 || bonusPoint.userAgentInfo.indexOf("QQ/") > 0)) { //微信或者QQ
          // 隐藏搜索框
          $('.search').addClass('hide');
          if (/(iPhone)/i.test(navigator.userAgent)) {
            $(".brower-name").text("在Safari中打开");
          } else if (/(Android)/i.test(navigator.userAgent)) {
            $(".brower-name").text("在浏览器中打开");
          }
          $(".pop").show(300);
          $(".pop-close").click(function () {
            $(".pop").hide(300);
          });
        } else {
          // 隐藏搜索框
          $('.search').addClass('hide');
          //location.href = "http://"+bonusPoint.permissionServer+"/appbs/TTD-register/register_app.html?lrefereeId=" + bonusPoint.getIrefereeId + "&refuserid=" + bonusPoint.refuserid + "&topiId=" + id;
          location.href = 'http://'+bonusPoint.permissionServer+'/appbs/TTD-register/register_app.html?topiId='+ id +'&sortType=21&reqType=1&brand_name=' + name;
        }
      }
		},
    allData: function(){
    	var htmlFont = document.documentElement.clientWidth / 3.75;
    	// 爆款来袭
    	$.ajax({
    		url: 'http://'+ bonusPoint.permissionServer +'/shop/productService/getIntegralProductByType/1',
    		type: 'get',
    		success: function(res){
    			var result = res.result[0].list;
    			// console.log(result);
    			var htmlStr = '';
    			result.forEach(function(v, i){
    				htmlStr += '<div class="content-box" data-id="'+ v.id +'" data-shopId="'+ v.ms_shop_id +'"><div><img src="'+ v.image +'"/></div><div><p class="names">'+ v.name +'</p>';
    				htmlStr += '<div class="pb-box"><p class="price">￥'+ v.price.toFixed(2) +'</p><button type="button" name="button">+积分'+ v.integral +'</button></div></div></div>';
    			});
    			$('.jsHot').append(htmlStr);
    		},
    		error: function(err){
    			console.log(res);
    		}
    	});
    	// 新品推荐
    	$.ajax({
    		// html字体大小
    		url: 'http://'+ bonusPoint.permissionServer +'/shop/productService/getIntegralProductByType/2',
    		type: 'get',
    		success: function(res){
    			var result = res.result;
    			var navStr = '', contentStr = '';    // 导航和导航内容
    			result.forEach(function(v, i){
    				if(i === 0){
    					navStr += '<li class="active">'+ v.name +'</li>';
    					contentStr += '<div class="show">';
    					v.list.forEach(function(v, i){
    						contentStr += '<div class="content-box" data-id="'+v.id+'" data-shopId="'+ v.ms_shop_id +'"><div><img src="'+ v.image +'"/></div><div><p class="names">'+ v.name +'</p>';
    						contentStr += '<div class="pb-box"><p class="price">￥'+ v.price.toFixed(2) +'</p><button type="button" name="button">+积分'+ v.integral +'</button></div></div></div>';
    					});
    					contentStr += '</div>';
    				} else {
    					navStr += '<li>'+ v.name +'</li>';
    					contentStr += '<div>';
    					v.list.forEach(function(v, i){
    						contentStr += '<div class="content-box" data-id="'+v.id+'"><div><img src="'+ v.image +'"/></div><div><p class="names">'+ v.name +'</p>';
    						contentStr += '<div class="pb-box"><p class="price">￥'+ v.price +'</p><button type="button" name="button">+积分'+ v.integral +'</button></div></div></div>';
    					});
    					contentStr += '</div>';
    				}
    				// 当i > 3 时 ul宽度变化
    				if(i > 3){
        				$('.new-pdct ul').width((i+1)*25 + '%');
        			}
    			});
    			$('.jsNewNav').append(navStr);
    			$('.jsNewContent').append(contentStr);
    		},
    		error: function(err){
    			console.log(err);
    		}
    	});
    	// 精选大牌
    	$.ajax({
    		url: 'http://'+ bonusPoint.permissionServer +'/shop/productService/getIntegralProductByType/3',
    		type: 'get',
    		success: function(res){
    			var result = res.result;
    			console.log(result);
    			var htmlStr = '';
    			result.forEach(function(v, i){
    				htmlStr += '<div class="best-contentIn"><div class="best-cover"><img src="'+ v.img +'" data-name="'+ v.name +'" data-topId="'+ v.topic_id +'"/></div><div><div class="content-wrap">';
    				// 容器宽度
    				htmlStr += '<div class="cf" style=" width: '+ v.list.length*(1.45*htmlFont) +'px">';
    				v.list.forEach(function(v, i){
    					htmlStr += '<div class="content-box" data-id="'+ v.id +'" data-shopId="'+ v.ms_shop_id +'"><div><img src="'+ v.image +'"/></div><div><p class="names">'+ v.name +'</p>';
    					htmlStr += '<div class="pb-box"><p class="price">￥'+ v.price.toFixed(2) +'</p><button type="button" name="button">+积分'+ v.integral +'</button></div></div></div>';
    				});
    				htmlStr += '</div></div></div></div>';
    			});
    			$('.jsBestContent').append(htmlStr);
    		},
    		error: function(err){
    			console.log(err);
    		}
    	});
      bonusPoint.getIrefereeId = this.getQueryString('lrefereeId');  //平台号
      bonusPoint.refuserid = this.getQueryString('refuserid'); 		   //用户id
    	this.isSortId();
    	this.openPlace();
    },
    // 判断分类id
    isSortId: function(){
    	var sortId = bonusPoint.getQueryString('sortIds');
    	// $('body').prepend(sortId);
    	if(!JSON.parse(sortId)[0]){
    		// 没有分类id时 隐藏猜你喜欢内容
    		$('.like-pdct').hide();
    		// 禁用滚动条事件
    		$(window).off();
    	} else {
    		// 有分类id时 呈现猜你喜欢内容
    		$('.like-pdct').show();
    		// 获取喜欢的数据
    		this.getLikeData(1, sortId);
    	}
    },
    openPlace: function(){
    	bonusPoint.isApp = Number(bonusPoint.getQueryString('isApp'));
    	var search = $('.search');
      search.addClass('hide');
    	if (bonusPoint.isApp) {  //在天天兑打开
        search.removeClass('hide');    // 打开搜索框
    		bonusPoint.openplace = 0;
        } else if (
    		bonusPoint.userAgentInfo.toLocaleLowerCase().match(/MicroMessenger/i) == 'micromessenger') {   //在微信打开
        	bonusPoint.openplace = 1;
        } else {   //在其他浏览器打开
        	bonusPoint.openplace = 2;
        }
    },
    // 店铺
    // shopStore: function(e){
    // 	if (bonusPoint.openplace === 0) {  //在天天兑打开
    // 		$('.search').removeClass('hide');    // 打开搜索框
	   //      if (bonusPoint.isAndroid) {
	   //          window.jsObj.toShop(e);//打开店铺
	   //      }
	   //      if (bonusPoint.isiOS) {
	   //          window.location = "tiantiandui://storeProductList?storeId=" + e;
	   //      }
	   //  } else if ((bonusPoint.userAgentInfo.indexOf("MicroMessenger") > 0 || bonusPoint.userAgentInfo.indexOf("QQ/") > 0)) { //微信或者QQ
	   //  	// 隐藏搜索框
	   //  	$('.search').addClass('hide');
	   //      if (/(iPhone)/i.test(navigator.userAgent)) {
	   //          $(".brower-name").text("在Safari中打开");
	   //      } else if (/(Android)/i.test(navigator.userAgent)) {
	   //          $(".brower-name").text("在浏览器中打开");
	   //      }
	   //      $(".pop").show(300);
	   //      $(".pop-close").click(function () {
	   //          $(".pop").hide(300);
	   //      });
	   //  } else {
	   //  	// 隐藏搜索框
	   //  	$('.search').addClass('hide');
	   //      location.href = "http://"+bonusPoint.permissionServer+"/appbs/TTD-register/register_app.html?lrefereeId=" + getIrefereeId + "&refuserid=" + refuserid + "&shopId=" + e;
	   //  }
    // },
    // 详情页
    detailPage: function(e){
    	// var getIrefereeId = this.getQueryString('lrefereeId');  //平台号
    	// var refuserid = this.getQueryString('refuserid'); 		//用户id
       //  var gtype = "";
       //  if (w > 0) {
       //      gtype = 2;
       //  } else {
       //      gtype = 0;
       //  }
        if (bonusPoint.openplace === 0) {  //在天天兑打开
            if (bonusPoint.isAndroid) {
            	$('body').prepend(e);
                window.jsObj.openProductDetail(e, 3);    //打开产品详情
            }
            if (bonusPoint.isiOS) {
                // window.location = "TianTianDui://goodInfoRouter?mark_id=" + e + "&detail_Type=" + gtype; //打开详情页
              window.location = "TianTianDui://integralInfoRouter?mark_id=" + e + "&detail_Type=" + 3; //打开详情页
            }
        } else{
            window.location.href="http://"+ bonusPoint.permissionServer +"/appbs/integral/goods-detail/index.html?lrefereeId="+bonusPoint.getIrefereeId+"&refuserid="+bonusPoint.refuserid+ "&productId=" + e + "&type=" + 3;
        }
    },
    // 猜你喜欢数据获取
    getLikeData: function(pages, sortId){
    	// 默认加载第一页的数据
    	var page = pages || 1;
    	$.ajax({
    		url: 'http://'+ bonusPoint.permissionServer +'/shop/productService/getRecommandIntegralProduct/'+ page +'/'+ sortId,
    		type: 'get',
    		success: function(res){
    			// 获取的数据
    			var result = res.result;
    			var strHtml = '';
    			result.forEach(function(v, i){
    				strHtml += '<div class="content-box" data-id="'+ v.id +'"  data-shopId="'+ v.ms_shop_id +'"><div class="img-box"><img src="'+ v.image +'"/><p class="names">'+ v.name +'</p></div>';
					strHtml += '<div><p class="price">￥'+ v.price.toFixed(2) +'</p><button type="button" name="button">+'+ v.integral +'</button><img class="img" src="images/icon-shopCar.png"/></div></div>';
    			});
    			$('.jsLikeContent').append(strHtml);
    		},
    		error: function(err){
    			$('body').prepend(err);
    			console.log(err);
    		}
    	})
    },
    // url 参数获取
    getQueryString:function (name) { 
    	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    	var r = window.location.search.substr(1).match(reg); 
    	if (r != null) return unescape(r[2]); return null; 
    }, 
    nav: function(e){
      var index = e.index();               // index值
      e.addClass('active').siblings().removeClass('active');
      $('.pdct-content > div').eq(index).addClass('show').siblings().removeClass('show');
    }
  };
  bonusPoint.init();
}());
