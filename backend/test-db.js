const { Sequelize } = require('sequelize');
const config = require('./src/config/config.js');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,
  port: dbConfig.port
});

async function run() {
  try {
    const tenants = await sequelize.query('SELECT * FROM tenants;', { type: Sequelize.QueryTypes.SELECT });
    console.log('Tenants:', tenants.length);
    const users = await sequelize.query('SELECT * FROM users;', { type: Sequelize.QueryTypes.SELECT });
    console.log('Users:', users.length);
    const roles = await sequelize.query('SELECT * FROM roles;', { type: Sequelize.QueryTypes.SELECT });
    console.log('Roles:', roles.length);
    const permissions = await sequelize.query('SELECT * FROM permissions;', { type: Sequelize.QueryTypes.SELECT });
    console.log('Permissions:', permissions.length);
  } catch (e) {
    console.error(e);
  } finally {
    await sequelize.close();
  }
}

run();
