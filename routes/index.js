'use strict';
const index = require('./indexRoute.js');

// admin
const adminAddPost = require('./admin/add-post.js');
const adminRegistration = require('./admin/registration.js');

// api
const apiAddPost = require('./api/v1/add-post.js');
const apiRegistration = require('./api/v1/registration.js');

const obj = {
  index,
  adminAddPost,
  adminRegistration,
  apiAddPost,
  apiRegistration,
};

module.exports = obj;
