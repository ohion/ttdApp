/**
 * Created by grp on 2016/1/25.
 */
var toast = (function () {
	var currentScriptPath = document.scripts[document.scripts.length - 1].src;//��ȡ��ǰ�ű��ļ�·��
	var loadImgPath = currentScriptPath.slice(0, currentScriptPath.lastIndexOf("/")) + "/wait.gif";//��ȡ�ջ�ͼ��·��
	var draw = function(message){
		var shadow = $("#shadow");
		var toast = $("#toast");
		shadow.css("display", "block");
		if (message == 'wait') {
			toast.html('<img src="' + loadImgPath + '">');
		} else {
			toast.html("<p>" + message + "</p>");
			setTimeout(function() {
				shadow.fadeOut(1000);
			}, 1000);
		}
	}
	return draw;
})();
