const sequelize = require('./src/config/db');

(async () => {
    try {
        await sequelize.authenticate();
        await sequelize.query('ALTER TABLE logs ADD COLUMN user_role VARCHAR(255);');
        console.log('Migration successful: ADD COLUMN user_role');
    } catch (err) {
        if (err.message.includes('Duplicate column name')) {
            console.log('Column already exists.');
        } else {
            console.error('Migration failed:', err.message);
        }
    } finally {
        process.exit();
    }
})();
