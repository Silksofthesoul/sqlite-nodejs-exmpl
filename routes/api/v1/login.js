'use strict';
// const { getUserByAuth } = require('../../../controllers/users');
const { Route } = require('../../../classes/Route');
// const { ClientStoreN } = require('../../../classes/ClientStoreN.js');


// controllers
// const { authSessionController } = require('../../../controllers/authentification');

// utils
const { pipe } = require('../../../utils/index.js');

const route = async (app, ctx) => {
  const fn = async (__, req, res) => {
    return authSessionController(req, res)

  };
  return new Route(
    '/api/v1/login',
    'post', {
    navigation: Route.makeNavigation('api', 'login')
  }).listen(app, { fn, isStop: true });
};

module.exports = route;
