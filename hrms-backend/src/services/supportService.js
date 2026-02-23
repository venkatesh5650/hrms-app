const SupportRequest = require("../models/support_request");
const Employee = require("../models/employee");
const EmployeeTeam = require("../models/employeeTeam");
const Team = require("../models/team");
const { Op } = require("sequelize");

/**
 * Maps a support request category to the role that should handle it.
 */
function resolveAssignedRole(category) {
    switch (category) {
        case "Access Issue":
            return "ADMIN";
        case "Team Change":
        case "Profile Update":
            return "HR";
        case "Team Collaboration":
            return "MANAGER";
        default:
            return "HR";
    }
}

/**
 * Employee creates a support request.
 * Routing is decided automatically based on category.
 */
async function createSupportRequest(data, user) {
    const { category, message } = data;

    if (!category || !message) {
        throw new Error("category and message are required");
    }

    // Fetch the employee record linked to this user account
    const employee = await Employee.findOne({
        where: { user_id: user.id, organisation_id: user.orgId },
    });

    if (!employee) {
        throw new Error("Employee record not found for this user");
    }

    const assigned_to_role = resolveAssignedRole(category);

    const request = await SupportRequest.create({
        organisation_id: user.orgId,
        employee_id: employee.id,
        category,
        message,
        assigned_to_role,
        status: "PENDING",
    });

    return request;
}

/**
 * Fetch support requests visible to the requesting user based on their role.
 *
 * - ADMIN   → requests assigned to ADMIN
 * - HR      → requests assigned to HR
 * - MANAGER → requests assigned to MANAGER AND submitted by employees in the manager's teams
 */
async function getSupportRequestsByRole(role, userId, orgId) {
    const where = {
        organisation_id: orgId,
        assigned_to_role: role,
    };

    // For managers, further scope to employees in their managed teams
    if (role === "MANAGER") {
        // Find the manager's own employee record
        const managerEmployee = await Employee.findOne({
            where: { user_id: userId, organisation_id: orgId },
        });

        if (managerEmployee) {
            // Find all teams the manager belongs to
            const managerTeamLinks = await EmployeeTeam.findAll({
                where: { employee_id: managerEmployee.id },
                attributes: ["team_id"],
            });

            const teamIds = managerTeamLinks.map((t) => t.team_id);

            if (teamIds.length > 0) {
                // Find all employees in those teams
                const teamMembers = await EmployeeTeam.findAll({
                    where: { team_id: { [Op.in]: teamIds } },
                    attributes: ["employee_id"],
                });
                const employeeIds = [
                    ...new Set(teamMembers.map((m) => m.employee_id)),
                ];
                where.employee_id = { [Op.in]: employeeIds };
            } else {
                // Manager has no teams — return empty
                return [];
            }
        }
    }

    const requests = await SupportRequest.findAll({
        where,
        include: [
            {
                model: Employee,
                as: "employee",
                attributes: ["id", "first_name", "last_name", "email"],
            },
        ],
        order: [["created_at", "DESC"]],
    });

    return requests.map((r) => r.get({ plain: true }));
}

/**
 * Resolve (close) a support request by ID.
 * Scoped to the organisation for safety.
 */
async function resolveSupportRequest(id, orgId) {
    const request = await SupportRequest.findOne({
        where: { id, organisation_id: orgId },
    });

    if (!request) return null;

    request.status = "RESOLVED";
    await request.save();

    return request.get({ plain: true });
}

module.exports = {
    createSupportRequest,
    getSupportRequestsByRole,
    resolveSupportRequest,
};
