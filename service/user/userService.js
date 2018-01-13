var express = require('express');
var router = express.Router();
var db = require('../../Util/DBUtil.js');
var TYMLock = require('../../Util/TYMLock.min.js');
var async = require('async'); // 加载async 支持顺序、瀑布流等执行


var logger = require('../../Util/LogUtil.js').logger();

var md5 = require("md5");
var https = require("https");
var http = require("http");
//https请求配置
var httpsOptions = {
	// hostname: '192.168.168.229',//内网
	hostname: '120.76.84.231',//外网
	port: 30053,
	path: '',
	method: 'POST',
	rejectUnauthorized: false, //忽略证书验证
	headers: {
		"Content-Length": 0
	}
};
var AESKEY = "tym1234567890123tym1234567890123"; //AES约定密钥
var AESLENGTH = 0; //AES长度参数
var TIMEOUTSECOND = 5000; //请求超时时间

/**
 * 初始化https请求url参数
 * @param  {string} method [https接口方法名称]
 */
function initHttpsReqUrlParams(aesString, method) {
	httpsOptions.headers["Content-Length"] = aesString.length;
	var sBusiness = "UserRegister"; //用户注册业务
	var sTimeStamp = parseInt((new Date()).getTime() / 1000); //获取当前时间，精确到秒
	var sAppKey = "53b7a63d019de6ba32ed2e7fe38dfa72";
	var sAppid = "425388c9c928c3d36856e67b6d86cc11"; //用于身份验证，合法值要通过申请获取
	var sSign = md5(sAppKey + aesString + sTimeStamp + sAppid); //用于验证
	httpsOptions.path = "/?sMethod=" + method + "&sAppid=" + sAppid + "&sTimeStamp=" + sTimeStamp + "&sBusiness=" + sBusiness + "&sSign=" + sSign;
}

//入口
router.use('/', function(req, res) {
	var reqData = req.query;
	var method = reqData.method;
	if (method == "register") {
		var obj = TYMLock.AESUnLockToJson("#*06#", reqData.sCondiction, 4);
		obj.time = TYMLock.AESUnLockToJson("#*06#", reqData.time, 4);
		register(obj, res);
	} else if (method == "phoneCode") {
		var obj = TYMLock.AESUnLockToJson("#*06#", reqData.time, 4);
		reqData.time = obj;
		phoneCode(reqData, res);
	} else if (method == "checkPhoneIsExit") {
		checkPhoneIsExit(reqData, res);
	} else if (method == "getAllRegUser") {
		getAllRegUser(reqData, res);
	} else if (method == "getAllRegisterUserHasLogin") {
		getAllRegisterUserHasLogin(reqData, res);
	} else if (method == "getRegisterCountByUserId") {
		getRegisterCountByUserId(reqData, res);
	} else if (method == "getUserRelationByPhone") {
		getUserRelationByPhone(reqData, res);
	} else if (method == "setLoginStateByUserId") {
		setLoginStateByUserId(reqData, res);
	} else if (method == "getAccountById") {
		getAccountById(reqData, res);
	} else {
		res.json({
			state: 500
		});
	}
})

/**
 * 注册接口
 * @param  {obj} reqData [http请求的url参数对象]
 * @param  {obj} res     [http请求的响应对象]
 */
function register(reqData, res) {
	var diff = (Date.now() - reqData.time.iCode) / 1000;
	if (diff > 120) {
		console.log('图片验证码超时');
		res.json({
			state: -11
		});
	} else {
		var lrefereeId = reqData.lrefereeId; //关注平台号ID
		var phone = reqData.phone; //手机号
		var iCode = 400;
		var refuserid = reqData.refuserid;

		if(refuserid == null || refuserid == "null"){
			refuserid = "";

		}
		var data = {
				sAccount: phone,
				sNickName: '女同学',
				sPassword: reqData.password,
				iSex: 0,
				sProvince: '',
				sCity: '',
				sSignature: '',
				sEmail: '',
				sHeadImage: '',
				iPhoneAuth: 1,
				lPlatformID: lrefereeId,
				lPushManId: refuserid,
				sCode: reqData.code
			};
			var aesString = TYMLock.AESLockFormJSON(AESKEY, data, AESLENGTH); //加密
			initHttpsReqUrlParams(aesString, "AddData");
			var httpsReq = https.request(httpsOptions, function(httpsRes) {
				if (httpsRes.statusCode == 200) {
					httpsRes.on('data', function(data) {
						var result = TYMLock.AESUnLockToJson(AESKEY, data.toString(), AESLENGTH); //解密
						var iRet = result.iRet; //请求返回的结果状态
						res.json({
							state: iRet
						});
					})
				} else {
					logger.error("请求注册接口连接异常");
					res.json({
						state: iCode
					});
				}
			});
			httpsReq.setTimeout(TIMEOUTSECOND, function() {
				logger.error("请求注册接口请求");
				httpsReq.abort(); //终止请求
			});
			httpsReq.on("error", function(err) {
				logger.error(err);
				res.json({
					state: iCode
				});
			});
			httpsReq.write(aesString + "\n");
			httpsReq.end(); //记得要结束请求
	}
}

/**
 * 获取手机验证码接口
 * @param  {obj} reqData [http请求的url参数对象]
 * @param  {obj} res     [http请求的响应对象]
 */
function phoneCode(reqData, res) {
	console.log(reqData);
	var diff = (Date.now() - reqData.time.iCode) / 1000;
	if (diff > 60) {
		console.log('图片验证码超时');
		res.json({
			iCode: -11
		});
	} else {
		var phone = reqData.phone;
		var iCode = 400;
		//同步执行,增强代码可读性
		async.series([
			function(callback) {
				var data = {
					sAccount: phone,
				};
				var aesString = TYMLock.AESLockFormJSON(AESKEY, data, AESLENGTH); //加密
				initHttpsReqUrlParams(aesString, "IsRegistered");
				var httpsReq = https.request(httpsOptions, function(httpsRes) {
					if (httpsRes.statusCode == 200) {
						httpsRes.on('data', function(data) {
							var result = TYMLock.AESUnLockToJson(AESKEY, data.toString(), AESLENGTH); //解密
							var iRet = result.iRet;
							callback((iRet == 0) ? null : iRet);
						})
					} else {
						logger.error("请求是否注册连接异常");
						callback(iCode);
					}
				});
				httpsReq.setTimeout(TIMEOUTSECOND, function() {
					logger.error("请求是否注册请求超时");
					httpsReq.abort(); //终止请求
				});
				httpsReq.on("error", function(err) {
					logger.error(err);
					callback(iCode);
				});
				httpsReq.write(aesString + "\n");
				httpsReq.end(); //记得要结束请求
			},
			function(callback) {
				var data = {
					"iServerID": reqData.piServerID,
					"sAccount": phone
				}; //请求数据
				var aesString = TYMLock.AESLockFormJSON(AESKEY, data, AESLENGTH); //加密
				initHttpsReqUrlParams(aesString, "PhoneCode");
				var httpsReq = https.request(httpsOptions, function(httpsRes) {
					if (httpsRes.statusCode == 200) {
						httpsRes.on('data', function(data) {
							var result = TYMLock.AESUnLockToJson(AESKEY, data.toString(), AESLENGTH); //解密
							var iRet = result.iRet;
							console.log(result);
							if (iRet == 0) {
								console.log("验证码==" + result.sCode);
								iRet = "0";
							}
							callback(iRet);
						})
					} else {
						logger.error("请求获取验证码连接异常");
						callback(iCode);
					}
				});
				httpsReq.setTimeout(TIMEOUTSECOND, function() {
					logger.error("请求获取验证码超时");
					httpsReq.abort(); //终止请求
				});
				httpsReq.on("error", function(err) {
					logger.error(err);
					callback(iCode);
				});
				httpsReq.write(aesString + "\n");
				httpsReq.end(); //记得要结束请求
			}
		], function(state, results) {
			console.log("中途出错或者成功执行完所有会进入这里");
			res.json({
				iCode: state
			});
		})
	}
}

/**
 * 获取所有注册用户
 * @param  {obj} reqData [http请求的url参数对象]
 * @param  {obj} res     [http请求的响应对象]
 */
function getAllRegUser(reqData, res) {
	db.SQL("select refuserid,userid,machineid,phone,addtime as lupdateId from register where userid<>0 and addtime>? order by addtime", reqData.lupdateId, function(rows) {
		res.json({
			result: rows
		});
	}, function(err) {
		logger.error(err);
		res.json(err);
	});
}

/**
 * 获取所有已登录用户
 * @param  {obj} reqData [http请求的url参数对象]
 * @param  {obj} res     [http请求的响应对象]
 */
function getAllRegisterUserHasLogin(reqData, res) {
	db.SQL("select refuserid,userid,machineid,logintime as lupdateId from register where userid<>0 and  logintime>? order by logintime", reqData.lupdateId, function(rows) {
		res.json(rows);
	}, function(err) {
		logger.error(err);
		res.json(err);
	});
}

/**
 * 获取用户的推广人数
 * @param  {obj} reqData [http请求的url参数对象]
 * @param  {obj} res     [http请求的响应对象]
 */
function getRegisterCountByUserId(reqData, res) {
	db.SQL("select count(*) as count from register where refuserid=?", reqData.refUserId, function(rows) {
		res.json(rows);
	}, function(err) {
		logger.error(err);
		res.json(err);
	});
}

/**
 * 设置登录状态
 * @param  {obj} reqData [http请求的url参数对象]
 * @param  {obj} res     [http请求的响应对象]
 */
function setLoginStateByUserId(reqData, res) {
	var userId = reqData.userId;
	db.SQL("select count(*) as count from register where logintime='' and userid=?", userId, function(rows) {
		if (rows[0].count > 0) {
			db.SQL("update register set logintime=? where userid =?", [(new Date()).getTime(), userId], function(rows) {
				res.json({
					result: (rows.affectedRows == 1) ? 0 : 1
				});
			}, function(err) {
				logger.error(err);
				res.json(err);
			});
		} else {
			res.json({
				result: 1
			});
		}
	}, function(err) {
		logger.error(err);
		res.json(err);
	});
}

/**
 * 通过手机号获取用户信息、推广人信息、下线的信息
 * @param  {obj} reqData [http请求的url参数对象]
 * @param  {obj} res     [http请求的响应对象]
 */
function getUserRelationByPhone(reqData, res) {
	var phone = reqData.phone;
	console.log(phone);
	//同步执行,增强代码可读性
	async.waterfall([
		function(callback) {
			//判断是否存在此用户
			db.SQL("select userid,machineid from register where phone=?", phone, function(rows) {
				var resultLength = rows.length;
				callback((resultLength > 0) ? null : 1, (resultLength > 0) ? rows[0] : {});
			}, function(err) {
				logger.error(err);
				callback(err, {});
			});
		},
		function(results, callback) {
			console.log(results);
			//查找用户推广人id
			db.SQL("select refuserid from register where userid=?", results.userid, function(rows) {
				console.log(rows);
				callback(null, {
					userInfo: results,
					refUserInfo: rows[0]
				});
			}, function(err) {
				logger.error(err);
				callback(err, {});
			});
		},
		function(results, callback) {
			var refuserid = results.refUserInfo.refuserid;
			//查找用户推广人信息
			if (refuserid != "") {
				db.SQL("select machineid,phone from register where userid=?", refuserid, function(rows) {
					console.log(rows);
					var refUserInfo = rows[0];
					refUserInfo.refuserid = refuserid;
					results.refUserInfo = refUserInfo;
					callback(null, results);
				}, function(err) {
					logger.error(err);
					callback(err, {});
				});
			} else {
				callback(null, results);
			}
		},
		function(results, callback) {
			//查找用户的所以下线信息
			db.SQL("select userid,machineid,phone from register where refuserid=?", results.userInfo.userid, function(rows) {
				results.extendUsers = rows;
				callback(null, results);
			}, function(err) {

				logger.error(err);
				callback(err, {});
			});
		},
	], function(err, results) {
		results.result = (err) ? err : 0;
		res.json(results);
	});
}

/**
 * 通过平台ID获取平台名称
 * @param  {obj} reqData [http请求的url参数对象]
 * @param  {obj} res     [http请求的响应对象]
 */
function getAccountById(reqData, res) {
	var lrefereeid = reqData.lrefereeid; //平台ID
	logger.info("平台号"+lrefereeid);
	res.json({
		account: 100012
	})
	// var httpReq = http.get("http://mepay.tymplus.com/GetDataInterface/GetAccount.aspx?QrcodeId=" + lrefereeid, function(httpRes) {
	// 	httpRes.on('data', function(chunk) {
	// 		console.log(chunk.toString());
	// 		res.json(JSON.parse(chunk.toString()));
	// 	});
	// })
	// httpReq.setTimeout(TIMEOUTSECOND, function() {
	// 	console.log("请求超时");
	// 	httpReq.abort(); //终止请求
	// });
	// httpReq.on("error", function(err) {
	// 	logger.error(err);
	// 	res.send("error");
	// });
	// httpReq.end();
}

module.exports = router;