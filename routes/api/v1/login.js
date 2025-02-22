'use strict';
const { getUserByAuth } = require('../../../controllers/users');
const { Route } = require('../../../classes/Route');

const route = async (app, ctx) => {
  const fn = async (__, req, res) => {
    const { data } = await getUserByAuth(req.body);
    const { user } = data;
    if (!user) res.redirect('/admin/login');
    else res.redirect('/');
  };
  return new Route(
    '/api/v1/login',
    'post', {
    navigation: Route.makeNavigation('api', 'login')
  }).listen(app, { fn, outerRedirect: true });
};

module.exports = route;
