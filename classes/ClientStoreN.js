'use strict';

// utils
const { pipeAsync } = require('../utils/index.js');

class ClientStoreN {
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
  #type = 'cookie';


  constructor(type, req, res) {
    this.#req = req;
    this.#res = res;
    this.#type = type ? type : 'cookie';
  }

  async run() {
    const storeItem = ClientStoreN.getStore(this.#req, undefined, this.#type);
    if (!storeItem) {
      return this.requireAuth();
    } else {
      return await this.checkLogin(storeItem);
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
  static getStore(req, key = 'user', type = 'cookie') {
    let item = null;
    if (type === 'cookie') {
      let { [key]: _item } = req?.signedCookies || {};
      item = _item;
    } else if (type === 'session') {
      let { [key]: _item } = req?.session || {};
      item = _item;
    }
    return ClientStoreN.unpack(item);
  }
  static getHeader(req, key = 'authorization') {
    let { [key]: header } = req?.headers || {};
    return header;
  }

};

exports.ClientStoreN = ClientStoreN;
module.exports = {
  ClientStoreN,
};
