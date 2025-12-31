const User = require("../models/user");
const Employee = require("../models/employee");
const Team = require("../models/team");

async function getMyProfile(userId) {
  const user = await User.findByPk(userId, {
    attributes: ["id", "name", "email", "role", "organisation_id"],
    include: [
      {
        model: Employee,
        attributes: ["id", "first_name", "last_name", "phone", "is_active", "created_at"],
        include: [
          {
            model: Team,
            attributes: ["id", "name", "description"],
            through: { attributes: [] },
          },
        ],
      },
    ],
  });

  if (!user) return null;

  const employee = user.Employee || null;
  const fullName = employee
    ? [employee.first_name, employee.last_name].filter(Boolean).join(" ")
    : user.name;

  const teams = employee?.Teams || [];

  const capabilities = {
    viewEmployees: ["ADMIN", "HR", "MANAGER"].includes(user.role),
    manageEmployees: ["HR", "MANAGER"].includes(user.role),
    manageTeams: ["HR"].includes(user.role),
    approveEmployees: user.role === "MANAGER",
    approveLogin: user.role === "ADMIN",
    viewLogs: user.role === "ADMIN",
  };

  return {
    id: user.id,
    name: fullName,
    email: user.email,
    role: user.role,
    organisation_id: user.organisation_id,
    employee: employee
      ? {
          id: employee.id,
          phone: employee.phone,
          is_active: employee.is_active,
          joinedAt: employee.created_at,
        }
      : null,
    teams: teams.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
    })),
    capabilities,
  };
}

module.exports = { getMyProfile };
