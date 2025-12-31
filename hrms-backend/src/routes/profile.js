const express = require("express");
const router = express.Router();
const { getMyProfile } = require("../controllers/profileController");
const auth = require("../middlewares/authMiddleware");

router.get("/me", auth, getMyProfile);

module.exports = router;
