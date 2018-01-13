/**
 * Created by ganruip on 2016/3/8.
 */
//获取url参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var url = decodeURI(window.location.search);
    var r = url.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
var userId = getQueryString("userId");
var phone = getQueryString("phone");
document.getElementById("metao-ticket-url").href = "http://main.tymplus.com/myquan/index.aspx?type=0&isClient=Main&user_id=" + userId;
document.getElementById("shopcoin-ticket-url").href = "http://vip2.tymplus.com/myquan/myquan.aspx?type=0&isClient=Main&user_id=" + userId;
//document.getElementById("seckill-ticket-url").href = "http://skill.tymplus.com/MiaoSha/MyCoupon.aspx?States=1&Phone=" + phone;
