'use strict';
const { addNewUser } = require('../../../controllers/users');
const { Route } = require('../../../classes/Route');

const route = async (app, ctx) => {
  const fn = async (_, req, __) => await addNewUser(req.body);
  return new Route(
    '/api/v1/registration',
    'post', {
    navigation: Route.makeNavigation('api', 'registration')
  }).listen(app, { fn, redirect: '/admin/login' });
};

module.exports = route;
