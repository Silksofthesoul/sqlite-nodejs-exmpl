'use strict';
const { addNewPost } = require('../../../controllers/articles/index.js');
const { Route } = require('../../../classes/Route');

const route = async (app, ctx) => {
  const fn = async (_, req, __) => await addNewPost(req.body);
  return new Route(
    '/api/v1/add-post',
    'post', {
    navigation: Route.makeNavigation('api', 'add new post')
  }).listen(app, { fn, redirect: '/admin/add-post' });
};

module.exports = route;
