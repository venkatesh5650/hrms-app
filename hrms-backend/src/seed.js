const sequelize = require("./db");
const Organisation = require("./models/organisation");
const User = require("./models/user");
const Employee = require("./models/employee");
const Team = require("./models/team");
const EmployeeTeam = require("./models/employeeTeam");
const Log = require("./models/log");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

async function run() {
  try {
    await sequelize.authenticate();
    console.log("DB connected");

    // Dev-only: auto-create & align schema (production uses migrations)
    await sequelize.sync({ alter: true });

    // === Tenant (Organisation) bootstrap ===
    const org = await Organisation.create({ name: "Demo Organisation" });

    // Secure initial admin user (bcrypt hashing)
    const password_hash = await bcrypt.hash(
      "Password123!",
      parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10)
    );
    const admin = await User.create({
      organisation_id: org.id,
      name: "Admin User",
      email: "admin@demo.com",
      password_hash,
    });

    // Employees for demo tenant
    const e1 = await Employee.create({
      organisation_id: org.id,
      first_name: "Alice",
      last_name: "Smith",
      email: "alice@demo.com",
    });
    const e2 = await Employee.create({
      organisation_id: org.id,
      first_name: "Bob",
      last_name: "Jones",
      email: "bob@demo.com",
    });

    // Team setup
    const t1 = await Team.create({
      organisation_id: org.id,
      name: "Engineering",
      description: "Core dev team",
    });
    const t2 = await Team.create({
      organisation_id: org.id,
      name: "Design",
      description: "UI/UX",
    });

    // Relationship mapping
    await EmployeeTeam.create({ employee_id: e1.id, team_id: t1.id });
    await EmployeeTeam.create({ employee_id: e2.id, team_id: t2.id });

    // Track this action in audit logs
    await Log.create({
      organisation_id: org.id,
      user_id: admin.id,
      action: "seed_data_created",
      meta: { adminId: admin.id },
      timestamp: new Date(),
    });

    console.log("\n🌱 Seed complete!");
    console.log("🔐 Admin login → admin@demo.com / Password123!\n");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
