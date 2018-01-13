/**
 * Created by grp on 2016/1/25.
 */
function search(){
	var startTime = $("#startTime").val();
	var endTime = $("#endTime").val();
	if(startTime == '' || endTime == '') {
		drawToast("起始及结束时间都不能为空！");
	} else {
		var startTime = Date.parse(new Date(startTime));//精确到毫秒
		var endTime = Date.parse(new Date(endTime));//精确到毫秒
		if(endTime < startTime){
			drawToast("结束时间不能小于起始时间！");
		}else{
			startTime = parseInt(startTime) - 3600000 * 8;//当天0时开始(00:00) -8小时,这样就包含了当天0时开始
			endTime = parseInt(endTime) + 3600000 * 16 - 1;//当天24时前(23:59) +16小时,这样就包含了当天23:59结束
			var areaName = window.location.host;// 获取当前域名
			console.log(startTime);
			console.log(endTime);
			console.log(new Date(parseInt(startTime)).toLocaleString().replace(/:\d{1,2}$/,' '));
			console.log(new Date(parseInt(endTime)).toLocaleString().replace(/:\d{1,2}$/,' '));
			drawToast('wait');//loading
			var url = "http://" + areaName
			+ "/appbs/getAutoInsuranceByTime?startTime=" + startTime + "&endTime=" + endTime;
			$.get(url, function(data){
				if(data.result == "0"){
					drawToast("查找成功！");
					$(".data").remove();//移除旧数据
					$("table").css("display","table");
					var list = data.datas;
					console.log(list);
					for(var i in list){
						var time = (list[i].time + "").slice(0, 10);
						time = new Date(parseInt(time) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');
						$("table").append("<tr class='data'><td>" + list[i].phone + "</td><td>" + time + "</td></tr>")
					}
				}else{
					drawToast("没找到相关信息！");
				}
			}).error(function() {
				drawToast('没有该服务！');
			});
		}
	}
}

$(document).ready(function () {
	//默认显示当天日期
	document.getElementById('startTime').valueAsDate = new Date();
	document.getElementById('endTime').valueAsDate = new Date();
});
