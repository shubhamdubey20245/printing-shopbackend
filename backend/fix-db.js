const sequelize = require('./src/config/database').default || require('./src/config/database');
(async () => {
  try {
    await sequelize.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255)');
    try {
      await sequelize.query(`UPDATE users SET name = COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')`);
      await sequelize.query('ALTER TABLE users DROP COLUMN first_name');
      await sequelize.query('ALTER TABLE users DROP COLUMN last_name');
    } catch(e) { console.log('first_name/last_name probably already dropped'); }
    await sequelize.query('ALTER TABLE users ALTER COLUMN name SET NOT NULL');
    console.log('Successfully fixed users table');
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
})();
