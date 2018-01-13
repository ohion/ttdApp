/**
 * Created by grp on 2016/1/25.
 */
var drawToast = (function () {
	var draw = function(message){
		var shadow = $("#shadow");
		var toast = $("#toast");
		shadow.css("display", "block");
		if (message == 'wait') {
			toast.html('<img src="images/wait.gif">');
		} else {
			toast.html("<p>" + message + "</p>");
			setTimeout(function() {
				shadow.fadeOut(1000);
			}, 1000);
		}
	}
	return draw;
})();
