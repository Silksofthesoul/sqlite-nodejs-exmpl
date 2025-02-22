'use strict';
const { getArticles } = require('../controllers/articles/index.js');
const { Route } = require('../classes/Route.js');

const route = app => {
  return new Route(
    '/',
    'get', {
    template: 'index',
    data: { title: 'Sqlite test!' },
    navigation: Route.makeNavigation('link', 'Home')
  }).listen(app, { fn: getArticles });
};

module.exports = route;
