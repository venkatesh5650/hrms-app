const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Approval entity — implements auditable, multi-tenant approval workflows
const Approval = sequelize.define(
  "Approval",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    // Multi-tenant isolation: approvals are always scoped to an organisation
    organisation_id: { type: DataTypes.INTEGER, allowNull: false },

    user_id: { type: DataTypes.INTEGER, allowNull: false }, // requester

    type: {
      type: DataTypes.ENUM("CREATE", "UPDATE", "DELETE","LOGIN_ACCESS"),
      allowNull: false,
    },

    payload: {
      type: DataTypes.JSON,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
      defaultValue: "PENDING",
    },

    rejection_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "approvals",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Approval;
























