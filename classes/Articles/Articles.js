'use strict';
const { DB } = require('../DB');

class Articles extends DB {

  sql = {
    create: 'CREATE TABLE IF NOT EXISTS articles(id INTEGER PRIMARY KEY, title TEXT, content TEXT, date TEXT, author TEXT)',
    newArticle: 'INSERT INTO articles(title, content, date, author) VALUES (?, ?, ?, ?)',
    editArticle: 'UPDATE articles SET title = ? WHERE id = ?',
    allPosts: 'SELECT * FROM articles',
  };

  constructor(options) {
    super(options);
  }
  async create() {
    await super.execute('create')
  }
  async posts() {
    return super.all('allPosts');
  }
  async add({ title, author, content }) {
    await super.execute('newArticle', [title, content, new Date(), author]);
  }
};

module.exports.Articles = Articles;
