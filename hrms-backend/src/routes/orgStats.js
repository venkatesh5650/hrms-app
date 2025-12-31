const router = require("express").Router();
const ctrl = require("../controllers/orgStatsController");
const auth = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/requireRole");

router.get("/roles", auth, requireRole("ADMIN", "HR"), ctrl.getRoleStats);
router.get("/managers", auth, requireRole("ADMIN"), ctrl.listManagers);
router.get("/hrs", auth, requireRole("ADMIN"), ctrl.listHRs);

module.exports = router;
