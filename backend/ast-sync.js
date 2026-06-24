const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const modelsDir = path.join(__dirname, 'src', 'database', 'models');
const migrationsDir = path.join(__dirname, 'src', 'database', 'migrations');

const modelFiles = fs.readdirSync(modelsDir).filter(f => f.endsWith('.ts'));
const migrationFiles = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.js'));

function extractModelData(filePath) {
    const code = fs.readFileSync(filePath, 'utf8');
    const sourceFile = ts.createSourceFile(filePath, code, ts.ScriptTarget.Latest, true);

    let initObjText = null;
    let tableName = null;

    function visit(node) {
        if (ts.isCallExpression(node) && 
            ts.isPropertyAccessExpression(node.expression) && 
            node.expression.name.text === 'init') {
            
            const args = node.arguments;
            if (args.length >= 2) {
                // The first argument is the schema object
                initObjText = code.substring(args[0].getStart(sourceFile), args[0].getEnd());
                
                // The second argument is the options object
                const optionsObj = args[1];
                if (ts.isObjectLiteralExpression(optionsObj)) {
                    for (const prop of optionsObj.properties) {
                        if (ts.isPropertyAssignment(prop) && ts.isIdentifier(prop.name) && prop.name.text === 'tableName') {
                            tableName = prop.initializer.text;
                        }
                    }
                }
            }
        }
        ts.forEachChild(node, visit);
    }

    visit(sourceFile);
    return { initObjText, tableName };
}

modelFiles.forEach(mFile => {
    const { initObjText, tableName } = extractModelData(path.join(modelsDir, mFile));
    if (!initObjText || !tableName) return;

    // Find migration file
    const migFile = migrationFiles.find(f => f.includes(`create-${tableName}.js`) || f.includes(`create-${tableName.replace(/_/g, '')}.js`));
    
    if (migFile) {
        let replacement = initObjText.replace(/DataTypes\./g, 'Sequelize.');
        
        // Add created_at and updated_at manually to the object text if not present, but we can just append them cleanly
        // Actually, let's just parse the replacement string and inject created_at and updated_at
        replacement = replacement.replace(/}$/, `,
  created_at: {
    type: Sequelize.DATE,
    allowNull: false
  },
  updated_at: {
    type: Sequelize.DATE,
    allowNull: false
  }
}`);

        const migContent = `'use strict';\n
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('${tableName}', ${replacement});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('${tableName}');
  }
};\n`;

        fs.writeFileSync(path.join(migrationsDir, migFile), migContent);
        console.log(`Updated ${migFile} for model ${mFile}`);
    } else {
        console.log(`No migration found for ${tableName}`);
    }
});
