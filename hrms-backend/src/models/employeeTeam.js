const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Employee = require("./employee");
const Team = require("./team");

// Join table mapping Employees ↔ Teams (many-to-many relationship)
const EmployeeTeam = sequelize.define(
  "EmployeeTeam",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    employee_id: { type: DataTypes.INTEGER, allowNull: false },
    team_id: { type: DataTypes.INTEGER, allowNull: false },
    role: {
      type: DataTypes.ENUM("MEMBER", "MANAGER"),
      defaultValue: "MEMBER",
    },
    assigned_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "employee_teams",
    timestamps: false,
  }
);




module.exports = EmployeeTeam;
