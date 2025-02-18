'use strict';
const path = require('path');
const { Articles } = require('../../classes/Articles/Articles.js');
const nav = require('../../data/navigation.json');


const route = async (app, ctx) => {
  const urlPath = '/admin/add-post';
  const filename = path.resolve(__dirname, '../../data/articles.db');
  let data = { title: 'add new post', nav };

  app.get(urlPath, async (req, res, next) => {
    const db = new Articles({ filename });
    await db.init();
    await db.create();
    const articles = await db.posts();
    data.articles = articles;
    db.close();
    res.render('admin-add-post', data);
  });
};

module.exports = route;
