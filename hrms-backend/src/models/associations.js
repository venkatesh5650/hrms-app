const User = require("./user");
const Employee = require("./employee");
const Organisation = require("./organisation");
const Team = require("./team");
const EmployeeTeam = require("./employeeTeam");
const Approval = require("./approval");
const SupportRequest = require("./support_request");

// Organisation relations
User.belongsTo(Organisation, { foreignKey: "organisation_id" });
Employee.belongsTo(Organisation, { foreignKey: "organisation_id" });
Team.belongsTo(Organisation, { foreignKey: "organisation_id" });
Approval.belongsTo(Organisation, { foreignKey: "organisation_id" });
SupportRequest.belongsTo(Organisation, { foreignKey: "organisation_id" });
SupportRequest.belongsTo(Employee, { foreignKey: "employee_id", as: "employee" });
Employee.hasMany(SupportRequest, { foreignKey: "employee_id" });

// User ↔ Employee (optional 1:1)
User.hasOne(Employee, { foreignKey: "user_id", as: "employee" });
Employee.belongsTo(User, { foreignKey: "user_id", as: "user" });

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

// Audit Logs relations
const Log = require("./log");
Log.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Log, { foreignKey: "user_id" });

module.exports = {};

