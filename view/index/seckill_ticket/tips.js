/**
 * Created by ganruip on 2016/2/23.
 */
//获取url参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var url = decodeURI(window.location.search);
    var r = url.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}
var phone = getQueryString("Phone");
document.getElementById("ticket-url").href = "http://skill.tymplus.com/MiaoSha/MyCoupon.aspx?States=1&Phone=" + phone;
//document.getElementById("ticket-url").setAttribute("href","http://skill.tymplus.com/MiaoSha/MyCoupon.aspx?States=1&Phone="+phone);