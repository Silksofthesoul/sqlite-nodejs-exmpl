'use strict';
const { Route } = require('../../classes/Route.js');

const route = app => {
  return new Route(
    '/admin/registration',
    'get', {
    template: 'admin-registration',
    data: { title: 'registration' },
    navigation: Route.makeNavigation('link', 'registration')
  }).listen(app);
};

module.exports = route;
