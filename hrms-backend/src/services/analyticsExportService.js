const { Parser } = require("json2csv");
const Approval = require("../models/approval");
const Employee = require("../models/employee");
const Team = require("../models/team");
const Log = require("../models/log");

async function generateAnalyticsCSVs(orgId) {
  const [employees, teams, approvals, logs] = await Promise.all([
    Employee.findAll({ where: { organisation_id: orgId }, include: [Team] }),
    Team.findAll({ where: { organisation_id: orgId } }),
    Approval.findAll({ where: { organisation_id: orgId } }),
    Log.findAll({ where: { organisation_id: orgId } }),
  ]);

  // ---- Summary
  const approved = approvals.filter(a => a.status === "APPROVED").length;
  const rejected = approvals.filter(a => a.status === "REJECTED").length;
  const pending = approvals.filter(a => a.status === "PENDING").length;

  const summary = [{
    organisation_id: orgId,
    total_employees: employees.length,
    total_teams: teams.length,
    approvals_total: approvals.length,
    approvals_approved: approved,
    approvals_rejected: rejected,
    approvals_pending: pending,
    logs_total: logs.length,
    generated_at: new Date().toISOString(),
  }];

  // ---- Approvals breakdown
  const approvalsBreakdown = [
    { status: "APPROVED", count: approved },
    { status: "REJECTED", count: rejected },
    { status: "PENDING", count: pending },
  ];

  // ---- Team distribution
  const teamMap = {};
  employees.forEach(e => {
    const teamName = e.Team?.name || "Unassigned";
    teamMap[teamName] = (teamMap[teamName] || 0) + 1;
  });

  const teamDistribution = Object.entries(teamMap).map(([team, count]) => ({
    team_name: team,
    employee_count: count,
  }));

  // ---- User activity
  const activityMap = {};
  logs.forEach(l => {
    activityMap[l.user_id] = (activityMap[l.user_id] || 0) + 1;
  });

  const userActivity = Object.entries(activityMap).map(([user_id, actions]) => ({
    user_id,
    actions,
  }));

  const parser = new Parser();

  return {
    "analytics_summary.csv": parser.parse(summary),
    "approvals_breakdown.csv": parser.parse(approvalsBreakdown),
    "team_distribution.csv": parser.parse(teamDistribution),
    "user_activity.csv": parser.parse(userActivity),
  };
}
module.exports = {
  generateAnalyticsCSVs
};

