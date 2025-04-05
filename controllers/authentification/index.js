'use strict';
// utils
const { pipe } = require('../../utils/index.js');

// classes
const { ClientStore } = require('../../classes/ClientStore.js');
const { ClientStoreN } = require('../../classes/ClientStoreN.js');

// controllers
const { getUserByAuth } = require('../users/index.js');


const basicClientStore = async (req, res) => {
  const basic = new ClientStore('cookie', req, res);

  basic.requireClientStore = _ => {
    res.setHeader("WWW-ClientStoreenticate", "Basic")
    res.sendStatus(401)
    return { isStop: true };
  };

  basic.setClientStore = (login, pass) => {
    console.log(`WELCOME ${login} `);
    const cookie = pipe(ClientStore.authStringify, ClientStore.pack)(login, pass);
    res.cookie('user', cookie, ClientStore.cookieParams);
    return { data: { isLogined: true } };
  };

  basic.checkLogin = async authString => {
    let [login, pass = ''] = ClientStore.authParse(authString);
    const res = await getUserByClientStore({ email: login, password: pass });
    const { data = {} } = res || {};
    const { user = null } = data || {};
    if (user) return basic.setClientStore(login, pass);
    else return basic.requireClientStore();
  };

  return await basic.run();
};

const basicSessionsClientStore = async (req, res) => {
  const basic = new ClientStore('session', req, res);

  basic.requireClientStore = _ => {
    res.setHeader("WWW-ClientStoreenticate", "Basic")
    res.sendStatus(401)
    return { isStop: true };
  };

  basic.setClientStore = (login, pass) => {
    console.log(`WELCOME ${login} `);
    const sessionItem = pipe(ClientStore.authStringify, ClientStore.pack)(login, pass);
    req.session.user = sessionItem;
    return { data: { isLogined: true } };
  };

  basic.checkLogin = async authString => {
    let [login, pass = ''] = ClientStore.authParse(authString);
    const res = await getUserByClientStore({ email: login, password: pass });
    const { data = {} } = res || {};
    const { user = null } = data || {};
    if (user) return basic.setClientStore(login, pass);
    else return basic.requireClientStore();
  };

  return await basic.run();
};

const authSessionController = async (req, res) => {
  const auth = new ClientStoreN('session', req, res);

  auth.requireAuth = async _ => {
    const { data } = await getUserByAuth(req.body);
    const { user } = data;
    console.log('user', user);
    if (!user) {
      res
        .status(401)
        .json({ error: 'user not found' });
      return { isStop: true };
    } else {
      res
        .json({ error: null, user });
      return auth.setAuth(user.email, user.password);
    }
  };

  auth.setAuth = (login, pass) => {
    console.log(`WELCOME ${login} `);
    const sessionItem = pipe(ClientStoreN.authStringify, ClientStoreN.pack)(login, pass);
    req.session.user = sessionItem;
    return { data: { isLogined: true } };
  };

  auth.checkLogin = async authString => {
    let [login, pass = ''] = ClientStoreN.authParse(authString);
    const res = await getUserByAuth({ email: login, password: pass });
    const { data = {} } = res || {};
    const { user = null } = data || {};
    if (user) return auth.setAuth(login, pass);
    else return auth.requireAuth();
  };
  return await auth.run();
};

const authSessionViewController = async (req, res) => {
  const auth = new ClientStoreN('session', req, res);

  auth.requireAuth = async _ => {
    const { data } = await getUserByAuth(req);
    const { user } = data;
    debugger;
    console.log('user', user);
    if (!user) {
      res.status(401);
      return {};
    } else {
      return auth.setAuth(user.email, user.password);
    }
  };

  auth.setAuth = (login, pass) => {
    console.log(`WELCOME ${login} `);
    const sessionItem = pipe(ClientStoreN.authStringify, ClientStoreN.pack)(login, pass);
    req.session.user = sessionItem;
    return { data: { isLogined: true } };
  };

  auth.checkLogin = async authString => {
    let [login, pass = ''] = ClientStoreN.authParse(authString);
    const res = await getUserByAuth({ email: login, password: pass });
    const { data = {} } = res || {};
    const { user = null } = data || {};
    if (user) return auth.setAuth(login, pass);
    else return auth.requireAuth();
  };
  return await auth.run();
};

module.exports = {
  basicClientStore,
  basicSessionsClientStore,
  authSessionController,
  authSessionViewController,
};
