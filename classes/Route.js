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
      if (isStop || isStopData) return true;
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
    if (redirect) res.redirect(redirect);
    return false;
  }

  midRender({ req, res, next, params = {} }) {
    res.render(this.template, this.data);
    return false;
  }

  async listen(app, params = {}) {
    const middlewares = [
      this.midCachBust.bind(this),
      this.midNav.bind(this),
      ...Route.middlewares,
      this.midFn.bind(this),
      this.midRedirect.bind(this),
      this.midRender.bind(this),
    ];

    app[this.method](this.url, async (req, res, next) => {
      await asyncAltQueue(...middlewares)({ req, res, next, params });
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
