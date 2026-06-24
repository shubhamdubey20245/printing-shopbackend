const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'src', 'database', 'models');
const migrationsDir = path.join(__dirname, 'src', 'database', 'migrations');

const modelFiles = fs.readdirSync(modelsDir).filter(f => f.endsWith('.ts'));
const migrationFiles = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.js'));

function extractModelDefinition(content, modelName) {
    const initMatch = content.match(new RegExp(`${modelName}\\.init\\(\\{([\\s\\S]*?)\\},\\s*\\{`));
    if (!initMatch) return null;
    
    // Very basic parsing to get column names
    const cols = [];
    const block = initMatch[1];
    
    let depth = 0;
    let currentKey = '';
    
    // Quick regex to find top-level keys
    const lines = block.split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.includes(': {') && !trimmed.startsWith('//')) {
            const keyMatch = trimmed.match(/^([a-zA-Z0-9_]+)\s*:/);
            if (keyMatch) cols.push(keyMatch[1]);
        }
    }
    return cols;
}

function extractMigrationDefinition(content) {
    const tableMatch = content.match(/createTable\(['"`]([a-zA-Z0-9_]+)['"`],\s*\{([\s\S]*?)\}\);/);
    if (!tableMatch) return null;
    
    const tableName = tableMatch[1];
    const block = tableMatch[2];
    
    const cols = [];
    const lines = block.split('\n');
    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('//')) {
            const keyMatch = trimmed.match(/^['"`]?([a-zA-Z0-9_]+)['"`]?\s*:/);
            if (keyMatch) cols.push(keyMatch[1]);
        }
    }
    return { tableName, cols };
}

console.log('Comparing Models to Migrations...\n');

for (const mFile of modelFiles) {
    const modelName = mFile.replace('.ts', '');
    const mContent = fs.readFileSync(path.join(modelsDir, mFile), 'utf8');
    const modelCols = extractModelDefinition(mContent, modelName);
    
    if (!modelCols) {
        console.log(`Could not parse model: ${modelName}`);
        continue;
    }
    
    // find corresponding migration
    let migrationFile = null;
    let migrationData = null;
    let maxMatches = -1;
    for (const mig of migrationFiles) {
        const migContent = fs.readFileSync(path.join(migrationsDir, mig), 'utf8');
        const data = extractMigrationDefinition(migContent);
        if (data) {
            // Match based on model Name and table name roughly, or just if it contains similar cols
            // Actually, we can check table name from model
            const tableMatch = mContent.match(/tableName:\s*['"`]([a-zA-Z0-9_]+)['"`]/);
            const tableName = tableMatch ? tableMatch[1] : modelName.toLowerCase() + 's';
            if (data.tableName === tableName) {
                migrationFile = mig;
                migrationData = data;
                break;
            }
        }
    }
    
    console.log(`Model: ${modelName}`);
    if (!migrationData) {
        console.log(`  -> No matching migration found!`);
        continue;
    }
    
    console.log(`  Migration: ${migrationFile} (${migrationData.tableName})`);
    
    const missingInMig = modelCols.filter(c => !migrationData.cols.includes(c));
    const missingInModel = migrationData.cols.filter(c => !modelCols.includes(c));
    
    if (missingInMig.length > 0) console.log(`  Missing in Migration: ${missingInMig.join(', ')}`);
    if (missingInModel.length > 0) console.log(`  Extra in Migration (or deleted from model): ${missingInModel.join(', ')}`);
    if (missingInMig.length === 0 && missingInModel.length === 0) console.log(`  Columns match perfectly.`);
    console.log('');
}
