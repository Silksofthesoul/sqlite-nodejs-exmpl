'use strict';
const path = require('path');
const nav = require('../../data/navigation.json');


const route = async (app, ctx) => {
  const urlPath = '/admin/registration';
  const filename = path.resolve(__dirname, '../../data/users.db');
  let data = { title: 'add new post', nav };

  app.get(urlPath, async (req, res, next) => {
    res.render('admin-registration', data);
  });
};

module.exports = route;
