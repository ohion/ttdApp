var express = require('express');
var ccap = require('ccap')();

var router = express.Router();

//判断app是否已关闭
router.use('/checkAppIsOff', function(req, res) {
	res.json({status:1});
});

//重定向到下载链接
router.get('/download', function(req, res) {
	res.redirect('http://tiyoumeapp.oss-cn-shenzhen.aliyuncs.com/TianTianDui.apk');
});





module.exports = router;
