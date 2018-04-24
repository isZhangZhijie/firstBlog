# 个人博客

## 目录

- [项目描述](#项目描述)
- [项目要点](#项目要点)
- [项目难点](#项目难点)
- [额外功能](#额外功能)
- [项目预览](#项目预览)

## 项目描述

使用Node.js、Boostrap、Express、ejs、MongoDB、jQuery搭建个人博客;

实现基本的文章增删改查及用户增删改查

## 项目要点

  1.   使用Express服务器脚手架搭建服务器
  2.   基于ejs模板引擎配合Boostrap渲染页面，有效适配移动端
  3.   使用bower资源管理器安装前端库
  4.   使用jQuery进行ajax请求
  5.   Mongo数据库操作借助于Mongoose
  6.   使用session管理用户登录信息
  7.   实现了用户管理、文章分类管理、文章管理等功能
  8.   博客中的列表使用Datatables插件渲染，优点是自动分页、即时搜索和排序，缺点是会一次性请求所有数据，考虑到博客初创，数据量少，可以使用，一旦数据量提升，Datatables势必会降低性能，因此后续开发需要更换此插件。


## 项目难点

1. 使用textarea添加文章，但是不能连图片一同添加，另外创建图片添加标签显得繁琐。

  解决方案：通过百度发现一个markdown 富文本编辑器插件：editor.md，可以直接编辑markdown文本保存。

2. 文章以markdown格式储存在数据库，而浏览器无法直接渲染markdown格式

  解决方案：使用markdown-js转换为html标签后再行渲染



## 项目预览

![](http://p7hpld38u.bkt.clouddn.com/blog/img/blog-index.png)

![](http://p7hpld38u.bkt.clouddn.com/blog/img/blog-articles.png)

![](http://p7hpld38u.bkt.clouddn.com/blog/img/blog-createArt.png)

![](http://p7hpld38u.bkt.clouddn.com/blog/img/blog-user.png)

![](http://p7hpld38u.bkt.clouddn.com/blog/img/blog-createUser.png)