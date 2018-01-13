//吐司小插件,依赖于jquery
var toast = (function() {
    //var currentScriptPath = document.currentScript.src;//获取当前脚本文件路径,有些手机例如红米不支持
    var currentScriptPath = document.scripts[document.scripts.length - 1].src;//获取当前脚本文件路径
    var loadImgPath = currentScriptPath.slice(0, currentScriptPath.lastIndexOf("/")) + "/wait.gif";//获取菊花图的路径
    var tipsEndCallback;
    //动画消失移除div
    var removeToast = function() {
        //显示1s后关闭吐司
        var narrowTimeout = setTimeout(function() {
            //动画结束后移除div
            $("#shadow").bind("webkitAnimationEnd",function(){
                $("#shadow-box").remove();
                //如果有提示消失后的回调则执行
                if(tipsEndCallback){
                    tipsEndCallback();
                    tipsEndCallback = null;//执行回调后置空,防止影响其他无回调提示
                }
            });
            $("#shadow").css("-webkit-animation", "narrow 350ms ease 1");
            clearTimeout(narrowTimeout);
        }, 1000);
    }
    //转菊花
    var loading = function() {
        $("body").append('<div id="shadow-box"><div id="shadow"><img src="' + loadImgPath + '"/></div></div>');
    }
    //提示
    //msg: 必选，提示信息
    //calback: 可选，提示信息消失后的回调
    var tips = function(msg, calback) {
        $("body").append('<div id="shadow-box"><div id="shadow" style="width:' + (msg.length + 2) + 'em">' + msg + '</div></div>');
        tipsEndCallback = calback || null;//赋值回调
        removeToast();
    }
    //请求结果提示(前提是转菊花等待)
    //msg: 必选，提示信息
    //calback: 可选，提示信息消失后的回调
    var result = function(msg, calback) {
        $("#shadow").css("width", (msg.length + 2) + "em");
        $("#shadow").html(msg);
        tipsEndCallback = calback || null;//赋值回调
        removeToast();
    }
    return {
        loading : loading,
        tips : tips,
        result : result,
        remove: removeToast
    }
})()
