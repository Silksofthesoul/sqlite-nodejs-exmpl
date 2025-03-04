'use strict';
const { Route } = require('../../classes/Route.js');
// const { basicAuth } = require('../../controllers/authentification');
const { basicSessionsAuth } = require('../../controllers/authentification');

const route = app => {
  // const fn = async (ctx, req, res) => basicAuth(req, res);
  const fn = async (ctx, req, res) => basicSessionsAuth(req, res);

  return new Route(
    '/admin/login',
    'get', {
    template: 'admin-login',
    data: { title: 'login' },
    navigation: Route.makeNavigation('link', 'login')
  }).listen(app, { fn });
};

module.exports = route;
