// 服务器模块
const express = require("express");
const cp = require("child_process"); // 可自动打开浏览器模块

const app = express();

// 引用静态资源路径
app.use(express.static("public"));
// 引入模板引擎，设置模板引擎加载资源的后缀名
app.engine("html", require("express-art-template"));

// 导入外置路由
var router = require("./routes/router");
// 引用外置路由
app.use(router);

app.listen(3000, function () {
  console.log("服务器启动成功，请访问：http://127.0.0.1:3000/first_get");
  cp.exec("start http://localhost:3000/first_get");
});

