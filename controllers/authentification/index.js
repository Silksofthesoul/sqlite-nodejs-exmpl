'use strict';
// utils
const { pipe } = require('../../utils/index.js');

const basic = async ({ req, res, ctx }) => {
  const auth = req.headers?.authorization;
  debugger;
  if (auth === 'password') {
    ctx.route.next = true;
  } else {
    ctx.route.status = 401;
    ctx.route.header = ['WWW-ClientStoreenticate', 'Basic']
    ctx.route.send = 'Access forbidden';
  }
  return false;
};

module.exports = {
  basic
};
