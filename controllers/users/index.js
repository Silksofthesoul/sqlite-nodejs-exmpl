'use strict';
const { Users } = require('../../classes/Users/Users.js');

const getUsers = async _ => {
  const db = new Users();
  await db.init();
  await db.create();
  const users = await db.users();
  db.close();
  return { data: { users } };
};

const getUserByAuth = async (req) => {
  const { body, session } = req;
  const { email, password } = body;
  const { id } = session;
  const db = new Users();
  await db.init();
  const user = await db.getUserByAuth({ email, password });
  db.close();
  return { data: { user } };
};

const addNewUser = async ({ name, email, password }) => {
  const db = new Users();
  await db.init();
  await db.addUser({ name, email, password, groupID: 0 });
  db.close();
};

module.exports = {
  getUsers,
  addNewUser,
  getUserByAuth,
};
