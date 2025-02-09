'use strict';
const path = require('path');
const { Articles } = require('../../../classes/Articles/Articles');

const route = async (app, ctx) => {
  const urlPath = '/api/v1/add-post';
  const filename = path.resolve(__dirname, '../../../data/articles.db');



  let data = {};
  app.post(urlPath, async (req, res, next) => {
    const { title, author, content } = req.body;
    const db = new Articles({ filename });
    await db.init();
    await db.add({ title, author, content });
    const articles = await db.posts();
    data.articles = articles;
    db.close();
    // res.json(data);
    res.redirect('/admin/add-post');
  });
};

module.exports = route;
