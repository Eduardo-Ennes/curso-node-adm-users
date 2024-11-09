const Knex = require('knex')({
    client: 'mysql2',
    connection: {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: '1234',
      database: 'usersadm',
    },
});


module.exports = Knex;