const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Auth user for an organisation (tenant-scoped access control)
const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    organisation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }, // Tenant isolation

    name: {
      type: DataTypes.STRING(255),
    },

    // Role-based access control
    role: {
      type: DataTypes.ENUM("ADMIN", "HR", "MANAGER", "EMPLOYEE"),
      allowNull: false,
      defaultValue: "EMPLOYEE",
    },

    // Login credential fields
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },

    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    }, // Stored as bcrypt hash
    is_demo: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);

module.exports = User;
