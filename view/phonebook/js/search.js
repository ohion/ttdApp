﻿// JavaScript Document

function hide(){
	$(".hot img").each(function(index, element) {
		if(index % 2 == 0 || index == 0)
		{
			//console.log("索引"+index+"值"+element);
			if($(element).attr("src") == '')
			{
				console.log("索引"+index);
				$(element).hide();
				console.log($(".hot").find("img").eq(13));
				
				$(".hot").find("img").eq(index+1).css({marginLeft:'150px'});
			}
		}
    });
}

$(document).ready(function(e) {
	
	$(".search").hide();
    $("input").click(function(){
		$(".cancle").show();
		$("#content").animate({marginTop:'0px'},200);
	    $(".search").hide();
		});
    
 

	var browser={
		versions:function(){
			var u = navigator.userAgent, app = navigator.appVersion;
			return {         //移动终端浏览器版本信息
				trident: u.indexOf('Trident') > -1, //IE内核
				presto: u.indexOf('Presto') > -1, //opera内核
				webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
				gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
				mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
				ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
				android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
				iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
				iPad: u.indexOf('iPad') > -1, //是否iPad
				webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
			};
		}(),
		language:(navigator.browserLanguage || navigator.language).toLowerCase()
	}
	/*document.writeln("语言版本: "+browser.language);
	document.writeln(" 是否为移动终端: "+browser.versions.mobile);
	document.writeln(" ios终端: "+browser.versions.ios);
	document.writeln(" android终端: "+browser.versions.android);
	document.writeln(" 是否为iPhone: "+browser.versions.iPhone);
	document.writeln(" 是否iPad: "+browser.versions.iPad);
	document.writeln(navigator.userAgent);*/
	if(browser.versions.mobile== true){
		$(".header").hide();
		$("#content").css("marginTop","0px");
	}

	
	
});
