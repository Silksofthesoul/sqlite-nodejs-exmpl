'use strict';
const { Route } = require('../../classes/Route.js');

const cookieParams = {
  maxAge: 1000 * 60 * 1,
  signed: true,
  httpOnly: true
};
const authParse = authStr => authStr.split(':');
const headerUnwrap = header => {
  if (!header) return null;
  const [_, parsed] = header.split(' ');
  return new Buffer.from(parsed, 'base64').toString('utf8');
}

const requireAuth = res => {
  res.setHeader("WWW-Authenticate", "Basic")
  res.sendStatus(401)
  return { isStop: true };
};

const setAuth = (res, login, pass) => {
  console.log('WELCOME ADMIN')
  res.cookie('user', [login, pass].join(':'), cookieParams);
  return { data: { isLogined: true } };
};

const checkLogin = (res, authString) => {
  let [login, pass = ''] = authParse(authString);
  if (login == 'admin' && pass == 'admin') return setAuth(res, login, pass);
  else return requireAuth(res);
};

const route = app => {
  const fn = async (ctx, req, res) => {
    let cookies = req.signedCookies;
    let { user: cookie } = cookies;
    if (!cookie) {
      let auth = headerUnwrap(req.headers.authorization);
      if (!auth) return requireAuth(res);
      else if (auth) return checkLogin(res, auth);
    } else {
      return checkLogin(res, cookie);
    }
  }
  return new Route(
    '/admin/login',
    'get', {
    template: 'admin-login',
    data: { title: 'login' },
    navigation: Route.makeNavigation('link', 'login')
  }).listen(app, { fn });
};

module.exports = route;
