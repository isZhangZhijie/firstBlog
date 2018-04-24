var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/myData');


var CategorySchema = new mongoose.Schema({
    name: String
});

var CategoryModel = mongoose.model('blogCategory', CategorySchema);

var ArticleSchema = new mongoose.Schema({
    title: String,
    addtime: String,
    content: String,
    times: Number,
    intro: String,
    pic: String,
    cate_id: String,
    category: String
});

var ArticleModel = mongoose.model('blogArticle', ArticleSchema);

var UserSchema = new mongoose.Schema({
    nickname: String,
    email: String,
    password: String,
    image: String,
    addtime: String
});
var UserModel = mongoose.model('blogUser', UserSchema);


var HistorySchema = new mongoose.Schema({
    year: String,
    month: String,
    day: String,
    title: String,
    picUrl: String,
    link: String,
    date: String,
    monthDay: String,
});

var HistoryModel = mongoose.model('history', HistorySchema);


module.exports = {
    UserModel: UserModel,
    CategoryModel: CategoryModel,
    ArticleModel: ArticleModel,
    HistoryModel: HistoryModel
};