const { Parser } = require("json2csv");
const Approval = require("../models/approval");
const Employee = require("../models/employee");
const Team = require("../models/team");
const Log = require("../models/log");

exports.exportCompanyAnalytics = async (req, res) => {
    try {
        const orgId = req.user.orgId;

        const [employees, teams, approvals, logs] = await Promise.all([
            Employee.findAll({ where: { organisation_id: orgId } }),
            Team.findAll({ where: { organisation_id: orgId } }),
            Approval.findAll({ where: { organisation_id: orgId } }),
            Log.findAll({ where: { organisation_id: orgId } }),
        ]);

        const approved = approvals.filter(a => a.status === "APPROVED").length;
        const rejected = approvals.filter(a => a.status === "REJECTED").length;
        const pending = approvals.filter(a => a.status === "PENDING").length;

        const data = [{
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

        const parser = new Parser();
        const csvData = parser.parse(data);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="analytics_summary.csv"`);
        return res.status(200).send(csvData);

    } catch (error) {
        console.error("CSV Export Error:", error);
        return res.status(500).json({ message: "Internal server error during export." });
    }
};

const User = require("../models/user");

exports.exportApprovals = async (req, res) => {
    try {
        const orgId = req.user.orgId;
        const approvals = await Approval.findAll({
            where: { organisation_id: orgId },
            include: [
                { model: User, attributes: ['id', 'name', 'email'] }
            ]
        });

        const data = approvals.map(a => {
            let metadata = "";
            try {
                metadata = typeof a.payload === 'string' ? a.payload : JSON.stringify(a.payload);
            } catch (e) { }

            return {
                id: a.id,
                type: a.type,
                status: a.status,
                requester: a.User ? (a.User.name || a.User.email) : `User ID: ${a.user_id}`,
                rejection_reason: a.rejection_reason || "N/A",
                metadata: metadata,
                created_at: a.createdAt,
            };
        });

        if (!data.length) {
            data.push({ message: "No records found" });
        }

        const parser = new Parser();
        const csvData = parser.parse(data);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="approvals_breakdown.csv"`);
        return res.status(200).send(csvData);

    } catch (error) {
        console.error("CSV Export Error:", error);
        return res.status(500).json({ message: "Internal server error during export." });
    }
};

exports.exportTeamDistribution = async (req, res) => {
    try {
        const orgId = req.user.orgId;

        // Fetch employees with their associated User and Teams
        // Assuming Employee has a many-to-many or one-to-many relationship with Team
        const employees = await Employee.findAll({
            where: { organisation_id: orgId },
            include: [
                { model: Team },
                { model: User, attributes: ['email', 'role', 'is_demo'] }
            ]
        });

        // Map to industry-standard detailed export
        const data = employees.map(e => {
            // Determine team name (handling many-to-many or single association based on current schema)
            let teamName = "Unassigned";
            let teamRole = "Member";

            // Check if it's an array (belongsToMany) or a single object (belongsTo)
            if (Array.isArray(e.Teams) && e.Teams.length > 0) {
                teamName = e.Teams.map(t => t.name).join("; ");
                // Pick the first one's role if available from through table
                teamRole = e.Teams[0].EmployeeTeam?.role || "Member";
            } else if (e.Team) {
                teamName = e.Team.name;
                teamRole = e.EmployeeTeam?.role || "Member";
            }

            return {
                employee_id: e.id,
                first_name: e.first_name || "",
                last_name: e.last_name || "",
                email: e.email || (e.User ? e.User.email : "N/A"),
                department: e.department || "N/A",
                designation: e.designation || "N/A",
                status: e.is_active ? "Active" : "Inactive",
                team_name: teamName,
                team_role: teamRole,
                system_role: e.User ? e.User.role : "EMPLOYEE",
                joined_date: e.joining_date ? e.joining_date : e.createdAt
            };
        });

        if (!data.length) {
            data.push({ message: "No records found" });
        }

        const parser = new Parser();
        const csvData = parser.parse(data);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="team_distribution.csv"`);
        return res.status(200).send(csvData);

    } catch (error) {
        console.error("CSV Export Error:", error);
        return res.status(500).json({ message: "Internal server error during export." });
    }
};

exports.exportUserActivity = async (req, res) => {
    try {
        const orgId = req.user.orgId;
        const logs = await Log.findAll({
            where: { organisation_id: orgId },
            order: [['timestamp', 'DESC']]
        });

        const data = logs.map(l => ({
            id: l.id,
            user_id: l.user_id,
            action: l.action,
            entity_type: l.entity_type,
            timestamp: l.timestamp
        }));

        if (!data.length) {
            data.push({ message: "No records found" });
        }

        const parser = new Parser();
        const csvData = parser.parse(data);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="user_activity.csv"`);
        return res.status(200).send(csvData);

    } catch (error) {
        console.error("CSV Export Error:", error);
        return res.status(500).json({ message: "Internal server error during export." });
    }
};
