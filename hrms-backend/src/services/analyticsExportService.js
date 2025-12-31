const { Parser } = require("json2csv");
const Approval = require("../models/approval");
const Employee = require("../models/employee");
const Team = require("../models/team");
const Log = require("../models/log");

async function generateAnalyticsCSV(orgId) {
  const [employees, teams, approvals, logs] = await Promise.all([
    Employee.count({ where: { organisation_id: orgId } }),
    Team.count({ where: { organisation_id: orgId } }),
    Approval.findAll({ where: { organisation_id: orgId } }),
    Log.findAll({ where: { organisation_id: orgId } }),
  ]);

  const approved = approvals.filter(a => a.status === "APPROVED").length;
  const rejected = approvals.filter(a => a.status === "REJECTED").length;

  const data = [{
    organisation_id: orgId,
    total_employees: employees,
    total_teams: teams,
    approvals_total: approvals.length,
    approvals_approved: approved,
    approvals_rejected: rejected,
    logs_total: logs.length,
    generated_at: new Date().toISOString()
  }];

  const parser = new Parser();
  return parser.parse(data);
}

module.exports = { generateAnalyticsCSV };
