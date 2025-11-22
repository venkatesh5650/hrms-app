const { DataTypes } = require("sequelize");
const sequelize = require("../db");

// Audit log table for accountability & compliance tracking
const Log = sequelize.define(
  "Log",
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    organisation_id: { type: DataTypes.INTEGER }, // Multi-tenant visibility
    user_id: { type: DataTypes.INTEGER }, // Who performed the action
    action: { type: DataTypes.STRING(255) }, // Event type (login, update, delete)
    meta: { type: DataTypes.JSON }, // Flexible details per event
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }, // When event happened
  },
  {
    tableName: "logs",
    timestamps: false, // Custom timestamp property in use
  }
);

module.exports = Log;
