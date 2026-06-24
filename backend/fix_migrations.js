const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, 'src', 'database', 'migrations');
const files = fs.readdirSync(migrationsDir).sort();

files.forEach(file => {
  if (!file.endsWith('.js')) return;
  const filePath = path.join(migrationsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  // replace literal \n with actual newlines
  content = content.replace(/\\n/g, '\n');
  fs.writeFileSync(filePath, content);
  console.log(`Fixed ${file}`);
});
