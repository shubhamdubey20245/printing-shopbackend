'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);

const db = {};

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      (file.slice(-3) === '.ts' || file.slice(-3) === '.js') &&
      file.indexOf('.test.') === -1
    );
  })
  .forEach(file => {
    const exported = require(path.join(__dirname, file));
    // iterate through exports, as ts files use named exports e.g. `export class User`
    for (const key in exported) {
      const model = exported[key];
      if (model && model.prototype instanceof Sequelize.Model) {
        db[model.name] = model;
      }
    }
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Since the models import sequelize directly, we can grab it from one of them or import it
db.sequelize = require('../../config/database').default || require('../../config/database');
db.Sequelize = Sequelize;

module.exports = db;
