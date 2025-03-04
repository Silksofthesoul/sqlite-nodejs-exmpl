'use strict';
// utils
const { pipe } = require('../../utils/index.js');

// classes
const { Auth } = require('../../classes/Auth.js');

// controllers
const { getUserByAuth } = require('../users/index.js');


const basicAuth = async (req, res) => {
  const basic = new Auth('cookie', req, res);

  basic.requireAuth = _ => {
    res.setHeader("WWW-Authenticate", "Basic")
    res.sendStatus(401)
    return { isStop: true };
  };

  basic.setAuth = (login, pass) => {
    console.log(`WELCOME ${login} `);
    const cookie = pipe(Auth.authStringify, Auth.pack)(login, pass);
    res.cookie('user', cookie, Auth.cookieParams);
    return { data: { isLogined: true } };
  };

  basic.checkLogin = async authString => {
    let [login, pass = ''] = Auth.authParse(authString);
    const res = await getUserByAuth({ email: login, password: pass });
    const { data = {} } = res || {};
    const { user = null } = data || {};
    if (user) return basic.setAuth(login, pass);
    else return basic.requireAuth();
  };

  return await basic.run();
};

const basicSessionsAuth = async (req, res) => {
  const basic = new Auth('session', req, res);

  basic.requireAuth = _ => {
    res.setHeader("WWW-Authenticate", "Basic")
    res.sendStatus(401)
    return { isStop: true };
  };

  basic.setAuth = (login, pass) => {
    console.log(`WELCOME ${login} `);
    const sessionItem = pipe(Auth.authStringify, Auth.pack)(login, pass);
    req.session.user = sessionItem;
    return { data: { isLogined: true } };
  };

  basic.checkLogin = async authString => {
    let [login, pass = ''] = Auth.authParse(authString);
    const res = await getUserByAuth({ email: login, password: pass });
    const { data = {} } = res || {};
    const { user = null } = data || {};
    if (user) return basic.setAuth(login, pass);
    else return basic.requireAuth();
  };

  return await basic.run();
};

module.exports = {
  basicAuth,
  basicSessionsAuth,
};
