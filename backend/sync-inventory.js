const path = require('path');
require('ts-node').register({
  project: path.join(__dirname, 'tsconfig.json')
});

const db = require('./src/database/models');

(async () => {
  try {
    console.log('Authenticating database...');
    await db.sequelize.authenticate();
    console.log('Syncing database schema (alter: true)...');
    await db.sequelize.sync({ alter: true });
    console.log('Successfully synced all inventory & master data models!');
    process.exit(0);
  } catch (error) {
    console.error('Error syncing database:', error);
    process.exit(1);
  }
})();
