$(document).ready(function(e) {
	var phoneList = [
	{"img":"","name":"农业银行","phone":"95599"},
	{"img":"","name":"中国银行","phone":"95566"},
	{"img":"","name":"建设银行","phone":"95533"},
	{"img":"","name":"中国人保寿险","phone":"95591"},
	{"img":"","name":"工商银行","phone":"95588"},
	{"img":"","name":"顺丰快递","phone":"95338"},
	{"img":"","name":"圆通快递","phone":"95554"},
	{"img":"","name":"中国南方航空","phone":"95539"},
		];

	phoneList.forEach(function(l){
		var html = '<div class="hot"><div class="grid-100"> <div class=" grid-20 mobile-grid-30"><a href="#"><img src="" id="phoneImg"/></a></div><div class=" grid-60 mobile-grid-40"><a id="phoneTitle">'+l.name+'<br /><span id="phoneNum">'+l.phone+'</span></a></div> <div class=" grid-20 mobile-grid-30"><a href="http://tym.bstoapp.com/callphone?phone_num='+l.phone+'"><img src="img/iconfont-dianhua.png"/></a></div></div></div>';
		$('.hotline p').after(html);
	})
	hide();
	});
