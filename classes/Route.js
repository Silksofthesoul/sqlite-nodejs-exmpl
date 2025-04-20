'use strict';
const {
  asyncAltQueue,
  isAsync,
  isFunction,
  isPromise,
  isString,

} = require('../utils');

class Route {
  static #routes = [];

  url = '/';
  method = 'get';
  template = 'index';
  data = {};
  navigation = {};
  route = {};

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

  async midFn({ req, res, next, params = {} }) {
    const { fn, isStop } = params;
    if (fn) {
      let resFn = {};
      if (isAsync(fn)) resFn = await fn(this, req, res);
      else if (isPromise(fn)) resFn = await fn(this, req, res);
      else resFn = fn(this, req, res);
      const { data, isStop: isStopData = false } = resFn || {};
      this.data = { ...this.data, ...data };
      if (isStop || isStopData) {
        this.route.isStop = true;
        return true;
      }
      return false;
    }
  }

  midCachBust({ req, res, next, params = {} }) {
    const cacheBust = Route.params?.cacheBust ? Date.now() : null;
    this.data = { ...this.data, cacheBust };
    return false;
  }

  midNav({ req, res, next, params = {} }) {
    this.data.nav = Route.getRoutes();
    return false;
  }

  midRedirect({ req, res, next, params = {} }) {
    const { redirect } = params;
    if (redirect) this.route.redirect = redirect;
    return false;
  }

  midResolve({ req, res, next, params = {} }) {
    if (this.route.isStop) return true;
    if (this.route.redirect) return res.redirect(this.route.redirect);
    if (this.route.header && this.route.header.length) res.setHeader(...this.route.header);
    if (this.route.status) res.status(this.route.status);
    if (this.route.send) return (res.send(this.route.send), true);
    if (this.route.json) return (res.json(this.route.json), true);
    if (this.route.next) return (next(), true);
    res.render(this.template, this.data);
    return true;
  }

  async listen(app, params = {}) {
    const middlewares = [
      this.midCachBust.bind(this),
      this.midNav.bind(this),
      ...Route.middlewares,
      this.midFn.bind(this),
      this.midRedirect.bind(this),
      this.midResolve.bind(this),
    ];

    app[this.method](this.url, async (req, res, next) => {
      const p = { req, res, next, params, ctx: this };
      await asyncAltQueue(...middlewares)(p);
    });

    return this;
  }

  static use(arg1, arg2 = true) {
    if (isString(arg1)) Route.params[arg1] = arg2;
    else if (isFunction(arg1)) Route.middlewares.push(arg1);
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
