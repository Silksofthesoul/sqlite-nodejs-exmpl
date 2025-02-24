'use strict';
const { isAsync, isPromise } = require('../utils');

class Route {
  static #routes = [];

  url = '/';
  method = 'get';
  template = 'index';
  data = {};
  navigation = {};

  constructor(url, method = get, params = {}) {
    const { template, data = null, navigation } = params;
    this.url = url;
    if (method) this.method = method;
    if (template) this.template = template;
    if (data) this.data = data;
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

  static getRoutes() {
    return Route.#routes.filter(({ hidden }) => !hidden);
  }

  static makeNavigation(type, text, hidden = false) {
    return { type, text, hidden };
  }

  setData(data) {
    this.data = { ...this.data, ...data };
    return this;
  }

  async listen(app, params = {}) {
    const { fn = null, redirect = null, isStop = false } = params;
    app[this.method](this.url, async (req, res, next) => {
      this.data.nav = Route.getRoutes();
      if (fn) {
        let resFn = {};
        if (isAsync(fn)) resFn = await fn(this, req, res);
        else if (isPromise(fn)) resFn = await fn(this, req, res);
        else resFn = fn(this, req, res);
        const { data, isStop: isStopData = false } = resFn || {};
        this.data = { ...this.data, ...data };
        if (isStop || isStopData) return null;
      }
      if (redirect) res.redirect(redirect);
      else res.render(this.template, this.data);
    });
    return this;
  }
};

module.exports.Route = Route;
