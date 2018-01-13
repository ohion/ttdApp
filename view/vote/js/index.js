function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}
var userid = getQueryString("userid");
var lrefereeId = getQueryString("lrefereeId");
var refuserid = getQueryString("refuserid");
var url_param = window.location.search;
var phone = getQueryString("phone");
//    控制字体大小
(function (doc, win) {
    var docEl = doc.documentElement,retime,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            docEl.style.fontSize = 100 * (clientWidth / 375) + 'px';
        };
    // Abort if browser does not support addEventListener
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
$(function(){
	// 获取列表
// 投票
	var host = servers.voteService;
	var page = 1;
	render(page);
	function render(page){
		var voteobj = {
			userId: userid?userid:0,
			page:page
		}
		$.ajax({
			url:"http://"+host+"/vote/queryAssociation",
			type:"post",
			async:false,
			data:voteobj,
			success:function(res){
				res = JSON.parse(res);
				if(res.state == 0){
					$("#head").attr("src",res.result.photoUrl);
					res.result.page = page;
					var tpl = document.getElementById('tpl').innerHTML;
					var newDom = document.createElement("div");
					newDom.innerHTML = template(tpl, {result: res.result});
					document.getElementById('content').appendChild(newDom);
					if(res.result.list.length == 0){
						$(window).unbind('scroll', getmore);//解绑scroll事件
						$(".tip").text("到底咯");
					}
				}
			},
			error:function(err){
				toast.tips('网络不顺畅，请稍后再试');

			}
		})
	}
	
	//下拉加载更多
	// window.addEventListener("scroll",getmore);
	 $(window).scroll(getmore);
	function getmore(){
		var oscroll = $(document).scrollTop()+$(window).height();
		if(oscroll>$("#content").height()+150){
			render(++page);
		}
	}
	$("#content").on("click",".vote",function(){
		var id = $(this).data("id");
		var ele = $(this);
		// 跳到注册界面
		// if(!userid){
		if(!userid){
			window.location.href = "http://"+window.location.host+"/appbs/vote/invite.html"+url_param+"&id="+id;
		}else if(userid && phone){
			var obj = {
				userId: userid,
				id: id,
				phone:phone
			}
			// 投票
			$.ajax({
				url:"http://"+host+"/vote/userVote",
				type:"post",
				data:obj,
				success:function(res){
					res = JSON.parse(res);
					if(res.state ==0){
						toast.tips('投票成功');
					    //票数+1   按钮不可点击
					    var votenum = $(ele).parents("li").find(".votenum").text();
					    $(ele).parents("li").find(".votenum").text(votenum-0+1);
					    $(ele).text("已投票").addClass("inactive").prop("disabled",true);
					}else if(res.state == -1){
						toast.tips(res.msg);
					}
				},
				error:function(err){
					toast.tips('网络不顺畅，请稍后再试');
				}
			})
		}else{
			toast.tips('每个用户只能投一票！');
		}
	})
})