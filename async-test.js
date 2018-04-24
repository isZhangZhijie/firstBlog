var async = require('async');
var request = require('superagent');
var cheerio = require('cheerio');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/myData');

//定义文档结构
var BlogSchema = new mongoose.Schema({
    title: String,
    time: String,
    intro: String,
    content: String,
    img: String,
    url: String
});

//定义模型
var BlogModel = mongoose.model('lulu', BlogSchema);


// 并发连接数的计数器
var d = new Date();
function fetchUrl (url, callback) {

    request
        .get(url)
        .end(function(err, res) {
            console.log('正在爬取 ' + url);
            // console.log(res.text);
            var $ = cheerio.load(res.text, {decodeEntities: false});
            //匹配标题
            var title = $('title').text();
            // if(title == '') {
            //     callback(true);
            // }

            //获取时间
            var time = $('.post-title h6').text();
            var reg = /时间：(.*)\s/;
            time = reg.exec(time);
            time = time ? time[1] : '';
            time = time.trim();

            //获取摘要
            var intro = $('blockquote p').text();
            intro = intro ? intro : '';

            //获取内容
            var content = $('.con').html();
            content = content ? content : '';
            // console.log(content);

            //获取图片
            var img = $('.con img').attr('src');
            img = img ? img : '';
            // console.log(img);

            var data = {
                title: title,
                time: time,
                content: content,
                intro: intro,
                img: img,
                url: url
            };
            var blog = new BlogModel(data);

            callback(null, blog)
        })
}

var urls = [];
for(let i = 1; i <= 10; i++) {
    urls.push('http://lusongsong.com/blog/post/' + i + '.html')
}

// 此处callback 就是后面的function(err, result) {}
// callback 第二个参数组合成的数组就是result
async.mapLimit(urls, 5, function (url, callback) {
    let startTime = d.getTime();
    fetchUrl(url, callback);
    let endTime = d.getTime();
    // console.log('爬取 ' + url + ' 已完成，耗时' + (endTime - startTime) + '毫秒');
}, function (err, result) {
    console.log('final:', result);
    result.forEach(function(blog) {
        blog.save(function (err) {
            if (err) {
                console.log(err);
            }
            mongoose.connection.close();
        })
    })
});