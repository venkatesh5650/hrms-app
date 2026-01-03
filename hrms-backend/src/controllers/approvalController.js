const approvalService = require("../services/approvalService");

async function createApproval(req, res,next) {
  try {
    const approval = await approvalService.createApproval(req.body, req.user);
    res.status(201).json({ approval });
  } catch (err) {
    next(err);
  }
}

async function listPending(req, res,next) {
  try {
    const approvals = await approvalService.listPending(
      req.user.orgId,
      req.user.role
    );
    res.json({ approvals });
  } catch (err) {
    next(err);
  }
}

async function approveCreate(req, res,next) {
  try {
    const success = await approvalService.approveApproval(
      req.params.id,
      req.user
    );
    if (!success)
      return res
        .status(404)
        .json({ message: "Approval not found or already processed" });

    res.json({ message: "Employee created and login approval sent to Admin" });
  } catch (err) {
    next(err);
  }
}

async function approveLogin(req, res,next) {
  try {
    const result = await approvalService.approveApproval(
      req.params.id,
      req.user
    );

    if (!result) return res.status(404).json({ message: "Approval not found" });

    res.json({
      message: "Login created",
      email: result.email,
      tempPassword: result.tempPassword,
    });
  } catch (err) {
    next(err);
  }
}

async function rejectCreate(req, res,next) {
  try {
    if (!req.body.reason)
      return res.status(400).json({ message: "Rejection reason required" });

    const success = await approvalService.rejectApproval(
      req.params.id,
      req.body.reason,
      req.user
    );
    if (!success)
      return res
        .status(404)
        .json({ message: "Approval not found or already processed" });

    res.json({ message: "Employee creation rejected" });
  } catch (err) {
    next(err);
  }
}

async function rejectLogin(req, res,next) {
  try {
    if (!req.body.reason)
      return res.status(400).json({ message: "Rejection reason required" });

    const success = await approvalService.rejectApproval(
      req.params.id,
      req.body.reason,
      req.user
    );
    if (!success)
      return res
        .status(404)
        .json({ message: "Approval not found or already processed" });

    res.json({ message: "Login access rejected" });
  } catch (err) {
    next(err);
  }
}

async function listHistory(req, res,next) {
  try {
    const approvals = await approvalService.listHistory(req.user.orgId);
    res.json({ approvals });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createApproval,
  listPending,
  approveCreate,
  approveLogin,
  rejectCreate,
  rejectLogin,
  listHistory,
};
