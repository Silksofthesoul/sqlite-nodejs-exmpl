'use strict';
const { createHash } = require('node:crypto');
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


const getUserByEmailPassword = async ({ email, password }) => {
  const db = new Users();
  await db.init();
  const user = await db.getUserByEmailPassword({ email, password });
  db.close();
  return { data: { user } };
};

const authUser = async user => {
  const salt = '$omg!It\'sSalt';
  const { id, email, password } = user;
  const str = [
    id,
    email,
    password,
    salt,
    (new Date()).toString()]
    .join('$');
  const hash = createHash('sha256')
    .update(str)
    .digest('hex');
  const db = new Users();
  await db.init();
  await db.addAuth({ hash, userId: id });
  return hash;
};

module.exports = {
  addNewUser,
  authUser,
  getUserByAuth,
  getUserByEmailPassword,
  getUsers,
};
