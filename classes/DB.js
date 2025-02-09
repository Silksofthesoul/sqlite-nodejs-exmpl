'use strict';
const sqlite3 = require('sqlite3');

class DB {
  filename = ''
  db = null;
  sql = {};

  constructor({ filename }) {
    this.filename = filename;
  }

  async init() {
    this.db = new sqlite3.Database(this.filename);
    return this;
  }

  close() {
    this.db.close();
    return this;
  }

  error(msg, err) {
    console.error(msg, err);
    return this;
  }

  log(msg) {
    console.log(msg);
    return this;
  }

  getSql(sqlKey) {
    if (this.sql[sqlKey] === undefined) return null;
    return this.sql[sqlKey];
  }

  async execute(sqlKey, params = []) {
    const { db } = this;
    const sql = this.getSql(sqlKey);
    if (!sql) return null;
    if (params && params.length > 0) {
      return new Promise((resolve, reject) => {
        db.run(sql, params, err => {
          if (err) reject(err);
          resolve();
        });
      });
    }
    return new Promise((resolve, reject) => {
      db.exec(sql, err => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  async all(sqlKey) {
    const { db } = this;
    const sql = this.getSql(sqlKey);
    if (!sql) return null;
    return new Promise((resolve, reject) => {
      db.all(sql, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  };

  async get(sqlKey, params = []) {
    const { db } = this;
    const sql = this.getSql(sqlKey);
    if (!sql) return null;
    if (params && params.length > 0) {
      return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
          if (err) reject(err);
          resolve(row);
        });
      });
    }
    return new Promise((resolve, reject) => {
      db.get(sql, (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  };
}

module.exports.DB = DB;
