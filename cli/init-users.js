const path = require('path');
const { Users } = require('../classes/Users/Users.js');

const cli = async _ => {
  const filename = path.resolve(__dirname, '../data/users.db');

  const db = new Users({ filename });
  await db.init();
  await db.create();
  await db.initGroups();
  // await db.addUser({ name: 'admin', email: 'admin@admin.com', password: '123456', groupID: 0 });
  // await db.addUser({ name: 'admin2', email: 'admin2@admin.com', password: '123456', groupID: 0 });
  // await db.addUser({ name: 'test', email: 'test@test.com', password: '123456', groupID: 10 });
  // const user = await db.getUserByAuth({ email: 'admin@admin.com', password: '123456' });
  // console.log(user, '<<< LOG');
  db.close();
};
cli();
