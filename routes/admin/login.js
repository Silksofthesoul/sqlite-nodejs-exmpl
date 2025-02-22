'use strict';
const { Route } = require('../../classes/Route.js');

const route = app => {
  return new Route(
    '/admin/login',
    'get', {
    template: 'admin-login',
    data: { title: 'login' },
    navigation: Route.makeNavigation('link', 'login')
  }).listen(app);
};

module.exports = route;
