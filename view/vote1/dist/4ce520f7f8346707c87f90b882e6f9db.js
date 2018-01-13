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
})({19:[function(require,module,exports) {
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
  var ws = new WebSocket('ws://' + window.location.hostname + ':61390/');
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
},{}]},{},[0,19])