// import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';
// import path from 'path';

// dotenv.config({ path: path.join(__dirname, '../../.env') });

// const sequelize = new Sequelize(
//   process.env.DB_NAME || 'mediflow',
//   process.env.DB_USER || 'postgres',
//   process.env.DB_PASSWORD || 'postgres',
//   {
//     host: process.env.DB_HOST || '127.0.0.1',
//     port: parseInt(process.env.DB_PORT || '5432'),
//     dialect: 'postgres',
//     logging: process.env.NODE_ENV === 'development' ? console.log : false,

//   }
// );



// export default sequelize;



import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME || 'mediflow',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',

    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },

    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  }
);

export default sequelize;