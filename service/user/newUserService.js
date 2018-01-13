	var express = require('express');
	var router = express.Router();
	var TYMLock = require('../../Util/TYMLock.min.js');
	var logger = require('../../Util/LogUtil.js').logger();
	var md5 = require("md5");
	var async = require("async");
	var request = require("request");
	var https = require("https");
	var http = require("http");
	var ccap = require('ccap')({width:256,//set width,default is 256

    height:60,//set height,default is 60

    offset:40,//set text spacing,default is 40

    quality:100,//set pic quality,default is 50quality:0.05});
	generate:function(){//自定义生成随机数
                this.width;
                this.height;
                return ""+(Math.floor(Math.random()*(9999-1000))+1000);
        }	
});
	//https请求配置
	var httpsOptions = {
		hostname: '', //外网
		port: 0,
		path: '',
		method: 'POST',
		rejectUnauthorized: false, //忽略证书验证
		headers: {
			"Content-Length": 0
		}
	};
	var sAppKey = "425388c9c928c3d36856e67b6d86cc11";
	var sAppid = "53b7a63d019de6ba32ed2e7fe38dfa72";
	var AESKEY = "tym1234567890123tym1234567890123"; //AES约定密钥
	var AESLENGTH = 0; //AES长度参数
	var TIMEOUTSECOND = 10000; //请求超时时间

	/**
	 * 初始化https请求url参数
	 * @param  {string} aesString [aes加密后的请求参数]
	 * @param  {string} method [https接口方法名称]
	 * @param  {string} sBusiness [业务名称]
	 * @param  {string} port [https服务端口]
	 */
	 function initHttpsReqUrlParams(aesString, method, sBusiness, port, serverIp) {
	 	httpsOptions.headers["Content-Length"] = aesString.length;
		var sTimeStamp = parseInt((new Date()).getTime() / 1000); //获取当前时间，精确到秒
		var sSign = md5(sAppid + aesString + sTimeStamp + sAppKey); //用于验证
		httpsOptions.hostname = serverIp;
		httpsOptions.port = port;
		httpsOptions.path = "/?sMethod=" + method + "&sAppid=" + sAppKey + "&sTimeStamp=" + sTimeStamp + "&sBusiness=" + sBusiness + "&sSign=" + sSign;
	}

	//var shopServer = "http://192.168.168.68:8081";//商城测试
	var shopServer = "http://appbs.tymshop.com:8088";//商城外网

	//重定向到下载链接
	router.get('/getImage/:phone', function(req, res) {
var userAgent = req.headers['user-agent'];
  console.log("用户:"+req.params.phone+",信息:"+userAgent);
  if(userAgent.indexOf("Mozilla/4.0") >=0){
    console.log("非法请求");
    res.status(404).send({'state':'404','result':'没有找到相应的服务或页面'});
  }
	
	var myDate = new Date();
		var phone = req.params.phone;
		if(!phone){
			return;
		}
		var ary = ccap.get();
		var txt = ary[0];
		console.log(phone+","+txt)
		global.name[phone] = txt+","+myDate;
		var arr = Object.keys(global.name);
		var len = arr.length;
		logger.info("长度"+len);
		var buf = ary[1];

		res.end(buf);
	});

	//每分钟执行清除
	setInterval(function () {
		for(var phone in global.name){
			var val = global.name[phone];
			var time = val.split(",")[1];
			time = new Date(time);
			var curTime = new Date();
			if(curTime - time > 60000){
				delete global.name[phone];//60s清除
			}
		}
	},60000)

	//重定向到下载链接
	router.get('/checkCode/:phone/:code', function(req, res) {
		var myDate = new Date();
		var phone = req.params.phone;
		var checkCode = req.params.code;

		if(!phone){
			res.json({
			state: 1,
			result: "手机号码不正确"
		})
			return;
		}
		//if(!global.name[phone]){
		//	res.json({
         //                       state: 1,
         //                       result: "图型验证码有误,请刷新验证码"
         //               })
		//}
		var info = global.name[phone];
		if(!info){
			logger.info("图型验证码已失效,请刷新验证码");
			res.json({
				state: 1,
				result: "图型验证码已失效,请刷新验证码"
			})
			return;
		}

		var phoneArray =  info.split(",");
		var code = phoneArray[0];
		var time = phoneArray[1];
		console.log(myDate - new Date(time));

		console.log("验证:"+code+","+phone+","+checkCode);

	//	if(!(myDate - new Date(time)<30000 && myDate - new Date(time)>10000)){			
		//	global.name[phone] = undefined;	
		//	res.json({
		//		state: 1,
		//		result: "图型验证码有误,请刷新验证码"
		//	})

		//	console.log("图型验证码有误");
		//	return ;
	//	}

		if(code.toUpperCase() == checkCode.toUpperCase()){
			res.json({
				state: 0,
				result: "验证成功"
			})
			return;
		}
		
		res.json({
			state: 1,
			result: "图型验证码不正确"
		})

	});



	router.post('/checkCode', function(req, res) {

		var phone = req.body.phone;
		var checkCode = req.body.code;

		var data = {
			sPhone: phone,
			sType: "1",
			sCode: checkCode
		};
		var aesString = TYMLock.AESLockFormJSON(AESKEY, data, AESLENGTH); //加密
		//initHttpsReqUrlParams(aesString, "CodeTTDv2", "phonesms", 13240, "192.168.168.69");
		initHttpsReqUrlParams(aesString, "CodeTTDv2", "phonesms", 23240, "120.25.129.101");
		//initHttpsReqUrlParams(aesString, "CodeTTDv2", "phonesms", 23240, "120.76.24.170");
		var httpsReq = http.request(httpsOptions, function(httpsRes) {
			if (httpsRes.statusCode == 200) {
				httpsRes.on('data', function(data) {
					var result = TYMLock.AESUnLockToJson(AESKEY, data.toString(), AESLENGTH); //解密
					res.json({
						state: result.iRet,
						result: result.sMsg
					})
				})
			} else {
				logger.error("请求获取验证码连接异常");
				res.json({
					state: 1,
					result: "请求获取验证码连接异常"
				})
			}
		});
		httpsReq.setTimeout(TIMEOUTSECOND, function() {
			logger.error("请求获取验证码超时");
			httpsReq.abort(); //终止请求
		});
		httpsReq.on("error", function(err) {
			logger.error(err);
			res.json({
				state: 1,
				result: err
			})
		});
		httpsReq.write(aesString);
		httpsReq.end(); //记得要结束请求

		// if(global.name[phone]){
		// 	if(global.name[phone].toLowerCase() == checkCode.toLowerCase()){
		// 		var data = {
		// 			sPhone: phone,
		// 			sType: "1",
		// 			sMsg: ""
		// 		};

		// 	var aesString = TYMLock.AESLockFormJSON(AESKEY, data, AESLENGTH); //加密
		// 	//initHttpsReqUrlParams(aesString, "CodeTTD", "phonesms", 13240, "120.25.129.101");
		// 	initHttpsReqUrlParams(aesString, "CodeTTD", "phonesms", 13240, "192.168.168.158");
		// 	var httpsReq = https.request(httpsOptions, function(httpsRes) {
		// 		if (httpsRes.statusCode == 200) {
		// 			httpsRes.on('data', function(data) {
		// 				var result = TYMLock.AESUnLockToJson(AESKEY, data.toString(), AESLENGTH); //解密
		// 				res.json({
		// 					state: result.iRet,
		// 					result: result.sMsg
		// 				})
		// 			})
		// 		} else {
		// 			logger.error("请求获取验证码连接异常");
		// 			res.json({
		// 				state: 1,
		// 				result: "请求获取验证码连接异常"
		// 			})
		// 		}
		// 	});
		// 	httpsReq.setTimeout(TIMEOUTSECOND, function() {
		// 		logger.error("请求获取验证码超时");
		// 		httpsReq.abort(); //终止请求
		// 	});
		// 	httpsReq.on("error", function(err) {
		// 		logger.error(err);
		// 		res.json({
		// 			state: 1,
		// 			result: err
		// 		})
		// 	});
		// 	httpsReq.write(aesString);
		// 	httpsReq.end(); //记得要结束请求
		// 			//调手机
		// 		}
		// 	}
		// }


		// res.json({
		// 	state: 1,
		// 	result: "请求获取验证码连接异常"
		// })
	});

	// //获取验证码
	// router.post('/getCode', function(req, res) {
	// 	var data = {
	// 		sPhone: req.body.phone,
	// 		sType: "1",
	// 		sMsg: ""
	// 	};

	// 	var aesString = TYMLock.AESLockFormJSON(AESKEY, data, AESLENGTH); //加密
	// 	initHttpsReqUrlParams(aesString, "CodeTTD", "phonesms", 13240, "120.25.129.101");
	// 	var httpsReq = https.request(httpsOptions, function(httpsRes) {
	// 		if (httpsRes.statusCode == 200) {
	// 			httpsRes.on('data', function(data) {
	// 				var result = TYMLock.AESUnLockToJson(AESKEY, data.toString(), AESLENGTH); //解密
	// 				res.json({
	// 					state: result.iRet,
	// 					result: result.sMsg
	// 				})
	// 			})
	// 		} else {
	// 			logger.error("请求获取验证码连接异常");
	// 			res.json({
	// 				state: 1,
	// 				result: "请求获取验证码连接异常"
	// 			})
	// 		}
	// 	});
	// 	httpsReq.setTimeout(TIMEOUTSECOND, function() {
	// 		logger.error("请求获取验证码超时");
	// 		httpsReq.abort(); //终止请求
	// 	});
	// 	httpsReq.on("error", function(err) {
	// 		logger.error(err);
	// 		res.json({
	// 			state: 1,
	// 			result: err
	// 		})
	// 	});
	// 	httpsReq.write(aesString);
	// 	httpsReq.end(); //记得要结束请求
	// })


	//注册接口
	router.post('/register', function(req, res) {
		logger.info(req.body);
		var phone;//手机号
		var userId;//天天兑号
		var password;//密码
		var nickName;//昵称
		var specId;//规格id  砍价专用
		var createBargainSuccess = false;//砍价是否创建成功
		try{
			//aes解密
			var reqData = TYMLock.AESUnLockToJson("#*06#", req.body.sCondition, 4);
			async.series([
				function (callback) {
					//注册
					if(reqData){
						phone = reqData.phone;
						specId = reqData.specId;
						logger.info(reqData);
						var platformID = reqData.platformID;//平台号
						var refuserid = reqData.refuserid;//推荐人id
						if (platformID == null || platformID == "null") {
							platformID = "100012";//默认平台号
						}
						if (refuserid == null || refuserid == "null") {
							refuserid = "";
						}
						var data = {
							sAccount: phone,
							sNickName: '',
							sPassword: reqData.password,
							iSex: 2,
							sProvince: '',
							sCity: '',
							sSignature: '',
							sEmail: '',
							sHeadImage: '',
							iPhoneAuth: 1,
							lPlatformID: platformID,
							lPushManId: refuserid,
							sCode: reqData.code
						};
						logger.info(data);

						var aesString = TYMLock.AESLockFormJSON(AESKEY, data, AESLENGTH); //加密
						initHttpsReqUrlParams(aesString, "AddData", "UserRegister", 13241, "120.76.84.231");
						//initHttpsReqUrlParams(aesString, "AddData", "UserRegister", 13241, "192.168.168.69");
						var httpsReq = https.request(httpsOptions, function(httpsRes) {
							if (httpsRes.statusCode == 200) {
								var datas = "";
								httpsRes.on('data', function(data) {
									datas += data.toString();
								});
								httpsRes.on('end', function() {
									var result = TYMLock.AESUnLockToJson(AESKEY, datas, AESLENGTH); //解密
									logger.info(result);
									var iRet = result.iRet;
									if(iRet == 0){
										var userData = result.entity;
										logger.info(userData);
										userId = userData.lUserId;
										password = userData.sPassword;
										//nickName = userData.sNickName;
										callback(null);
									}else{
										if(result.entity){
											callback({
												state: iRet,
												result: result.sMsg,
												userId: result.entity.lUserId
											})
										}else{
											callback({
												state: iRet,
												result: result.sMsg,
											})
										}
									}
								})
							} else {
								callback({
									state: 1,
									result: "注册接口异常"
								})
							}
						});
						httpsReq.setTimeout(TIMEOUTSECOND, function() {
							logger.error("请求注册超时");
							httpsReq.abort(); //终止请求
						});
						httpsReq.on("error", function(err) {
							callback({
								state: 1,
								result: err
							})
						});
						httpsReq.write(aesString);
						httpsReq.end(); //记得要结束请求
					}else{
						callback({
							state: 1,
							result: "非法请求"
						})
					}
				},
				function (callback) {
					//创建钱包
					logger.info("创建钱包");
					var httpOpt = {
						hostname: 'mepay.tymplus.com',
						port: 80,
						path: '/GetDataInterface/GetBalanceInterfaceNew.aspx?phone='+phone,
						method: 'GET'
					};
					var httpReq = http.request(httpOpt, function(httpRes) {
						if (httpRes.statusCode == 200) {
							httpRes.on('data', function(qbData) {
								logger.info("创建钱包接口返回数据:"+qbData.toString());
								callback(null);
							})
						} else {
							logger.error("请求创建钱包连接异常");
							callback(null);
						}
					});
					httpReq.setTimeout(TIMEOUTSECOND, function() {
						logger.error("请求创建钱包请求超时");
						httpReq.abort(); //终止请求
					});
					httpReq.on("error", function(err) {
						logger.error(err);
						callback(null);
					});
					httpReq.write("");
					httpReq.end(); //记得要结束请求
				},
				function (callback) {
					if(specId){
						var data = {
							appKey: "meizhifu",
							userId: userId,
							userName: "未设置昵称",
							password: password,
						};
						var appkey = "meizhifu";
						var token = TYMLock.AESLockFormJSON(appkey, data, 4); //加密
						var userToken;//商城token
						async.series([
							function (callback2) {
								//创建商城用户
								var options = {
									url: shopServer+"/shop/loginService/userLogin",
									headers: {
										appkey: appkey,
										token: token
									}
								};
								request.get(options, function (error, response, body) {
									logger.debug(body);
									if (!error && response.statusCode == 200) {
										body = JSON.parse(body);
										if (body.state == 0) {
											userToken = body.result;
											callback2(null);
										}else{
											callback2(body.result);
										}
									}else{
										callback(error.toString());
									}
								});
							},
							function (callback2) {
								logger.info(userToken);
								//创建砍价订单
								//支付失败-取消订单
								var options = {
									url: shopServer + "/shop/bargainService/add",
									headers: {
										token: userToken,
										appkey: appkey
									},
									form: {
										spec_id: specId,
									}
								};
								request.post(options, function (error, response, body) {
									logger.info(body);
									if (!error && response.statusCode == 200) {
										body = JSON.parse(body);
										if(body.state == "0"){
											createBargainSuccess = true;
											logger.info("创建砍价订单成功，砍价id"+body.result);
											callback2(null);
										}else{
											callback2(body.result);
										}
									}else{
										callback2(error.toString());
									}
								});
							}
						], function (err, result) {
							if(err){
								logger.error("创建砍价订单失败,规格id"+specId+",用户id"+userId);
								logger.error(err);
							}
							callback(null);
						})
					}else{
						callback(null);
					}
				}
			], function (err, result) {
				if(err){
					logger.error(err);
					res.json(err);
				}else{
					if(createBargainSuccess){
						res.json({
							state: 2,
							result: "注册成功且创建砍价订单成功",
							userId: userId
						})
					}else{
						res.json({
							state: 0,
							result: "注册成功",
							userId: userId
						})
					}
				}
			})
		}catch(err) {
			logger.error(err);
			res.json({
				state: 1,
				result: "非法请求"
			})
		}
	})
	//注册接口
	//router.post('/register', function(req, res) {
	//	console.log(req.body);
	//	try{
	//
	//
	//		//aes解密
	//		var reqData = TYMLock.AESUnLockToJson("#*06#", req.body.sCondition, 4);
	//		if(reqData){
	//			var phone = reqData.phone;
	//			logger.info(reqData);
	//			var platformID = reqData.platformID;//平台号
	//			var refuserid = reqData.refuserid;//推荐人id
	//			if (platformID == null || platformID == "null") {
	//				platformID = "100012";//默认平台号
	//			}
	//			if (refuserid == null || refuserid == "null") {
	//				refuserid = "";
	//			}
	//			var data = {
	//				sAccount: phone,
	//				sNickName: '未设置昵称',
	//				sPassword: reqData.password,
	//				iSex: 2,
	//				sProvince: '',
	//				sCity: '',
	//				sSignature: '',
	//				sEmail: '',
	//				sHeadImage: '',
	//				iPhoneAuth: 1,
	//				lPlatformID: platformID,
	//				lPushManId: refuserid,
	//				sCode: reqData.code
	//			};
	//			logger.info(data);
    //
	//			var aesString = TYMLock.AESLockFormJSON(AESKEY, data, AESLENGTH); //加密
	//			initHttpsReqUrlParams(aesString, "AddData", "UserRegister", 13241, "120.76.84.231");
	//			var httpsReq = https.request(httpsOptions, function(httpsRes) {
	//				if (httpsRes.statusCode == 200) {
	//					var datas = "";
	//					httpsRes.on('data', function(data) {
	//						datas += data.toString();
	//					});
	//					httpsRes.on('end', function() {
	//						var result = TYMLock.AESUnLockToJson(AESKEY, datas, AESLENGTH); //解密
	//						logger.info(result);
	//						var iRet = result.iRet;
    //
	//						if(iRet == 0){
	//							logger.info("创建钱包");
	//							var httpOpt = {
	//								hostname: 'mepay.tymplus.com',
	//								port: 80,
	//								path: '/GetDataInterface/GetBalanceInterfaceNew.aspx?phone='+phone,
	//								method: 'GET'
	//							};
	//							var httpReq = http.request(httpOpt, function(httpRes) {
	//								if (httpRes.statusCode == 200) {
	//									httpRes.on('data', function(qbData) {
	//										logger.info("创建钱包接口返回数据:"+qbData.toString());
	//										res.json({
	//											state: iRet,
	//											result: result.sMsg
	//										})
	//									})
	//								} else {
	//									logger.error("请求创建钱包连接异常");
	//									res.json({
	//										state: iRet,
	//										result: result.sMsg
	//									})
	//								}
	//							});
	//							httpReq.setTimeout(TIMEOUTSECOND, function() {
	//								logger.error("请求创建钱包请求超时");
	//								httpReq.abort(); //终止请求
	//							});
	//							httpReq.on("error", function(err) {
	//								logger.error(err);
	//								res.json({
	//									state: iRet,
	//									result: result.sMsg
	//								})
	//							});
	//							httpReq.write("");
	//							httpReq.end(); //记得要结束请求
	//						}else{
	//							res.json({
	//								state: iRet,
	//								result: result.sMsg
	//							})
	//						}
	//					})
	//				} else {
	//					logger.error("注册接口异常");
	//					res.json({
	//						state: 1,
	//						result: "注册接口异常"
	//					})
	//				}
	//			});
	//			httpsReq.setTimeout(TIMEOUTSECOND, function() {
	//				logger.error("请求注册超时");
	//				httpsReq.abort(); //终止请求
	//			});
	//			httpsReq.on("error", function(err) {
	//				logger.error(err);
	//				res.json({
	//					state: 1,
	//					result: err
	//				})
	//			});
	//			httpsReq.write(aesString);
	//			httpsReq.end(); //记得要结束请求
	//		}else{
	//			res.json({
	//				state: 1,
	//				result: "非法请求"
	//			})
	//		}
	//	}catch(err) {
	//		logger.error(err);
	//		res.json({
	//			state: 1,
	//			result: "非法请求"
	//		})
	//	}
	//})

	//短信注册接口
	router.post('/registerByCode', function(req, res) {
		logger.info(req.body);
		try{
			//aes解密
			var reqData = TYMLock.AESUnLockToJson("#*06#", req.body.sCondition, 4);
			if(reqData){
				var phone = reqData.phone;
				logger.info(reqData);
				var platformID = reqData.platformID;//平台号
				var refuserid = reqData.refuserid;//推荐人id
				var data = {
					sAccount: phone,
					sCode: reqData.code,
					bLogin: false
				};
				if(platformID && refuserid){
					data.lPlatformID = platformID;
					data.lPushManId = refuserid;
				}
				logger.info(data);
				var aesString = TYMLock.AESLockFormJSON(AESKEY, data, AESLENGTH); //加密
				initHttpsReqUrlParams(aesString, "LoginByCode", "UserData", 13241, "120.76.84.231");//外网
				//initHttpsReqUrlParams(aesString, "LoginByCode", "UserData", 13241, "192.168.168.158");//内网
				var httpsReq = https.request(httpsOptions, function(httpsRes) {
					if (httpsRes.statusCode == 200) {
						var datas = "";
						httpsRes.on('data', function(data) {
							datas += data.toString();
						});
						httpsRes.on('end', function() {
							var result = TYMLock.AESUnLockToJson(AESKEY, datas, AESLENGTH); //解密
							logger.info(result);
							var iRet = result.iRet;

							if(iRet == 0){
								logger.info("创建钱包");
								var httpOpt = {
									hostname: 'mepay.tymplus.com',
									port: 80,
									path: '/GetDataInterface/GetBalanceInterfaceNew.aspx?phone='+phone,
									method: 'GET'
								};
								var httpReq = http.request(httpOpt, function(httpRes) {
									if (httpRes.statusCode == 200) {
										httpRes.on('data', function(qbData) {
											logger.info("创建钱包接口返回数据:"+qbData.toString());
											res.json({
												state: iRet,
												result: result.sMsg
											})
										})
									} else {
										logger.error("请求创建钱包连接异常");
										res.json({
											state: iRet,
											result: result.sMsg
										})
									}
								});
								httpReq.setTimeout(TIMEOUTSECOND, function() {
									logger.error("请求创建钱包请求超时");
									httpReq.abort(); //终止请求
								});
								httpReq.on("error", function(err) {
									logger.error(err);
									res.json({
										state: iRet,
										result: result.sMsg
									})
								});
								httpReq.write("");
								httpReq.end(); //记得要结束请求
							}else{
								res.json({
									state: iRet,
									result: result.sMsg
								})
							}
						})
					} else {
						logger.error("注册接口异常");
						res.json({
							state: 1,
							result: "注册接口异常"
						})
					}
				});
				httpsReq.setTimeout(TIMEOUTSECOND, function() {
					logger.error("请求注册超时");
					httpsReq.abort(); //终止请求
				});
				httpsReq.on("error", function(err) {
					logger.error(err);
					res.json({
						state: 1,
						result: err
					})
				});
				httpsReq.write(aesString);
				httpsReq.end(); //记得要结束请求
			}else{
				res.json({
					state: 1,
					result: "非法请求"
				})
			}
		}catch(err) {
			logger.error(err);
			res.json({
				state: 1,
				result: "非法请求"
			})
		}
	})

	module.exports = router;
