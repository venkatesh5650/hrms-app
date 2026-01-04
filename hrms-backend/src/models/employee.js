const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// Employee entity — supports multi-tenancy and optional 1:1 User mapping
const Employee = sequelize.define(
  "Employee",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    // Multi-tenant isolation: every employee belongs to exactly one organisation
    organisation_id: { type: DataTypes.INTEGER, allowNull: false },

    // 1:1 link to a User account (not every employee must have login access)
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },

    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,

    // Soft state & deletion instead of hard delete (audit & data safety)
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    is_demo: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "employees",

    // Custom timestamp mapping for DB standardization
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Employee;
