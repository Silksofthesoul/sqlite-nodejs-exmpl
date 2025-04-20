'use strict';
// utils
const { pipe } = require('../../utils/index.js');

const { getUserByEmailPassword, authUser } = require('../users/index.js');

const parseAuth = authString => pipe(
  str => str.replace(/^Basic /i, ''),
  str => str.trim(),
  str => Buffer
    .from(str, 'base64')
    .toString('utf8')
    .split(':'))
  (authString);

const checkLogin = async authString => {
  let [login, pass = ''] = parseAuth(authString);
  const res = await getUserByEmailPassword({ email: login, password: pass });
  const { data = {} } = res || {};
  const { user = null } = data || {};
  if (user) return user;
  return false;
};

const unauth = ctx => {
  ctx.route.status = 401;
  ctx.route.header = ['WWW-Authenticate', 'Basic']
  ctx.route.send = 'Access forbidden';
};

const auth = async (ctx, user) => {
  const hash = await authUser(user);
  ctx.route.header = ['authorization-hash', hash];
  ctx.data = { ...ctx.data, user };
};


const basic = async ({ req, res, ctx }) => {
  const authHeader = req.headers?.authorization;
  if (authHeader) {
    const user = await checkLogin(authHeader);
    if (user) console.log('user is found', user);
    if (user) await auth(ctx, user);
    else unauth(ctx);
  } else {
    unauth(ctx);
  }
  return false;
};

module.exports = {
  basic
};
