const supportService = require("../services/supportService");

async function createRequest(req, res, next) {
    try {
        const request = await supportService.createSupportRequest(
            req.body,
            req.user
        );
        res.status(201).json({ request });
    } catch (err) {
        next(err);
    }
}

async function getRoleRequests(req, res, next) {
    try {
        const requests = await supportService.getSupportRequestsByRole(
            req.user.role,
            req.user.id,
            req.user.orgId
        );
        res.json({ requests });
    } catch (err) {
        next(err);
    }
}

async function resolve(req, res, next) {
    try {
        const request = await supportService.resolveSupportRequest(
            req.params.id,
            req.user.orgId
        );

        if (!request) {
            return res
                .status(404)
                .json({ message: "Support request not found" });
        }

        res.json({ message: "Request resolved", request });
    } catch (err) {
        next(err);
    }
}

module.exports = { createRequest, getRoleRequests, resolve };
