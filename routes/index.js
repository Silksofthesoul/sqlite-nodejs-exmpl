'use strict';
const index = require('./indexRoute.js');
const adminAddPost = require('./admin/add-post.js');
const apiAddPost = require('./api/v1/add-post.js');

const obj = {
  index,
  adminAddPost,
  apiAddPost,
};

module.exports = obj;
