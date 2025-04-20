'use strict';
const { DB } = require('../DB');
const path = require('node:path');

const { createHash } = require('node:crypto');

const hash = password => {
  const hash256 = createHash('sha256');
  const salt = `$omg!It'sSalt`;
  const concat = (a, b) => [a, b].join('$');
  const s = concat(salt, password);
  hash256.update(s);
  const res = hash256.copy().digest('hex');
  return res;
}

class Users extends DB {
  filename = path.resolve(__dirname, '../../data/users.db');
  sql = {
    createAuth: 'CREATE TABLE IF NOT EXISTS auth(id INTEGER PRIMARY KEY, hash TEXT UNIQUE, userId INTEGER, FOREIGN KEY(userId) REFERENCES users(id))',
    createGroups: 'CREATE TABLE IF NOT EXISTS groups(id INTEGER PRIMARY KEY, title TEXT, permission INTEGER)',
    createUsers: 'CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY, auth TEXT UNIQUE, name TEXT, email TEXT UNIQUE, register TEXT, password TEXT, groupID INTEGER, FOREIGN KEY(groupID), FOREIGN KEY(auth), REFERENCES groups(id), REFERENCES auth(hash)',
    newAuth: 'INSERT INTO auth(hash, userId) VALUES (?, ?)',
    newGroup: 'INSERT INTO groups(title, permission) VALUES (?, ?)',
    newUser: 'INSERT INTO users(name, email, register, password, groupID) VALUES (?, ?, datetime(), ?, ?)',
    auth: 'SELECT * FROM auth',
    groups: 'SELECT * FROM groups',
    users: 'SELECT * FROM users',
    getUserByAuth: 'SELECT * FROM auth WHERE hash = ?',
    getUserByID: 'SELECT * FROM users WHERE id = ?',
    getUserByEmailPassword: 'SELECT * FROM users WHERE email = ? AND password = ?',
  };

  constructor(options = {}) { super({ ...options }); }

  async create() {
    await super.execute('createGroups');
    await super.execute('createUsers');
    await super.execute('createAuth');
  }

  async users() {
    return super.all('users');
  }

  async addUser({ name, email, password: _password, groupID }) {
    const password = hash(_password);
    await super.execute('newUser', [name, email, password, groupID]);
  }

  async addAuth({ hash, userId }) {
    await super.execute('newAuth', [hash, userId]);
  }
  async addGroup({ title, permission }) {
    await super.execute('newGroup', [title, permission]);
  }

  async getUserByEmailPassword({ email, password: _password }) {
    const password = hash(_password);
    const user = await super.get('getUserByEmailPassword', [email, password]);
    return user;
  }

  async getUserByAuth({ hash }) {
    const user = await super.get('getUserByAuth', [hash]);
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
