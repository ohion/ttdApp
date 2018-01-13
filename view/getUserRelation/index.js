/**
 * Created by ganruip on 2016/4/7.
 */
$(document).ready(function(){
    $("form").submit(function(){
        var phone = $.trim($("#phone").val());
        var phoneRegular = /^1[3|4|5|7|8]\d{9}$/;// 手机号码格式11位，13、14、15、17、18开头号码
        if(phone.length == 0){
            toast("手机号不能为空");
        }else if (!phoneRegular.test(phone)) {
            toast("请输入正确的11位手机号码");
        }else{
        	var areaName = window.location.host;// 获取当前域名
            toast("wait");
			var url = "http://" + areaName
			+ "/appbs/UserService?method=getUserRelationByPhone&phone=" + phone;
			$.post(url, function(data){
				console.log(data);
				if(data.state == "500"){
					toast('没有该服务!');
				}else{
					var result = data.result;
					if(result == 0){
						toast('找到了!');
						$(".data").remove();
						var refUserInfo = data.refUserInfo;
						var userInfo = data.userInfo;
						var extendUsers = data.extendUsers;
						var extendUsersNum = extendUsers.length;
						if(refUserInfo.refuserid == ""){
							$("#refuserId").text("无");
							$("#refuserPhone").text("无");
							$("#refuserMachineid").text("无");
						}else{
							$("#refuserId").text(refUserInfo.refuserid);
							$("#refuserPhone").text(refUserInfo.phone);
							$("#refuserMachineid").text(refUserInfo.machineid);
						}
						$("#userId").text(userInfo.userid);
						$("#machineId").text(userInfo.machineid);
						$("#extendNum").text(extendUsersNum);
						$("table").css("display",(extendUsersNum > 0) ? "table" : "none");
						for(var i in extendUsers){
							$("table").append("<tr class='data'><td>" + extendUsers[i].userid + "</td><td>" + extendUsers[i].phone + "</td><td>" + extendUsers[i].machineid + "</td></tr>");
						}
						$("#search-result-box").fadeIn();
					}else if(result == 1){
						$("#search-result-box").fadeOut();
						toast('此用户不存在!');
					}else{
						$("#search-result-box").fadeOut();
						toast('服务器异常,请重试!');
					}
				}
			}).error(function() {
				toast('没有该服务！');
			});
        }
        return false;
    })
})