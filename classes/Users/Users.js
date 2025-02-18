'use strict';
const { DB } = require('../DB');
const path = require('node:path');

const { createHash } = require('node:crypto');

const hash = password => {
  const hash256 = createHash('sha256');
  const salt = '$omgItsASalt';
  const concat = (a, b) => [a, b].join('$');
  const s = concat(salt, password);
  hash256.update(s);
  const res = hash256.copy().digest('hex');
  console.log(s, res, '<<< LOG11');
  return res;
}

class Users extends DB {
  sql = {
    createGroups: 'CREATE TABLE IF NOT EXISTS groups(id INTEGER PRIMARY KEY, title TEXT, permission INTEGER)',
    createUsers: 'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE, register TEXT, password TEXT, groupID INTEGER, FOREIGN KEY(groupID) REFERENCES groups(id))',
    newUser: 'INSERT INTO users(name, email, register, password, groupID) VALUES (?, ?, datetime(), ?, ?)',
    newGroup: 'INSERT INTO groups(title, permission) VALUES (?, ?)',
    users: 'SELECT * FROM users',
    getUserByID: 'SELECT * FROM users WHERE id = ?',
    getUserByAuth: 'SELECT * FROM users WHERE email = ? AND password = ?',
    groups: 'SELECT * FROM groups',
  };

  constructor(options = {}) {
    const filename = path.resolve(__dirname, '../../data/users.db');
    super({ ...options, filename });
  }

  async create() {
    await super.execute('createGroups');
    await super.execute('createUsers');
  }

  async users() {
    return super.all('users');
  }

  async addUser({ name, email, password: _password, groupID }) {
    const password = hash(_password);
    await super.execute('newUser', [name, email, password, groupID]);
  }

  async addGroup({ title, permission }) {
    await super.execute('newGroup', [title, permission]);
  }

  async getUserByAuth({ email, password: _password }) {
    const password = hash(_password);
    console.log(password, '<<< LOG');
    const user = await super.get('getUserByAuth', [email, password]);
    return user;
  }

  async initGroups() {
    const promises = [
      this.addGroup({ title: 'user', permission: 10 }),
      this.addGroup({ title: 'admin', permission: 0 }),
    ];
    await Promise.all(promises);
  }
};

module.exports.Users = Users;
