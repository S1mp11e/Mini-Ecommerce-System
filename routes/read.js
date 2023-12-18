// 业务模块

// 加载引入db模块，获取数据库数据
var db = require('./db');
var url = require('url');
var formidable = require('formidable');
var fs = require('fs');
// temp.defaults.root = './'; //当前目录的路径下
// 导出方法
module.exports = {
    //查询所有员工数据
    getAll: function (req, res) {
        db.select(function (data) {
            res.render('./index.html', {
                data: data
            });
        });

    },
    //查询单个员工数据
    getOne: function (req, res) {
        var urls = url.parse(req.url, true);
        console.log(urls.query.id);

        db.where('id=' + urls.query.id).select(function (data) {
            // console.log(data);
            // var html_data1 = temp('./views/user.html', {
            //     data: data
            // });
            // response.end(html_data1);
            res.render('./user.html', {
                data: data
            });

        });
    },
    getFind: function (req, res) {
        res.render('./finduser.html', {
            data: 123
        });
    },
    //精确查询某个员工查询
    postFind: function (req, res) {
        var urls = url.parse(req.url, true);
        var form = new formidable.IncomingForm();
        // 解决alert乱码
        res.setHeader('Content-Type', 'text/html;charset=utf-8');
        // 通过回调函数的形式将文件上传后的路径等信息及表单数据返回
        form.parse(req, (err, fields, files) => {
            db.finduser(fields, (data) => {
                // 判断数据库返回的信息，给客户端返回数据
                if (data.length == 1) {
                    res.render('./user.html', {
                        data: data
                    });
                    // res.end();
                } else if (data.length == 0) {
                    var backstr = "<script>alert('该用户不存在：请重新查找！');window.location.href='/'</script>";
                    res.end(backstr);
                }
            })
        })
    },
    //把将要修改的用户信息传到update.html上
    update_get: function (req, res) {
        var urls = url.parse(req.url, true);
        console.log("id:", urls.query.id);
        db.where('id=' + urls.query.id).select(function (data) {
            res.render('./update.html', {
                data: data
            });
        });
    },
    // 修改用户信息
    update_post(req, res) {
        var urls = url.parse(req.url, true);
        // 获取form-data对象，用于文件上传以及表单数据解析
        var form = new formidable.IncomingForm();
        // 解决alert乱码
        res.setHeader('Content-Type', 'text/html;charset=utf-8');
        // 设置上传路径
        // var file_path = form.uploadDir = './public/img/image/';
        // 通过回调函数的形式将文件上传后的路径等信息及表单数据返回
        form.parse(req, (err, fields, files) => {
            // 设置上传路径，以及重命名
            // var image_path = file_path + files.images.name;
            // // 设置写入数据库的文件路径
            // var file_path01 = '/img/image/' + files.images.name;
            // // console.log(file_path);
            // // 将上传后的文件移动到指定路径目录下
            // fs.rename(files.images.path, image_path, (err) => {
            // // 将文件写入对象中
            // fields.img = file_path01;
            // console.log(fields);
            // 连接数据库，将组装好的数据写入数据库
            db.where('id=' + urls.query.id).update(fields, (data) => {
                // 判断数据库返回的信息，给客户端返回数据
                if (data == 1) {
                    var backstr = "<script>alert('修改成功！');window.location.href='/'</script>";
                    res.end(backstr);
                } else {
                    var backstr = "<script>alert('修改失败：跟原数据一样！');window.location.href='/'</script>";
                    res.end(backstr);
                }
            })
            // })
        })
    },
    //打开添加用户界面
    adduser_get: function (req, res) {

        res.render('./adduser.html', {
            data: 123
        });
    },
    adduser_post(req, res) {
        // 获取form-data对象，用于文件上传以及表单数据解析
        var form = new formidable.IncomingForm();
        // 解决alert乱码
        res.setHeader('Content-Type', 'text/html;charset=utf-8');
        // 设置上传路径
        // var file_path = form.uploadDir = './public/img/image/';
        // 通过回调函数的形式将文件上传后的路径等信息及表单数据返回
        form.parse(req, (err, fields, files) => {
            // 设置上传路径，以及重命名
            // var image_path = file_path + files.images.name;
            // 设置写入数据库的文件路径
            // var file_path01 = '/img/image/' + files.images.name;
            // console.log(file_path);
            // 将上传后的文件移动到指定路径目录下
            // fs.rename(files.images.path, image_path, (err) => {
            console.log(fields);
            console.log(files);
            console.log(err);
            // // 将文件写入对象中
            // fields.img = file_path01;
            // console.log(fields);
            // 连接数据库，将组装好的数据写入数据库
            db.adduser(fields, (data) => {
                // 判断数据库返回的信息，给客户端返回数据
                if (data == 0) {
                    var backstr = "<script>alert('添加成功！');window.location.href='/'</script>";
                    res.end(backstr);
                } else if (data == 1) {
                    var backstr = "<script>alert('添加失败：用户已存在！');window.location.href='/adduser_get'</script>";
                    res.end(backstr);
                }
            })
            // })
        })
    },
    //打开删除界面
    delUser: function (req, res) {
        res.render('./deluser.html', {
            data: 123
        });
    },
    delUser_post: function (req, res) {
        var urls = url.parse(req.url, true);
        var form = new formidable.IncomingForm();
        // 解决alert乱码
        res.setHeader('Content-Type', 'text/html;charset=utf-8');
        // 通过回调函数的形式将文件上传后的路径等信息及表单数据返回
        form.parse(req, (err, fields, files) => {
            db.delete_post(fields, (data) => {
                // 判断数据库返回的信息，给客户端返回数据
                if (data == 0) {
                    var backstr = "<script>alert('删除失败：用户不存在！');window.location.href='/'</script>";
                    res.end(backstr);
                } else if (data == 1) {
                    var backstr = "<script>alert('删除成功！');window.location.href='/del_get'</script>";
                    res.end(backstr);
                }
            })
        })
    },
    //删除用户信息
    delOne: function (req, res) {
        var urls = url.parse(req.url, true);
        db.where('id=' + urls.query.id).delete(function (data) {
            // response.end(data.toString());
            if (data == 1) {
                res.setHeader('Content-Type', 'text/html;charset=utf-8');
                var backstr = "<script>alert('删除成功！');window.location.href='/'</script>";
                res.end(backstr);
            }

        });
    },

    //打开注册管理员界面
    reguser_get: function (req, res) {

        res.render('./reguser.html', {
            data: 123
        });
    },
 //注册新管理员用户
    reguser_post(req, res) {
        // 获取form-data对象，用于文件上传以及表单数据解析
        var form = new formidable.IncomingForm();
        // 解决alert乱码
        res.setHeader('Content-Type', 'text/html;charset=utf-8');
        // 设置上传路径
        // var file_path = form.uploadDir = './public/img/image/';
        // 通过回调函数的形式将文件上传后的路径等信息及表单数据返回
        form.parse(req, (err, fields, files) => {
            // 设置上传路径，以及重命名
            // var image_path = file_path + files.images.name;
            // 设置写入数据库的文件路径
            // var file_path01 = '/img/image/' + files.images.name;
            // console.log(file_path);
            // 将上传后的文件移动到指定路径目录下
            // fs.rename(files.images.path, image_path, (err) => {
            console.log(fields);
            console.log(files);
            console.log(err);
            // // 将文件写入对象中
            // fields.img = file_path01;
            // console.log(fields);
            // 连接数据库，将组装好的数据写入数据库
            db.regUser(fields, (data) => {
                // 判断数据库返回的信息，给客户端返回数据
                if (data == 0) {
                    var backstr = "<script>alert('添加成功！');window.location.href='/login_get'</script>";
                    res.end(backstr);
                } else if (data == 1) {
                    var backstr = "<script>alert('添加失败：用户已存在！');window.location.href='reguser_get'</script>";
                    res.end(backstr);
                }
            })
            // })
        })
    },
    //打开登录管理员界面
    login_get: function (req, res) {

        res.render('./login.html', {
            data: 123
        });
    },
    //登录管理员
    login_post(req, res) {
        // 获取form-data对象，用于文件上传以及表单数据解析
        var form = new formidable.IncomingForm();
        // 解决alert乱码
        res.setHeader('Content-Type', 'text/html;charset=utf-8');
        form.parse(req, (err, fields, files) => {
            console.log(fields);
            console.log(files);
            console.log(err);
            db.login(fields, (data) => {
                if (data === "yes") {
                    var backstr = "<script>alert('成功！');window.location.href='/'</script>";
                    res.end(backstr);
                } else {
                    var backstr = "<script>alert('登录失败！请检查账户名和密码');window.location.href='/login_get'</script>";
                    res.end(backstr);
                }
            })
            // })
        })
    },
//打开注册员工界面
   reguser2_get: function (req, res) {

    res.render('./reguser2.html', {
        data: 123
    });
},
 //注册新员工用户
 reguser2_post(req, res) {
    // 获取form-data对象，用于文件上传以及表单数据解析
    var form = new formidable.IncomingForm();
    // 解决alert乱码
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    // 设置上传路径
    // var file_path = form.uploadDir = './public/img/image/';
    // 通过回调函数的形式将文件上传后的路径等信息及表单数据返回
    form.parse(req, (err, fields, files) => {
        // 设置上传路径，以及重命名
        // var image_path = file_path + files.images.name;
        // 设置写入数据库的文件路径
        // var file_path01 = '/img/image/' + files.images.name;
        // console.log(file_path);
        // 将上传后的文件移动到指定路径目录下
        // fs.rename(files.images.path, image_path, (err) => {
        console.log(fields);
        console.log(files);
        console.log(err);
        // // 将文件写入对象中
        // fields.img = file_path01;
        // console.log(fields);
        // 连接数据库，将组装好的数据写入数据库
        db.regUser2(fields, (data) => {
            // 判断数据库返回的信息，给客户端返回数据
            if (data == 0) {
                var backstr = "<script>alert('添加成功！');window.location.href='/login2_get'</script>";
                res.end(backstr);
            } else if (data == 1) {
                var backstr = "<script>alert('添加失败：用户已存在！');window.location.href='reguser2_get'</script>";
                res.end(backstr);
            }
        })
        // })
    })
},
 //打开登录员工界面
 login2_get: function (req, res) {

    res.render('./login2.html', {
        data: 123
    });
},
//登录员工
login2_post(req, res) {
    // 获取form-data对象，用于文件上传以及表单数据解析
    var form = new formidable.IncomingForm();
    // 解决alert乱码
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    form.parse(req, (err, fields, files) => {
        console.log(fields);
        console.log(files);
        console.log(err);
        db.login2(fields, (data) => {
            console.log(data);
            if (data.status === "yes") {
                var backstr = "<script>alert('成功！');window.location.href='/getone?id="+Number(data.id)+"'</script>";
                res.end(backstr);
            } else {
                var backstr = "<script>alert('登录失败！请检查账户名和密码');window.location.href='/login2_get'</script>";
                res.end(backstr);
            }
        })
        // })
    })
},
first_get: function (req, res) {

    res.render('./first.html', {
        data: 123
    });
},


commodity_get: function (req, res) {
    db.select2(function (data) {
        res.render('./commodity.html', {
            data: data
        });
    });

},




//把将要修改的用户信息传到update.html上
updatecommodity_get: function (req, res) {
    var urls = url.parse(req.url, true);
    console.log("id:", urls.query.id);
    db.where('id=' + urls.query.id).select2(function (data) {
        res.render('./updatecommodity.html', {
            data: data
        });
    });
},
// 修改用户信息
updatecommodity_post(req, res) {
    var urls = url.parse(req.url, true);
    // 获取form-data对象，用于文件上传以及表单数据解析
    var form = new formidable.IncomingForm();
    // 解决alert乱码
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    // 设置上传路径
    // var file_path = form.uploadDir = './public/img/image/';
    // 通过回调函数的形式将文件上传后的路径等信息及表单数据返回
    form.parse(req, (err, fields, files) => {
        // 设置上传路径，以及重命名
        // var image_path = file_path + files.images.name;
        // // 设置写入数据库的文件路径
        // var file_path01 = '/img/image/' + files.images.name;
        // // console.log(file_path);
        // // 将上传后的文件移动到指定路径目录下
        // fs.rename(files.images.path, image_path, (err) => {
        // // 将文件写入对象中
        // fields.img = file_path01;
        // console.log(fields);
        // 连接数据库，将组装好的数据写入数据库
        db.where('id=' + urls.query.id).update2(fields, (data) => {
            // 判断数据库返回的信息，给客户端返回数据
            if (data == 1) {
                var backstr = "<script>alert('修改成功！');window.location.href='/'</script>";
                res.end(backstr);
            } else {
                var backstr = "<script>alert('修改失败：跟原数据一样！');window.location.href='/'</script>";
                res.end(backstr);
            }
        })
        // })
    })
},
//打开添加用户界面
addcommodity_get: function (req, res) {

    res.render('./addcommodity.html', {
        data: 123
    });
},
addcommodity_post(req, res) {
    // 获取form-data对象，用于文件上传以及表单数据解析
    var form = new formidable.IncomingForm();
    // 解决alert乱码
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    // 设置上传路径
    // var file_path = form.uploadDir = './public/img/image/';
    // 通过回调函数的形式将文件上传后的路径等信息及表单数据返回
    form.parse(req, (err, fields, files) => {
        // 设置上传路径，以及重命名
        // var image_path = file_path + files.images.name;
        // 设置写入数据库的文件路径
        // var file_path01 = '/img/image/' + files.images.name;
        // console.log(file_path);
        // 将上传后的文件移动到指定路径目录下
        // fs.rename(files.images.path, image_path, (err) => {
        console.log(fields);
        console.log(files);
        console.log(err);
        // // 将文件写入对象中
        // fields.img = file_path01;
        // console.log(fields);
        // 连接数据库，将组装好的数据写入数据库
        db.adduser2(fields, (data) => {
            // 判断数据库返回的信息，给客户端返回数据
            if (data == 0) {
                var backstr = "<script>alert('添加成功！');window.location.href='/'</script>";
                res.end(backstr);
            } else if (data == 1) {
                var backstr = "<script>alert('添加失败：用户已存在！');window.location.href='/adduser_get'</script>";
                res.end(backstr);
            }
        })
        // })
    })
},

//删除商品信息
delOnecommodity: function (req, res) {
    var urls = url.parse(req.url, true);
    db.where('id=' + urls.query.id).delete2(function (data) {
        // response.end(data.toString());
        if (data == 1) {
            res.setHeader('Content-Type', 'text/html;charset=utf-8');
            var backstr = "<script>alert('删除成功！');window.location.href='/'</script>";
            res.end(backstr);
        }

    });
},

//打开删除界面
    delcommodity: function (req, res) {
        res.render('./deluser.html', {
            data: 123
        });
    },
    delcommodity_post: function (req, res) {
        var urls = url.parse(req.url, true);
        var form = new formidable.IncomingForm();
        // 解决alert乱码
        res.setHeader('Content-Type', 'text/html;charset=utf-8');
        // 通过回调函数的形式将文件上传后的路径等信息及表单数据返回
        form.parse(req, (err, fields, files) => {
            db.delete2_post(fields, (data) => {
                // 判断数据库返回的信息，给客户端返回数据
                if (data == 0) {
                    var backstr = "<script>alert('删除失败：用户不存在！');window.location.href='/'</script>";
                    res.end(backstr);
                } else if (data == 1) {
                    var backstr = "<script>alert('删除成功！');window.location.href='/del_get'</script>";
                    res.end(backstr);
                }
            })
        })
    },
   
    demo_get: function (req, res) {
        res.render('./demo.html', {
            data: 123
        });
    },









}