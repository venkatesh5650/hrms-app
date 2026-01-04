const bcrypt = require("bcrypt");
const sequelize = require("../config/db");
const User = require("../models/user");
const Employee = require("../models/employee");

const DEMO_PASSWORD = "Demo@123";

async function seed() {
  await sequelize.authenticate();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const demoUsers = [
    { name: "Demo Admin", email: "demo.admin@hrms.com", role: "ADMIN" },
    { name: "Demo HR", email: "demo.hr@hrms.com", role: "HR" },
    { name: "Demo Manager", email: "demo.manager@hrms.com", role: "MANAGER" },
    { name: "Demo Employee", email: "demo.employee@hrms.com", role: "EMPLOYEE" },
  ];

  for (const u of demoUsers) {
    let user = await User.findOne({ where: { email: u.email } });

    if (!user) {
      user = await User.create({
        organisation_id: 1,
        name: u.name,
        email: u.email,
        role: u.role,
        password_hash: passwordHash,
        is_demo: true,
      });
      console.log(`Created user ${u.email}`);
    } else {
      console.log(`User exists: ${u.email}`);
    }

    // Create employee profile only for EMPLOYEE role
    if (u.role === "EMPLOYEE") {
      const empExists = await Employee.findOne({ where: { user_id: user.id } });

      if (!empExists) {
        await Employee.create({
          organisation_id: 1,
          user_id: user.id,
          first_name: "Demo",
          last_name: "Employee",
          email: u.email,
          is_demo: true,
        });
        console.log(`Linked employee profile for ${u.email}`);
      } else {
        console.log(`Employee profile already exists for ${u.email}`);
      }
    }
  }

  console.log("Demo users + employee seeded.");
  process.exit();
}

seed();
