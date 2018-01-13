/**
 * Created by grp on 2016/1/20.
 */
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

$(document).ready(function () {
    var btn = $(".part1-bottom-btn div");//获取按钮dom
    var order = function(){
    	var areaName = window.location.host;// 获取当前域名
    	var phoneRegular = /^1[3|4|5|7|8]\d{9}$/;// 手机号码格式11位，13、14、15、17、18开头号码
    	var phoneInput = $("#phone");
    	var phone = phoneInput.val();
    	if (phone == '') {
			drawToast("手机号码不能为空！");
			phoneInput.val("");
			return;
		} else if (!phoneRegular.test(phone)) {
			drawToast("请输入正确的11位手机号码！");
			phoneInput.val("");
			return;
		}else {
			drawToast('wait');
			var url = "http://" + areaName
			+ "/appbs/autoInsurance?phone=" + phone;
			$.post(url, function(data){
				drawToast((data.result == 0) ? "预约成功" : "预约失败");
			}).error(function() {
				drawToast('没有该服务！');
			});
		}
    }
    if(IsPC()){
        //PC端添加点击事件
        btn.on("click", function () {
        	var action = $(this).find("span").text();//获取按钮text
            if(action == '立即预约'){
            	order();
            }else{
                location.href = "http://appbs.tymshop.com:8080/appbs/register/regist.html";
            }
        })
    }else{
        //给按钮添加触摸事件，在移动设备上反应比onclick灵敏
        btn.on("touchstart", function (e) {
        	var action = $(this).find("span").text();//获取按钮text
            $(this).css("-webkit-transform","scale(0.9,0.9)");
            if(action == '立即预约'){
            	order();
            }else{
                location.href = "http://appbs.tymshop.com:8080/appbs/register/regist.html";
            }
        })
        btn.on("touchend", function (e) {
            $(this).css("-webkit-transform","scale(1,1)");
        })
    }
})