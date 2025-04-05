'use strict';
const index = require('./indexRoute.js');

// admin
// const adminAddPost = require('./admin/add-post.js');
const adminLogin = require('./admin/login.js');
// const adminRegistration = require('./admin/registration.js');

// api
// const apiAddPost = require('./api/v1/add-post.js');
// const apiRegistration = require('./api/v1/registration.js');
// const apiLogin = require('./api/v1/login.js');

const obj = {
  // adminAddPost,
  adminLogin,
  // adminRegistration,
  // apiAddPost,
  // apiLogin,
  // apiRegistration,
  index,
};

module.exports = obj;
