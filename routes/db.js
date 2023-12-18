// 数据库模块

var mysql = require("mysql");
// 连接数据库
var connection = mysql.createConnection({
  host: "localhost", //主机名
  user: "root", //用户名
  password: "root", //密码
  port: "3306", //响应端口
  database: "student_score", //数据库名
  multipleStatements: true, //允许每个mysql语句有多条查询.
});
//打开连接
connection.connect();

// 导出数据库操作方法
module.exports = {
  wh: undefined,
  where: function (wh) {
    this.wh = wh;
    return this;
  },
  // 查询数据库
  select: function (callback) {
    if (this.wh == undefined) {
      console.log("查询全部数据");
      var sql = "select * from score";
    } else {
      console.log("查询单个数据");
      var sql = "select * from score where " + this.wh;
    }
    connection.query(sql, function (err, result) {
      // 异常处理
      if (err) {
        console.log("存在的错误： ", err.message);
        return;
      }
      // console.log(result);
      // 调用回调函数，将数据当做实参进行函数回调
      callback(result);
      // connection.end();
    });
    // 重置wh不影响下一次操作
    this.wh = undefined;
  },
  // 删除数据库
  delete: function (callback) {
    if (this.wh == undefined) {
      console.log("没有可删除数据！");
      return;
    } else {
      console.log("删除" + this.wh + "成功！");
      var sql = "delete from score where " + this.wh;
    }
    connection.query(sql, function (err, result) {
      // 异常处理
      if (err) {
        console.log("存在的错误： ", err.message);
        return;
      }
      console.log(result);
      // 调用回调函数，将数据当做实参进行函数回调
      callback(result.affectedRows);
      // connection.end();
    });
    // 重置wh不影响下一次操作
    this.wh = undefined;
  },
  delete_post: function (data, callback) {
    var sql = "delete from score where id=" + data.id;
    var sql_id = "select * from score where id=" + data.id;
    connection.query(sql_id, function (err, result, filed) {
      if (err) {
        console.log("存在的错误： ", err.message);
        return;
      }
      // 用户不存在则反馈信息
      else if (result.length == 0) {
        callback(0); //返回参数0
        // 用户存在执行删除
      } else if (result.length == 1) {
        connection.query(sql, function (err, result) {
          // 异常处理
          if (err) {
            console.log("存在的错误： ", err.message);
            return;
          }
          console.log(result);
          // 调用回调函数，将数据当做实参进行函数回调
          callback(1); //返回参数1
          // connection.end();
        });
        console.log("删除成功！");
      }
    });
  },
  //改数据库
  update: function (data, callback) {
    if (this.wh == undefined) {
      console.log("没有可修改数据！");
      return;
    } else {
      var str = "";
      for (i in data) {
        str += i + "='" + data[i] + "',";
      }
      // console.log('对象：\n',data.name);
      // var data_key = Object.keys(data)
      // var data_value=Object.values(data)
      // console.log('keys:\n', data_key);
      // console.log('values\n', data_value[1]);
      //截取字符串(不用最后一个字符：，)
      str = str.slice(0, str.length - 1);
      var sql = "update score set " + str + " where " + this.wh;
      console.log(sql);
    }
    connection.query(sql, function (err, result) {
      // 异常处理
      if (err) {
        console.log("存在的错误： ", err.message);
        return;
      }
      console.log(result);
      // 调用回调函数，将数据当做实参进行函数回调
      callback(result.changedRows);
      // connection.end();
    });
    this.wh = undefined;
  },
  //精确查询
  finduser: function (data, callback) {
    //截取字符串(不用最后一个字符：，)
    // str = str.slice(0, str.length - 1);
    var sql = "select * from score where id=" + data.id;
    console.log(sql);
    console.log("查询的id:", data.id);
    // console.log(sql_id);
    connection.query(sql, function (err, result, filed) {
      if (err) {
        console.log("存在的错误： ", err.message);
        return;
      }
      // 用户不存在
      else if (result.length == 0) {
        callback(result);
        console.log("用户不存在，无法查找！");
        // 用户存在
      } else if (result.length == 1) {
        callback(result);
        console.log("用户存在，数据已返回:", result);
      }
    });
  },
  //增加数据至score数据库
  adduser: function (data, callback) {
    // var str = [];
    // for (i in data) {
    //     if (i == 'id') {
    //         Id = data[i];
    //     }
    //     str += "'" + data[i] + "',";
    // }
    var data_key = Object.keys(data); //提取返回对象data的key值
    var data_value = Object.values(data); //提取返回对象data的value值
    //截取字符串(不用最后一个字符：，)
    // str = str.slice(0, str.length - 1);
    // var sql = "insert into score(id,name,machine_learning,nodejs," +
    //     "microservice,rstudio,system_safety) values(" + str + ")";
    // var sql = "insert into score(" + data_key + ") values(" + str + ")";
    var sql = "insert into score(" + data_key + ") values(?,?,?,?,?,?,?,?)";
    console.log(sql);
    console.log("添加的id：", data.id);
    var sql_id = "select * from score where id=" + data.id;
    connection.query(sql_id, function (err, result, filed) {
      if (err) {
        console.log("存在的错误： ", err.message);
        return;
      }
      // 用户不存在
      else if (result.length == 0) {
        connection.query(sql, data_value, function (err, result) {
          // 异常处理
          if (err) {
            console.log("存在的错误： ", err.message);
            return;
          }
          console.log(result);
          // 调用回调函数，将数据当做实参进行函数回调
          callback(result.changedRows);
          // connection.end();
        });
        // 用户已存在
      } else if (result.length == 1) {
        callback(result.length);
        console.log("用户已存在，无法添加！");
        // return;
      }
    });
  },

  //添加数据至login数据库
  regUser: function (data, callback) {
    // var str = [];
    // for (i in data) {
    //     if (i == 'id') {
    //         Id = data[i];
    //     }
    //     str += "'" + data[i] + "',";
    // }
    var data_key = Object.keys(data); //提取返回对象data的key值
    var data_value = Object.values(data); //提取返回对象data的value值
    //截取字符串(不用最后一个字符：，)
    // str = str.slice(0, str.length - 1);
    // var sql = "insert into login(id,name,machine_learning,nodejs," +
    //     "microservice,rstudio,system_safety) values(" + str + ")";
    // var sql = "insert into login(" + data_key + ") values(" + str + ")";
    var sql = "insert into login (" + data_key + ") values (?,?,?)";
    console.log(sql);
    console.log("添加的id：", data.id);
    var sql_id = "select * from login where id=" + data.id;
    connection.query(sql_id, function (err, result, filed) {
      if (err) {
        console.log("存在的错误： ", err.message);
        return;
      }
      // 用户不存在
      else if (result.length == 0) {
        connection.query(sql, data_value, function (err, result) {
          // 异常处理
          if (err) {
            console.log("存在的错误： ", err.message);
            return;
          }
          console.log(result);
          // 调用回调函数，将数据当做实参进行函数回调
          callback(result.changedRows);
          // connection.end();
        });
        // 用户已存在
      } else if (result.length == 1) {
        callback(result.length);
        console.log("用户已存在，无法添加！");
        // return;
      }
    });
  },
  regUser2: function (data, callback) {
    // var str = [];
    // for (i in data) {
    //     if (i == 'id') {
    //         Id = data[i];
    //     }
    //     str += "'" + data[i] + "',";
    // }
    var data_key = Object.keys(data); //提取返回对象data的key值
    var data_value = Object.values(data); //提取返回对象data的value值
    //截取字符串(不用最后一个字符：，)
    // str = str.slice(0, str.length - 1);
    // var sql = "insert into employeelogin(id,name,machine_learning,nodejs," +
    //     "microservice,rstudio,system_safety) values(" + str + ")";
    // var sql = "insert into employeelogin(" + data_key + ") values(" + str + ")";
    var sql = "insert into employeelogin (" + data_key + ") values (?,?,?)";
    console.log(sql);
    console.log("添加的id：", data.id);
    var sql_id = "select * from employeelogin where id=" + data.id;
    connection.query(sql_id, function (err, result, filed) {
      if (err) {
        console.log("存在的错误： ", err.message);
        return;
      }
      // 用户不存在
      else if (result.length == 0) {
        connection.query(sql, data_value, function (err, result) {
          // 异常处理
          if (err) {
            console.log("存在的错误： ", err.message);
            return;
          }
          console.log(result);
          // 调用回调函数，将数据当做实参进行函数回调
          callback(result.changedRows);
          // connection.end();
        });
        // 用户已存在
      } else if (result.length == 1) {
        callback(result.length);
        console.log("用户已存在，无法添加！");
        // return;
      }
    });
  },
  login: function (data, callback) {
    // var str = [];
    // for (i in data) {
    //     if (i == 'id') {
    //         Id = data[i];
    //     }
    //     str += "'" + data[i] + "',";
    // }
    var data_key = Object.keys(data); //提取返回对象data的key值
    var data_value = Object.values(data); //提取返回对象data的value值
    //截取字符串(不用最后一个字符：，)
    // str = str.slice(0, str.length - 1);
    // var sql = "insert into login(id,name,machine_learning,nodejs," +
    //     "microservice,rstudio,system_safety) values(" + str + ")";
    // var sql = "insert into login(" + data_key + ") values(" + str + ")";
    var sql = "select password from login where id=" + data.id;
    console.log(sql);
    console.log("添加的id：", data.id);
    var sql_id = "select * from login where id=" + data.id;
    connection.query(sql_id, function (err, result, filed) {
      connection.query(sql, data_value, function (err, result) {
        // 异常处理
        if (err) {
          console.log("存在的错误： ", err.message);
          return;
        } if (!result[0]) {
          callback("no");
          console.log('no'); //不存在
          return
        } else {
          if (result[0].password === data.password) {
            callback("yes");
            console.log('yes');
          } else {
            callback("no")
            console.log('no');
          }
        }

        console.log(result);
        // 调用回调函数，将数据当做实参进行函数回调
        //callback(result.changedRows);
        // connection.end();
      });
    });
  },
  login2: function (data, callback) {
    // var str = [];
    // for (i in data) {
    //     if (i == 'id') {
    //         Id = data[i];
    //     }
    //     str += "'" + data[i] + "',";
    // }
    var data_key = Object.keys(data); //提取返回对象data的key值
    var data_value = Object.values(data); //提取返回对象data的value值
    //截取字符串(不用最后一个字符：，)
    // str = str.slice(0, str.length - 1);
    // var sql = "insert into employeelogin(id,name,machine_learning,nodejs," +
    //     "microservice,rstudio,system_safety) values(" + str + ")";
    // var sql = "insert into employeelogin(" + data_key + ") values(" + str + ")";
    var sql = "select password from employeelogin where id=" + data.id;
    console.log(sql);
    //console.log("添加的id：", data.id);
    var sql_id = "select * from employeelogin where id=" + data.id;
    connection.query(sql_id, function (err, result, filed) {
      connection.query(sql, data_value, function (err, result) {
        // 异常处理
        if (err) {
          console.log("存在的错误： ", err.message);
          return;
        } if (!result[0]) {
          callback({
            status: 'no',
          });
          console.log('no'); //不存在
          return
        } else {
          if (result[0].password === data.password) {
            callback({
              status: 'yes',
              id: data.id
            });
          } else {
            callback({
              status: 'no',
            });
            console.log('no');
          }
        }

        console.log(result);
        // 调用回调函数，将数据当做实参进行函数回调
        //callback(result.changedRows);
        // connection.end();
      });
    });
  },

// 查询数据库
select2: function (callback) {
  if (this.wh == undefined) {
    console.log("查询全部数据");
    var sql = "select * from commodity";
  } else {
    console.log("查询单个数据222");
    var sql = "select * from commodity where " + this.wh;
  }
  connection.query(sql, function (err, result) {
    // 异常处理
    if (err) {
      console.log("存在的错误： ", err.message);
      return;
    }
    // console.log(result);
    // 调用回调函数，将数据当做实参进行函数回调
    callback(result);
    // connection.end();
  });
  // 重置wh不影响下一次操作
  this.wh = undefined;
},
// 删除数据库
delete2: function (callback) {
  if (this.wh == undefined) {
    console.log("没有可删除数据！");
    return;
  } else {
    console.log("删除" + this.wh + "成功！");
    var sql = "delete from commodity where " + this.wh;
  }
  connection.query(sql, function (err, result) {
    // 异常处理
    if (err) {
      console.log("存在的错误： ", err.message);
      return;
    }
    console.log(result);
    // 调用回调函数，将数据当做实参进行函数回调
    callback(result.affectedRows);
    // connection.end();
  });
  // 重置wh不影响下一次操作
  this.wh = undefined;
},
delete2_post: function (data, callback) {
  var sql = "delete from commodity where id=" + data.id;
  var sql_id = "select * from commodity where id=" + data.id;
  connection.query(sql_id, function (err, result, filed) {
    if (err) {
      console.log("存在的错误： ", err.message);
      return;
    }
    // 用户不存在则反馈信息
    else if (result.length == 0) {
      callback(0); //返回参数0
      // 用户存在执行删除
    } else if (result.length == 1) {
      connection.query(sql, function (err, result) {
        // 异常处理
        if (err) {
          console.log("存在的错误： ", err.message);
          return;
        }
        console.log(result);
        // 调用回调函数，将数据当做实参进行函数回调
        callback(1); //返回参数1
        // connection.end();
      });
      console.log("删除成功！");
    }
  });
},
//改数据库
update2: function (data, callback) {
  if (this.wh == undefined) {
    console.log("没有可修改数据！");
    return;
  } else {
    var str = "";
    for (i in data) {
      str += i + "='" + data[i] + "',";
    }
    // console.log('对象：\n',data.name);
    // var data_key = Object.keys(data)
    // var data_value=Object.values(data)
    // console.log('keys:\n', data_key);
    // console.log('values\n', data_value[1]);
    //截取字符串(不用最后一个字符：，)
    str = str.slice(0, str.length - 1);
    var sql = "update commodity set " + str + " where " + this.wh;
    console.log(sql);
  }
  connection.query(sql, function (err, result) {
    // 异常处理
    if (err) {
      console.log("存在的错误： ", err.message);
      return;
    }
    console.log(result);
    // 调用回调函数，将数据当做实参进行函数回调
    callback(result.changedRows);
    // connection.end();
  });
  this.wh = undefined;
},
 
//增加数据至commodity数据库
adduser2: function (data, callback) {
  // var str = [];
  // for (i in data) {
  //     if (i == 'id') {
  //         Id = data[i];
  //     }
  //     str += "'" + data[i] + "',";
  // }
  var data_key = Object.keys(data); //提取返回对象data的key值
  var data_value = Object.values(data); //提取返回对象data的value值
  var sql = "insert into commodity(id,name,quantity,time,price,sells) values(?,?,?,?,?,?)";
  console.log(sql);
  console.log("添加的id：", data.id);
  var sql_id = "select * from commodity where id=" + data.id;
  connection.query(sql_id, function (err, result, filed) {
    if (err) {
      console.log("存在的错误： ", err.message);
      return;
    }
    // 用户不存在
    else if (result.length == 0) {
      connection.query(sql, data_value, function (err, result) {
        // 异常处理
        if (err) {
          console.log("存在的错误： ", err.message);
          return;
        }
        console.log(result);
        // 调用回调函数，将数据当做实参进行函数回调
        callback(result.changedRows);
        // connection.end();
      });
      // 用户已存在
    } else if (result.length == 1) {
      callback(result.length);
      console.log("用户已存在，无法添加！");
      // return;
    }
  });
},


};

//关闭连接
// connection.end();
