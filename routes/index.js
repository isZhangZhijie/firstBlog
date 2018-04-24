var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var md5 = require('md5');
var markdown = require( "markdown" ).markdown;
var moment = require('moment');


var model = require('../model/model');
var UserModel = model.UserModel;
var CategoryModel = model.CategoryModel;
var ArticleModel = model.ArticleModel;
var HistoryModel = model.HistoryModel;
/* GET home page. */
router.get('/', function(req, res) {
    CategoryModel.find((err, categories) => {
        ArticleModel.find().sort({addtime: -1}).limit(5).exec((err, newArticles) => {
            var d = new Date();
            var month = d.getMonth() + 1;
            var day = d.getDate();
            var monthDay = month + '/' + day + '/';
            // console.log(monthDay);
            HistoryModel.find({monthDay: monthDay}, (err, histories) => {
                // console.log(histories);
                res.render('home/index', {
                    categories: categories,
                    newArticles: newArticles,
                    req: req,
                    histories: histories
                })
            })

        })
    })
});

// 登录页
router.get('/login', (req, res) => {
    res.render('admin/login');
});

router.post('/login', (req, res) => {
    var form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
        UserModel.find({email: fields.email}, (err, data) => {
            if(data.length > 0) {
                var user = data[0];
                // 判断密码
                if(user.password == md5(fields.password)) {
                    req.session.uid = user._id;
                    res.render('common/success', {msg: '登录成功', time: 300000, url: '/admin'})
                } else {
                    res.render('common/error', {msg: '密码错误', time: 3000, url: '/login'})
                }
            } else {
                res.render('common/error', {msg: '用户信息不存在', time: 3000, url: '/login'})
            }
        })
    })
});

// 退出登录
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login')
});

// 列表页
router.get('/articles', (req, res) => {
    // 条件对象
    var where = {};
    if(req.query.cate_id) {
        where['cate_id'] = req.query.cate_id
    }
    if(req.query.keywords) {
        where['title'] = {$regex: new RegExp(req.query.keywords)}
    }
    // 读取分类
    CategoryModel.find((err, categories) => {
        var page = req.query.page ? parseInt(req.query.page) : 1;
        var limit = 10;
        var skip = (page - 1) * limit;
        // 获得文章总数
        ArticleModel.count(where, (err, total) => {
            var pages = Math.ceil(total / limit);

            // 读取最新文章
            ArticleModel.find().sort({addtime: -1}).select({title: 1}).limit(5).exec((err, newArticles) => {

                // 读取文章
                ArticleModel.find(where).sort({addtime: -1}).skip(skip).limit(limit).exec((err, articles) =>{
                    // console.log(categories);
                    res.render('home/article/list', {
                        categories: categories,
                        articles: articles,
                        page: page,
                        pages: pages,
                        req: req,
                        newArticles: newArticles
                    })
                })
            })
        })
    })
});

// 详情页
router.get('/:id.html', (req, res) => {
    CategoryModel.find((err, categories) => {
        ArticleModel.find().sort({addtime: -1}).select({title: 1}).limit(5).exec((err, newArticles) => {
            ArticleModel.findById(req.params.id, (err, article) => {
                // 将markdown转为html格式
                article.content = markdown.toHTML(article.content);
                article.addtime = moment(article.addtime).format('YYYY年MM月DD日 hh:mm');
                console.log(article.addtime);
                res.render('home/article/detail', {
                    article: article,
                    categories: categories,
                    newArticles: newArticles,
                    req: req
                })
            })
        })
    })
});


module.exports = router;
