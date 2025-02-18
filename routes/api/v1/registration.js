'use strict';
const path = require('path');
const { Users } = require('../../../classes/Users/Users');

const route = async (app, ctx) => {
  const urlPath = '/api/v1/registration';

  let data = {};
  app.post(urlPath, async (req, res, next) => {
    const { name, email, password } = req.body;
    const db = new Users();
    await db.init();
    await db.addUser({ name, email, password, groupID: 0 });
    db.close();
    res.redirect('/admin/login');
  });
};

module.exports = route;
