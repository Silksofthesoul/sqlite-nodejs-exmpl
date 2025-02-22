const { Articles } = require('../../classes/Articles/Articles.js');

const getArticles = async _ => {
  const db = new Articles();
  await db.init();
  await db.create();
  const articles = await db.posts();
  db.close();
  return { data: { articles } };
};

const addNewPost = async ({ title, author, content }) => {
  const db = new Articles();
  await db.init();
  await db.add({ title, author, content });
  db.close();
};

module.exports = {
  getArticles,
  addNewPost,
};
