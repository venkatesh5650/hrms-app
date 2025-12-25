const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Organisation = require("./organisation");

// Employee entity belongs to an organisation (multi-tenant design)
const Employee = sequelize.define(
  "Employee",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    organisation_id: { type: DataTypes.INTEGER, allowNull: false }, // Tenant isolation key
    first_name: { type: DataTypes.STRING(100) },
    last_name: { type: DataTypes.STRING(100) },
    email: { type: DataTypes.STRING(255) }, // Can enforce unique if needed
    phone: { type: DataTypes.STRING(50) },
  },
  {
    tableName: "employees",
    timestamps: true, // Track HR creation/update history
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

// Association: Employee → Organisation (Many-to-One)
Employee.belongsTo(Organisation, { foreignKey: "organisation_id" });

module.exports = Employee;
