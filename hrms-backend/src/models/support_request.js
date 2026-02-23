const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// SupportRequest — employees submit help requests routed to HR, Manager, or Admin
const SupportRequest = sequelize.define(
    "SupportRequest",
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

        // Multi-tenant isolation
        organisation_id: { type: DataTypes.INTEGER, allowNull: false },

        // The employee who raised the request (FK to employees.id)
        employee_id: { type: DataTypes.INTEGER, allowNull: false },

        // Category determines routing
        category: {
            type: DataTypes.ENUM(
                "Access Issue",
                "Team Change",
                "Profile Update",
                "Team Collaboration",
                "Other"
            ),
            allowNull: false,
        },

        // Freetext description from the employee
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },

        // Routing decision — set by service layer based on category
        assigned_to_role: {
            type: DataTypes.ENUM("HR", "MANAGER", "ADMIN"),
            allowNull: false,
        },

        // Lifecycle state
        status: {
            type: DataTypes.ENUM("PENDING", "RESOLVED"),
            defaultValue: "PENDING",
        },
    },
    {
        tableName: "support_requests",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

module.exports = SupportRequest;
