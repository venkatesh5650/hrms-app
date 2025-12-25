const { DataTypes } = require("sequelize");
const sequelize = require("../db");

// Represents a tenant/company in the HRMS platform
const Organisation = sequelize.define(
  "Organisation",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(255), allowNull: false }, // Unique tenant identifier (company name)
  },
  {
    tableName: "organisations",
    timestamps: true, // Track onboarding time of organisation
    createdAt: "created_at",
    updatedAt: false, // Organisation name rarely changes → no update tracking needed
  }
);

module.exports = Organisation;
