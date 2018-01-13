const cluster = require('cluster');
var express = require('express');
var session = require('express-session');
var app = express();
global.name = {};

const numCPUs = require('os').cpus().length;

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

//设置会话
// 按照上面的解释，设置 session 的可选参数
// app.use(session({
//   secret: 'keyboard cat',
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: true }
// }))

//获取区域文件设置跨域访问
app.use(function(req, res, next) {
  

  if(req.path == '/appbs/staicdata/china.json'){
    res.header("Access-Control-Allow-Origin", "*"); //所有可访问
    res.header("Access-Control-Allow-Headers", "token, appkey"); //header对象允许带的参数
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  }
  next();
});

var userService = require('./service/user/userService.js') //引入模块
var newUserService = require('./service/user/newUserService.js') //引入模块
var appService = require('./service/app/appService.js') //引入模块

//影射某文夹出去，记别人能方问
app.use('/appbs', express.static('view'));
app.use('/appbs/UserService',userService);//加载模块
app.use('/appbs/newUserService',newUserService);//加载模块
app.use('/appbs/AppService',appService);//加载模块

//没有找到页面
app.use(function(req, res, next) {
  res.status(404).send({'state':'404','result':'没有找到相应的服务或页面'});
});

//操作错误，记录日志
app.use(function(err, req, res, next) {
  res.status(500).send({'state':'505','result':'操作错误'+err.stack});
});

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < 1; i++) {
    cluster.fork();
  }
  cluster.on('listening', function(worker, address) {
    console.log('listening: worker ' + worker.process.pid + ', Address: ' + address.address + ":" + address.port);
  });

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker' + worker.process.pid + 'died');
  });
} else {
  app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});
}
