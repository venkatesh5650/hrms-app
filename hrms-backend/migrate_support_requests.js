const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false },
        connectTimeout: 30000,
    },
    pool: { max: 2, idle: 30000, acquire: 60000 },
});

async function runMigration(retries = 5) {
    try {
        await sequelize.authenticate();
        console.log('DB connected');

        await sequelize.query(`
      CREATE TABLE IF NOT EXISTS support_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        organisation_id INT NOT NULL,
        employee_id INT NOT NULL,
        category ENUM('Access Issue','Team Change','Profile Update','Team Collaboration','Other') NOT NULL,
        message TEXT NOT NULL,
        assigned_to_role ENUM('HR','MANAGER','ADMIN') NOT NULL,
        status ENUM('PENDING','RESOLVED') NOT NULL DEFAULT 'PENDING',
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(id),
        INDEX idx_org_role (organisation_id, assigned_to_role),
        INDEX idx_status (status)
      );
    `);

        console.log('Migration successful: CREATE TABLE support_requests');
        process.exit(0);
    } catch (err) {
        if (err.message.includes('already exists')) {
            console.log('Table already exists — no changes needed.');
            process.exit(0);
        }
        console.error('Migration error:', err.message);
        if (retries > 0) {
            console.log(`Retrying in 5s... (${retries} retries left)`);
            setTimeout(() => runMigration(retries - 1), 5000);
        } else {
            console.error('All retries exhausted.');
            process.exit(1);
        }
    }
}

runMigration();
