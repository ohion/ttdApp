// JavaScript Document
var iCode = 0;//待加密
createCode();
var intervalCounter = 0;
var registerClickTime = 0; // 记录点击注册按钮后的时间
var count = 0; // 后面赋值为点击注册按钮的setInterval函数

function drawToast(message) {
	var toast = $("#toast");
	toast.css("display", "block");
	if (message == 'wait') {
		toast.html('<img alt="" src="img/wait.gif" width="50px" height="50px">');
	} else {
		toast.html(message);
		setTimeout(function() {
			toast.fadeOut(1000);
		}, 1000);
	}
}

// 获取url参数
function getQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
}

//创建验证码
function createCode(){
	iCode = Date.now();
	code.createCode($("#code"));
}

var phoneRegular = /^1\d{10}$/; // 手机号码格式
var areaName = window.location.host; // 获取当前域名
//var type = 0;//注册类型默认为0(短信验证码注册),1为验证码注册
var isClickRegister = 0; //记录是否允许点击注册，默认允许
// 注册事件
function register() {
	if (isClickRegister == 0) {
		var phone = $("#account").val();
		var password = $("#password").val();
		//	var repassword = $("#repassword").val();
		var checkcode = $("#checkcode").val();
		var phoneInput = $("#account");
		var passwordInput = $("#password");
		// var repasswordInput = $("#repassword");
		var checkcodeInput = $("#checkcode");
		var imgCodeInput = $("#img_code");
		var lrefereeId = $("#lrefereeId").val(); // 默认推荐人100012
		// var refuserid = $("#refuserid").val();//默认推荐人ID
		var getIrefereeId = getQueryString("lrefereeId"); // 获取url推荐人参数
		var refuserid = getQueryString("refuserid"); // 获取refuserid参数
		// 若有推荐人则替换
		if (getIrefereeId != null) {
			lrefereeId = getIrefereeId;
		}
		var illegal = /[@#\$%\^&\*]+/g; // 非法字符格式

		if (phone == '') {
			drawToast("手机号码不能为空！");
			phoneInput.focus();
		} else if (!phoneRegular.test(phone)) {
			drawToast("请输入正确的手机号码！");
			phoneInput.focus();
		} else {
			if (password.length < 6 || password.length > 16) {
				drawToast("请输入6到16位密码！");
				passwordInput.focus();
				return;
			}
			if (imgCodeInput.val() == "") {
				drawToast("请输入图片验证码！");
				phoneInput.focus();
				return;
			} else if(imgCodeInput.val().toUpperCase() != code.getCode()){
				drawToast("图片验证码错误！");
				return;
			}else if (checkcodeInput.val() == '') {
				drawToast("验证码不能为空！");
				checkcodeInput.focus();
				return;
			} else if (checkcodeInput.val().length != 6) {
				drawToast("验证码必须为6位数！");
				checkcodeInput.focus();
				return;
			} else if (isNaN(checkcodeInput.val())) {
				drawToast("验证码必须为6位数字！");
				checkcodeInput.focus();
				return;
			}
			password = $.md5("T" + password);
			//		repassword = $.md5("T" + repassword);
			//			if (lrefereeId.length != 6 || isNaN(lrefereeId)) {
			if (isNaN(lrefereeId)) {
				drawToast("平台号有误！");
			} else {
				var registBtn = $("#btn_regist");
				if (registBtn.css("opacity") != "0.5") {
					registBtn.css("opacity","0.5");
					setTimeout(function(){
						registBtn.css("opacity","1");
					}, 10000);
					var param = {"phone":phone,"password":password,"code":checkcode,"lrefereeId":lrefereeId,"refuserid":refuserid,"imgCode":imgCodeInput.val()};
					param = Lock('#*06#',JSON.stringify(param),4);
					var time = Lock('#*06#',JSON.stringify({"iCode":iCode}),4);//加密时间串
					var url = "http://" + areaName + "/appbs/UserService?method=register&sCondiction="+encodeURIComponent(param)+"&time="+encodeURIComponent(time);
					//var url = "http://" + areaName + "/appbs/UserService?method=register&phone=" + phone + "&password=" + password + "&code=" + checkcode + "&lrefereeId=" + lrefereeId + "&refuserid=" + refuserid;
					isClickRegister = 1;
					console.log("isClickRegister=" + isClickRegister);
					drawToast("wait");
					$.post(url, function(data, state) {
						isClickRegister = 0;
						console.log("isClickRegister=" + isClickRegister);
						switch (parseInt(data.state)) {
							case 0:
								drawToast("注册成功！");
								if (window.location.href.indexOf("regist_app.html") > 0) {
									location.href = 'mapay.tymshop.com/registerSuccess';
								} else {
									location.href = 'succeed.html';
								}
								break;
							case -9:
								drawToast("此账号已注册！");
								break;
							case -8:
								drawToast("验证码错误！");
								checkcodeInput.focus();
								break;
							case -10:
								drawToast("正在注册中！");
								checkcodeInput.focus();
								break;
							case -100:
								drawToast("推广人不存在!");
								break;
							case -101:
								drawToast("平台号不存在!");
								break;
							case -11:
								// drawToast("图片验证码错误！");
								drawToast("图片验证码已过期,请刷新！");
								imgCodeInput.focus();
								break;
							case 400:
							case -999:
								drawToast('网络异常，请重试！');
								checkcodeInput.focus();
								break;
						}
					}).error(function() {
						isClickRegister = 0;
						drawToast('没有该服务！');
					});
				}
			}
		}
	}
}

/*
 *  // alert(password+"\n"+repassword); }
 */
var time = 0; // 记录获取验证码后的时间
var statusForGetcode = 0; // 点击获取验证码状态值0默认，1-60秒，2-120秒，3-180秒
var count = 0; // 后面赋值为setInterval函数
var isClickGetCode = 0; //记录是否允许点击验证码，默认允许
// 获取验证码事件
function getPhoneCode() {
	if (isClickGetCode == 0) {
		var phoneInput = $("#account");
		var passwordInput = $("#password");
		var repasswordInput = $("#repassword");
		var checkcodeInput = $("#checkcode");
		var imgCodeInput = $("#img_code");
		var phone = $("#account").val();
		if (phone == '') {
			drawToast("手机号码不能为空！");
			phoneInput.focus();
		}else if (!phoneRegular.test(phone)) {
			drawToast("请输入正确的手机号码！");
			phoneInput.focus();
		}else if (imgCodeInput.val() == "") {
			drawToast("请输入图片验证码！");
			phoneInput.focus();
		}else if(imgCodeInput.val().toUpperCase() != code.getCode()){
			drawToast("图片验证码错误！");
		}else {
			if (time < 60 && time > 0) {
				drawToast("请求已发送！请不要重复提交！");
			} else {
				if (statusForGetcode > 2) { //最大为3
					statusForGetcode = 1; //重置
				} else {
					statusForGetcode++;
				}
				clearInterval(count);
				time = 60;
				drawToast("wait");
				isClickGetCode = 1;
				console.log("isClickGetCode=" + isClickGetCode);
				var codeTime = Lock('#*06#',JSON.stringify({"iCode":iCode}),4);//加密时间串
				var url = "http://" + areaName + "/appbs/UserService?method=phoneCode&phone=" + phone + "&piServerID=" + statusForGetcode + "&time=" + encodeURIComponent(codeTime);;
				$.post(url, function(data, state) {
					setTimeout(function() {
						isClickGetCode = 0;
						console.log("isClickGetCode=" + isClickGetCode);
					}, 2000);
					var code = parseInt(data.iCode);
					console.log(code);
					if (code == 0) {
						drawToast('获取验证码请求已发出，请耐心等待~');
						count = setInterval(function() {
							$("#btn_catch").text("还剩" + time + "秒");
							time--;
						}, 1000);
						var setText = setTimeout(function() {
							clearInterval(count);
							$("#btn_catch").text("获取验证码");
						}, 1000 * 62);
					}else if(code == -11){
						drawToast('图片验证码已过期,请刷新！');
					}else if(code == -9){
						drawToast('此帐号已注册！');
					} else {
						drawToast('网络异常，请重试！');
					}
				}).error(function() {
					isClickGetCode = 0;
					drawToast('没有该服务！');
				});
			}
		}
	}
}

//判断是否手机端
function IsMobile() {
	var userAgentInfo = navigator.userAgent;
	var Agents = ["Android", "iPhone",
		"SymbianOS", "Windows Phone"
	];
	var flag = false;
	for (var v = 0; v < Agents.length; v++) {
		if (userAgentInfo.indexOf(Agents[v]) > 0) {
			flag = true;
			break;
		}
	}
	return flag;
}
$(document).ready(
	function(e) {
		var browser;
		browser = {
			versions: function() {
				var u = navigator.userAgent,
					app = navigator.appVersion;
				return { // 移动终端浏览器版本信息
					trident: u.indexOf('Trident') > -1, // IE内核
					presto: u.indexOf('Presto') > -1, // opera内核
					webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
					gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, // 火狐内核
					mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
					ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
					android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或uc浏览器
					iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
					iPad: u.indexOf('iPad') > -1, // 是否iPad
					webApp: u.indexOf('Safari') == -1
						// 是否web应该程序，没有头部与底部
				};
			}(),
			language: (navigator.browserLanguage || navigator.language)
				.toLowerCase()
		};
		/*
		 * document.writeln("语言版本: "+browser.language); document.writeln("
		 * 是否为移动终端: "+browser.versions.mobile); document.writeln(" ios终端:
		 * "+browser.versions.ios); document.writeln(" android终端:
		 * "+browser.versions.android); document.writeln(" 是否为iPhone:
		 * "+browser.versions.iPhone); document.writeln(" 是否iPad:
		 * "+browser.versions.iPad); document.writeln(navigator.userAgent);
		 */
		if (browser.versions.mobile == true) {
			$("header").hide();
			$("#content").css("marginTop", "2px");
		}
		//			var explorer = navigator.userAgent;
		//			if(IsMobile()){
		//				$("#toDownloadPage").removeAttr("href");//移除href属性
		//				//如果在QQ或微信打开则显示温馨提示
		//				if((explorer.indexOf("MicroMessenger") > 0 || explorer.indexOf("QQ/") > 0)){
		//					var shareImg = '';//iPhone、android手机微信图标不同
		//					if(navigator.userAgent.indexOf("MicroMessenger") > 0){
		//						if (/(iPhone)/i.test(navigator.userAgent)) {
		//							shareImg = "./img/weixinshare.jpg";
		//						}else if(/(Android)/i.test(navigator.userAgent)){
		//							shareImg = "./img/andr_weixin_share.jpg";
		//						}
		//					}else if(navigator.userAgent.indexOf("QQ/") > 0){
		//						shareImg = "./img/qqshare.jpg";
		//					}
		//					if (/(iPhone)/i.test(navigator.userAgent)) {
		//						$("#phone_browser_word").text("在Safari中打开");
		//					}else if(/(Android)/i.test(navigator.userAgent)){
		//						$("#phone_browser_word").text("在浏览器中打开");
		//					}
		//					$(".shadowTips_bottom_tipsone img").attr("src",shareImg);
		//					
		//					$("#toDownloadPage").click(function () {
		//						$("#shadowTips").fadeIn(300);
		//					});
		//					$(".shadowTips_mid_left img").click(function() {
		//						$("#shadowTips").fadeOut(300);
		//					});
		//				}else if(/(iPhone)/i.test(explorer)){
		//			    	//给按钮设置点击链接  ios下载
		//		    		$("#toDownloadPage").click(function () {
		//		    			location.href = "itms-services://?action=download-manifest&url=https://tiyoumeapp.oss-cn-shenzhen.aliyuncs.com/manifest1.plist";
		//		    		});
		//				}else if(/(Android)/i.test(explorer)){
		//			    	//给按钮设置点击链接  安卓下载
		//			    	$("#toDownloadPage").click(function () {
		//			    		location.href = "http://tiyoumeapp.oss-cn-shenzhen.aliyuncs.com/MeChat.apk";
		//			    	});
		//				}
		//			}else{
		// 设置下载客户端按钮平台号传参
		if (getQueryString("lrefereeId") != null) {
			var url = "download.html?lrefereeid=" + getQueryString("lrefereeId");
			$("#toDownloadPage").attr("href", url);
		}
		//			}
		
		// 以下方式直接跳转之页面重定向  

		var getIrefereeId = getQueryString("lrefereeId"); 
		var refuserid = getQueryString("refuserid"); 
		if(getIrefereeId == null){
			getIrefereeId = "100012";
		}
		if(refuserid == null){
			refuserid = "";
		}
		

		window.location.href='../TTD-register/register.html?lrefereeId='+getIrefereeId+'&refuserid='+refuserid; 

	});



