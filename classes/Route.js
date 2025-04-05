'use strict';
const { isAsync, isPromise, isString, isFunction } = require('../utils');

class Route {
  static #routes = [];

  url = '/';
  method = 'get';
  template = 'index';
  data = {};
  navigation = {};

  static params = {};
  static middlewares = [];

  constructor(url, method = get, params = {}) {
    const { template, data = null, navigation } = params;
    this.url = url;
    if (method) this.method = method;
    if (template) this.template = template;
    if (data) this.data = { ...this.data, ...data };
    this.setupNavigation(navigation);
  }

  setupNavigation(navigation) {
    const { type, text, hidden } = navigation;
    Route.#routes.push({
      url: this.url,
      method: this.method,
      text,
      type,
      hidden,
    });
    return this;
  }

  setData(data) {
    this.data = { ...this.data, ...data };
    return this;
  }

  async rMiddleware(req, res, next, params = {}) {
    const { fn } = params;
    if (fn) {
      let resFn = {};
      if (isAsync(fn)) resFn = await fn(this, req, res);
      else if (isPromise(fn)) resFn = await fn(this, req, res);
      else resFn = fn(this, req, res);
      const { data, isStop: isStopData = false } = resFn || {};
      this.data = { ...this.data, ...data };
      if (isStop || isStopData) return null;
    }
  }

  async listen(app, params = {}) {
    const { fn = null, redirect = null, isStop = false } = params;
    app[this.method](this.url, async (req, res, next) => {
      const cacheBust = Route.params?.cacheBust ? Date.now() : null;
      this.data.nav = Route.getRoutes();
      this.data = { ...this.data, cacheBust };
      rMiddlware(req, res, next, params);
      if (redirect) res.redirect(redirect);
      else res.render(this.template, this.data);
    });
    return this;
  }

  static use(key, val = true) {
    if (isString(key)) Route.params[key] = val;
    else if (isFunction(key)) Route.middlewares.push(key);
    return Route;
  }

  static getRoutes() {
    return Route.#routes.filter(({ hidden }) => !hidden);
  }

  static makeNavigation(type, text, hidden = false) {
    return { type, text, hidden };
  }
};

module.exports.Route = Route;
