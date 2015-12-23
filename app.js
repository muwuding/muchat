// 导入相应模块
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// 引入路由
var routes = require('./routes/index');
var users = require('./routes/users');

// 创建express应用
var app = express();

// 设置视图
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// 如果有favicon.ico，放开下面的设置
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// 设置静态目录
app.use(express.static(path.join(__dirname, 'public')));

// 路由控制
app.use('/', routes);
app.use('/users', users);

// 设置404错误
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 错误处理
// 开发错误处理
// 打印加亮
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// 生产版本错误处理
// 不加亮泄露给用户
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;