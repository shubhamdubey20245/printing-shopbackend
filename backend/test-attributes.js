require('ts-node/register');
const db = require('./src/database/models');

if (db.User) {
    const attrs = db.User.getAttributes();
    console.log(attrs);
} else {
    console.log("User model not found in db");
}
process.exit(0);
