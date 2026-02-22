const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Audit log table for accountability & compliance tracking
const Log = sequelize.define(
  "Log",
  {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    organisation_id: { type: DataTypes.INTEGER }, // Multi-tenant visibility
    user_id: { type: DataTypes.INTEGER }, // Who performed the action
    user_role: { type: DataTypes.STRING(50) }, // Historical role snapshot
    action: { type: DataTypes.STRING(255) }, // Event type (login, update, delete)
    meta: { type: DataTypes.JSON }, // Flexible details per event
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: () => new Date(), // 👈 Local server time
    },
  },
  {
    tableName: "logs",
    timestamps: false, // Custom timestamp property in use
  }
);

module.exports = Log;



