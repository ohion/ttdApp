// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }
      
      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module;

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({7:[function(require,module,exports) {
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return unescape(r[2]);
    return null;
}
//写cookies
function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
//读取cookies
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

// 获取url参数
var sOpenId = getQueryString("sOpenId");
var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
if (ua.match(/MicroMessenger/i) == "micromessenger") {  //微信  u授权
    sOpenId = getQueryString("sOpenId"); // 获取url sOpenId 参数
    sAccessToken = getQueryString("sAccessToken"); // 获取url sAccessToken 参数
}
var userid = getQueryString("id");
var lrefereeId = getQueryString("lrefereeId");
var refuserid = getQueryString("refuserid");
var url_param = window.location.search;
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
		if(!userid){
			window.location.href = "http://"+servers.shopServer+"/appbs/vote/invite.html"+url_param;
		}else{
			var obj = {
				userId: userid,
				id: id
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
		}
	})
})
},{}],0:[function(require,module,exports) {
var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module() {
  OldModule.call(this);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

if (!module.bundle.parent && typeof WebSocket !== 'undefined') {
  var ws = new WebSocket('ws://' + window.location.hostname + ':58893/');
  ws.onmessage = function(event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        window.location.reload();
      }
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id)
  });
}
},{}]},{},[0,7])