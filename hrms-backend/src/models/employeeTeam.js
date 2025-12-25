const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Employee = require("./employee");
const Team = require("./team");

// Join table mapping Employees ↔ Teams (many-to-many relationship)
const EmployeeTeam = sequelize.define(
  "EmployeeTeam",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    employee_id: { type: DataTypes.INTEGER, allowNull: false }, // FK: Employee
    team_id: { type: DataTypes.INTEGER, allowNull: false }, // FK: Team
    assigned_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }, // Track assignment history
  },
  {
    tableName: "employee_teams",
    timestamps: false, // No update history required for mapping table
  }
);

// M:N Association Configuration
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

module.exports = EmployeeTeam;
