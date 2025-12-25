const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Organisation = require("./organisation");

// Represents teams inside an organisation (multi-tenant structure)
const Team = sequelize.define(
  "Team",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    organisation_id: { type: DataTypes.INTEGER, allowNull: false }, // Ensures team belongs to a tenant
    name: { type: DataTypes.STRING(255), allowNull: false }, // Team visible name
    description: { type: DataTypes.TEXT }, // Flexible details (role, purpose, etc.)
  },
  {
    tableName: "teams",
    timestamps: true, // Useful for HR auditing
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// M:1 Team → Organisation
Team.belongsTo(Organisation, { foreignKey: "organisation_id" });

module.exports = Team;
