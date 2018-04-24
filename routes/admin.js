var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var md5 = require('md5');

var model = require('../model/model');
var UserModel = model.UserModel;
var CategoryModel = model.CategoryModel;
var ArticleModel = model.ArticleModel;




/*
    用户数据进行管理
    username
    password
    email
    img

    1. 添加数据（用户注册）
    GET    /user/create    显示添加表单
    POST   /user           将数据插入到集合中

    2. 列表显示数据
    GET    /user

    3. 数据更新
    GET    /user/10/edit   显示该用户原来信息
    POST   /user/10/update 更新用户的信息

    4. 数据删除
    GET   /user/delete
 */
/* GET users listing. */
router.get('/admin', function(req, res, next) {
  res.render('admin/index');
});

router.get('/user/create', function(req, res) {
    res.render('admin/user/create');
});

router.post('/user', function(req, res) {
    var form = new formidable.IncomingForm();
    form.uploadDir = './public/uploads';
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        var date = new Date();
        fields.addtime = date.toLocaleString();
        fields.password = md5(fields.password);
        if(files.image.size != 0) {
            var path = files.image.path.replace(/\\/g, '/');
            var n = path.indexOf('/');
            path = path.substr(n);
            // console.log(path);
            fields.image = path;
        }
        var UserEntity = UserModel(fields);
        // console.log(UserEntity);
        UserEntity.save(function(err, user) {
            if(err) {
                res.render('common/error')
            } else {
                res.render('common/success', {msg: '添加成功',time:3000, url: '/user'})
            }
        })
    });

});

// 创建用户时验证邮箱是否存在
router.get('/check/email', (req, res) => {
    UserModel.find({email: req.query.email}, (err, data) => {
        if(data.length > 0) {
            res.json({
                code: 1,
                msg: '邮箱已存在'
            });
        } else {
            res.json({
                code: 0,
                msg: '恭喜你！邮箱可用'
            });
        }

    })
});

// 创建用户时验证昵称是否存在
router.get('/check/nickname', (req, res) => {
    UserModel.find({nickname: req.query.nickname}, (err, data) => {
        if(data.length > 0) {
            res.json({
                code: 1,
                msg: '该昵称已存在'
            });
        } else {
            res.json({
                code: 0,
                msg: '恭喜你！昵称可用'
            });
        }

    })
});

router.get('/user', (req, res) => {
    // console.log(req.query);
    // 每页显示多少条
    UserModel.find({}).exec((err, data) => {
        res.render('admin/user/users', {users: data});
        // res.json({code: 0})
    });
});

router.get('/user/:id/edit', (req, res) => {
    UserModel.findById(req.params.id, (err, user) => {
        res.render('admin/user/edit', {user: user})
    })

});

router.post('/user/:id/update', (req, res) => {
    UserModel.findById(req.params.id, (err, user) => {

        var form = new formidable.IncomingForm();
        form.uploadDir = './public/uploads';
        form.keepExtensions = true;

        form.parse(req, (err, fields, files) => {
            UserModel.find({email: fields.email}, (err, data) => {
                // 判断邮箱是否已存在，已存在不允许注册
                if (data.length > 0) {
                    res.render('common/error', {msg: '该邮箱已注册，请更换', time: 3000, url: '/user/' + req.params.id + '/edit'})
                } else {
                    user.nickname = fields.nickname;
                    user.email = fields.email;
                    if(files.image.size != 0) {
                        var path = files.image.path.replace(/\\/g, '/');
                        var n = path.indexOf('/');
                        path = path.substr(n);
                        // console.log(path);
                        user.image = path;
                    }

                    user.save(function(err) {
                        if(err) {
                            res.render('common/error', {msg: '编辑失败',time:3000, url: '/user'})
                        } else {
                            res.render('common/success', {msg: '编辑成功',time:3000, url: '/user'})
                        }
                    })
                }
            });

        });
    })
});

router.get('/user/update', (req, res) => {
    //获取id
    var id = req.query.id;
    //读取
    UserModel.findById(id, function(err, user){
        user.nickname = req.query.nickname;
        user.save(function(err){
            if(!err){
                res.json({code: 0, msg:'更新成功'});
            }else{
                res.json({code: 1, msg:'更新失败!!'});
            }
        })
    })
});

router.get('/user/:id/delete', (req, res) => {
    UserModel.findById(req.params.id, (err, user) => {
        user.remove(err => {
            if(err) {
                res.render('common/error')
            } else {
                res.render('common/success', {msg: '删除成功', time: 3000, url: '/user'})
            }
        })
    })
});

// 添加分类
router.get('/category/create', (req, res) => {
    res.render('admin/category/create');
});

router.post('/category', (req, res) => {
    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields) => {
        // 判断新建分类是否存在
        CategoryModel.find({name: fields.name}, (err, data) => {
            if(data.length > 0) {
                // console.log(data);
                res.render('common/error', {msg: '该分类名称已存在，请更换', time: 3000, url: '/category/create'})
            } else {
                var CategoryEntity = CategoryModel({name: fields.name});
                CategoryEntity.save((err) => {
                    if(err) {
                        res.render('common/error', {msg: '保存失败', time: 3000, url: '/category'})
                    } else {
                        res.render('common/success', {msg: '保存成功', time: 2000, url: '/category'})
                    }
                });
            }

            // res.send('over');
        })
    })


});

router.get('/category', (req, res) => {
    CategoryModel.find({}).exec((err, data) => {
        res.render('admin/category/categories', {categories: data})
    })
});

router.get('/category/:id/edit', (req, res) => {
    CategoryModel.findById(req.params.id, (err, category) => {
        res.render('admin/category/edit', {category: category})
    })

});

router.post('/category/:id/update', (req, res) => {
    CategoryModel.findById(req.params.id, (err, category) => {
        var form = new formidable.IncomingForm();
        form.parse(req, (err, fields) => {
            CategoryModel.find({name: fields.name}, (err, data) => {
                if (data.length > 0) {
                    // console.log(data);
                    res.render('common/error', {msg: '该分类名称已存在，请更换', time: 3000, url: '/category/' + req.params.id + '/edit'})
                } else {
                    category.name = fields.name;
                    category.save(function(err) {
                        if(err) {
                            res.render('common/error', {msg: '编辑失败', time: 2000, url: '/category'})
                        } else {
                            res.render('common/success', {msg: '编辑成功', time:3000, url: '/category'})
                        }
                    })
                }
            })

        });
    })
});

router.get('/category/:id/delete', (req, res) => {
    CategoryModel.findById(req.params.id, (err, category) => {
        category.remove(err => {
            if(err) {
                res.render('common/error', {msg: '删除失败', time: 3000, url: '/category'})
            } else {
                res.render('common/success', {msg: '删除成功', time: 3000, url: '/category'})
            }
        })
    })
});

router.get('/category/update', (req, res) => {
    //获取id
    var id = req.query.id;
    //读取
    CategoryModel.findById(id, function(err, category){
        category.name = req.query.name;
        category.save(function(err){
            if(!err){
                res.json({code: 0, msg:'更新成功'});
            }else{
                res.json({code: 1, msg:'更新失败!!'});
            }
        })
    })
});

//文章
router.get('/article/create', (req, res) => {
    CategoryModel.find((err, categories) => {
        if(!err) {
            res.render('admin/article/create', {categories: categories})
        }
    })
});

router.post('/articleUploads', (req, res) => {
    var form = new formidable.IncomingForm();
    form.uploadDir = './public/articleUploads';
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        var path = files['editormd-image-file'].path;
        path = path.replace(/\\/g, '/');
        var index = path.indexOf('/');
        path = path.substr(index);

        res.json({
            success : 1,
            message : "添加成功",
            url     : path
        })
    })

});

// 添加文章
router.post('/article', (req, res) => {
    var form = new formidable.IncomingForm();
    form.uploadDir = './public/articleUploads';
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        CategoryModel.findById(fields.cate_id, (err, category) => {
            console.log(category);
            fields.cate_id = category._id;
            fields.category = category.name;
            console.log(files);
            var path = files.pic.path;
            path = path.replace(/\\/g, '/');
            var index = path.indexOf('/');
            path = path.substr(index);

            fields.pic = path;
            fields.times = 0;
            var date = new Date();
            fields.addtime = date.toLocaleString();

            var ArticleEntity = new ArticleModel(fields);

            ArticleEntity.save((err) => {
                if(!err) {
                    res.render('common/success', {msg: '文章添加成功', time:3000, url: '/article'})
                } else {
                    res.render('common/error', {msg: '文章添加失败', time:3000, url: '/article'})
                }
            })
        })

    })
});

// 文章列表
router.get('/article', (req, res) => {
    ArticleModel.find().exec((err, data) => {
        if(!err) {
            res.render('admin/article/articles', {articles: data})
        }
    })
});

router.get('/article/:id/edit', (req, res) => {
    ArticleModel.findById(req.params.id, (err, article) => {
        CategoryModel.find((err, categories) => {
            if(!err) {
                res.render('admin/article/edit', {article: article, categories: categories})
            }
        })
    })
});

router.post('/article/:id/update', (req, res) => {
    ArticleModel.findById(req.params.id, (err, article) => {
        var form = new formidable.IncomingForm();
        form.uploadDir = './public/articleUploads';
        form.keepExtensions = true;

        form.parse(req, (err, fields, files) => {
            CategoryModel.findById(fields.cate_id, (err, category) => {
                article.cate_id = category._id;
                article.category = category.name;
                article.title = fields.title;
                article.intro = fields.intro;
                article.content = fields.content;

                if (files.pic.size != 0) {
                    console.log(files);
                    var path = files.pic.path.replace(/\\/g, '/');
                    var n = path.indexOf('/');
                    path = path.substr(n);
                    article.pic = path;
                }

                article.save((err) => {
                    if (!err) {
                        res.render('common/success', {msg: '文章修改成功', time: 3000, url: '/article'})
                    } else {
                        res.render('common/error', {msg: '文章修改失败', time: 3000, url: '/article'})
                    }
                })
            })

        })
    })
});

router.get('/article/:id/delete', (req, res) => {
    ArticleModel.findById(req.params.id, (err, article) => {
        article.remove(err => {
            if(err) {
                res.render('common/error', {msg: '删除失败', time: 3000, url: '/article'})
            } else {
                res.render('common/success', {msg: '删除成功', time: 3000, url: '/article'})
            }
        })
    })
});

module.exports = router;
