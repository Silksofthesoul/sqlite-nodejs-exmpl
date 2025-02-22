'use strict';
const { getArticles } = require('../../controllers/articles/index.js');
const { Route } = require('../../classes/Route.js');

const route = app => {
  return new Route(
    '/admin/add-post',
    'get', {
    template: 'admin-add-post',
    data: { title: 'add new post' },
    navigation: Route.makeNavigation('link', 'add new post')
  }).listen(app, { fn: getArticles });
};

module.exports = route;
