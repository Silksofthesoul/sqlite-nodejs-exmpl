'use strict';
const path = require('path');
const { Articles } = require('../classes/Articles/Articles');
const nav = require('../data/navigation.json');

const route = async (app, ctx) => {
  const urlPath = '/';
  const templateFile = 'index';
  const filename = path.resolve(__dirname, '../data/articles.db');



  const data = {
    title: 'sql-lite test',
    nav,
  };


  app.get(urlPath, async (req, res, next) => {
    const db = new Articles({ filename });
    await db.init();
    const articles = await db.posts();
    data.articles = articles;
    db.close();
    res.render(templateFile, data);
  });
};

module.exports = route;
