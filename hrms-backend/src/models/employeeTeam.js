const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
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



module.exports = EmployeeTeam;
