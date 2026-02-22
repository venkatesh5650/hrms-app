const sequelize = require('./src/config/db');

(async () => {
    try {
        await sequelize.authenticate();
        console.log('MySQL connection successful!');

        // 1. Make password_hash nullable
        await sequelize.query('ALTER TABLE users MODIFY password_hash VARCHAR(255) NULL;');
        console.log('Updated: password_hash is now nullable');

        // 2. Add setup_token
        try {
            await sequelize.query('ALTER TABLE users ADD COLUMN setup_token VARCHAR(255) NULL;');
            console.log('Added: setup_token column');
        } catch (e) {
            console.log('setup_token already exists or failed:', e.message);
        }

        // 3. Add setup_token_expires
        try {
            await sequelize.query('ALTER TABLE users ADD COLUMN setup_token_expires DATETIME NULL;');
            console.log('Added: setup_token_expires column');
        } catch (e) {
            console.log('setup_token_expires already exists or failed:', e.message);
        }

        console.log('Migration complete.');
    } catch (err) {
        console.error('Migration failed:', err.message);
    } finally {
        process.exit();
    }
})();
