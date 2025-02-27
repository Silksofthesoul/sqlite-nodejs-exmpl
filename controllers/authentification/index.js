'use strict';
// utils
const { pipe, pipeAsync } = require('../../utils/index.js');

// controllers
const { getUserByAuth } = require('../users/index.js');

class BasicAuthentification {
  static cookieParams = {
    maxAge: 1000 * 60 * 1,
    signed: true,
    httpOnly: true
  };

  requireAuth = null;
  setAuth = null;
  checkLogin = null;

  #req = null;
  #res = null;


  constructor(req, res) {
    this.#req = req;
    this.#res = res;
  }

  async run() {
    const cookie = BasicAuthentification.getCookie(this.#req);
    if (!cookie) {
      let auth = BasicAuthentification.getHeader(this.#req);
      if (!auth) return this.requireAuth();
      else if (auth) return await pipeAsync(BasicAuthentification.headerUnwrap, this.checkLogin)(auth)
    } else {
      return await this.checkLogin(cookie);
    }
  }

  static pack(str) { return Buffer.from(str).toString('base64'); }
  static unpack(str = '') { return Buffer.from(str, 'base64').toString('utf8'); }
  static authParse(authStr) { return authStr.split(':'); }
  static authStringify(...args) { return args.join(':'); }
  static headerUnwrap(header) {
    if (!header) return null;
    const [_, parsed] = header.split(' ');
    return new Buffer.from(parsed, 'base64').toString('utf8');
  }
  static getCookie(req, key = 'user') {
    let { [key]: cookie } = req?.signedCookies || {};
    return BasicAuthentification.unpack(cookie);
  }
  static getHeader(req, key = 'authorization') {
    let { [key]: header } = req?.headers || {};
    return header;
  }

};

const basicAuth = async (req, res) => {
  const basic = new BasicAuthentification(req, res);

  basic.requireAuth = _ => {
    res.setHeader("WWW-Authenticate", "Basic")
    res.sendStatus(401)
    return { isStop: true };
  };

  basic.setAuth = (login, pass) => {
    console.log(`WELCOME ${login} `);
    const cookie = pipe(BasicAuthentification.authStringify, BasicAuthentification.pack)(login, pass);
    res.cookie('user', cookie, BasicAuthentification.cookieParams);
    return { data: { isLogined: true } };
  };

  basic.checkLogin = async authString => {
    let [login, pass = ''] = BasicAuthentification.authParse(authString);
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
};
