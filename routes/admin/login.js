'use strict';
const { Route } = require('../../classes/Route.js');
// const { basicAuth } = require('../../controllers/authentification');
// const { basicSessionsAuth } = require('../../controllers/authentification');
const { authSessionController } = require('../../controllers/authentification');

const route = app => {
  // const fn = async (ctx, req, res) => basicAuth(req, res);
  // const fn = async (ctx, req, res) => basicSessionsAuth(req, res);
  const fn = async (ctx, req, res) => authSessionController(req, res);

  const scripts = [{ url: '/js/login.js', defer: true },];

  return new Route(
    '/admin/login',
    'get', {
    template: 'admin-login',
    data: { title: 'login', scripts },
    navigation: Route.makeNavigation('link', 'login')
  }).listen(app, { fn });
};

module.exports = route;
