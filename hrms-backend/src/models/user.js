const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Organisation = require("./organisation");

// Auth user for an organisation (tenant-scoped access control)
const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    organisation_id: { type: DataTypes.INTEGER, allowNull: false }, // Tenant isolation
    name: { type: DataTypes.STRING(255) },

    // Login credential fields
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true, // Prevent duplicate login accounts
      validate: { isEmail: true },
    },
    password_hash: { type: DataTypes.STRING(255), allowNull: false }, // Stored as bcrypt hash
  },
  {
    tableName: "users",
    timestamps: true, // Track onboarding time
    createdAt: "created_at",
    updatedAt: false, // Password changes handled explicitly, not auto-updated
  }
);

// M:1 — Users belong to one organisation
User.belongsTo(Organisation, { foreignKey: "organisation_id" });

module.exports = User;
