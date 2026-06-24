import app from './app';
import sequelize from './config/database';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // In dev, sync models (in production, use migrations)
    if (process.env.NODE_ENV === 'development') {
      // sequelize.sync({ alter: true }) removed in favor of migrations
      console.log('Database sync disabled. Please use migrations.');
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
    // trigger restart 2
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

startServer();
