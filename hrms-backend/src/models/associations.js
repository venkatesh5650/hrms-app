const User = require("./user");
const Employee = require("./employee");
const Organisation = require("./organisation");
const Team = require("./team");
const EmployeeTeam = require("./employeeTeam");
const Approval = require("./approval");

// Organisation relations
User.belongsTo(Organisation, { foreignKey: "organisation_id" });
Employee.belongsTo(Organisation, { foreignKey: "organisation_id" });
Team.belongsTo(Organisation, { foreignKey: "organisation_id" });
Approval.belongsTo(Organisation, { foreignKey: "organisation_id" });

// User ↔ Employee (optional 1:1)
User.hasOne(Employee, { foreignKey: "user_id" });
Employee.belongsTo(User, { foreignKey: "user_id" });

// Employee ↔ Team (many-to-many)
Employee.belongsToMany(Team, {
  through: EmployeeTeam,
  foreignKey: "employee_id",
  otherKey: "team_id",
});
Team.belongsToMany(Employee, {
  through: EmployeeTeam,
  foreignKey: "team_id",
  otherKey: "employee_id",
});

// Approval relations
Approval.belongsTo(User, { foreignKey: "user_id" });

module.exports = {};

