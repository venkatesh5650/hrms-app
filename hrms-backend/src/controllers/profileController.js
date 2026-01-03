const profileService = require("../services/profileService");

async function getMyProfile(req, res,next) {
  try {
    const profile = await profileService.getMyProfile(req.user.id);

    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ profile });
  } catch (err) {
    next(err);
  }
}

module.exports = { getMyProfile };
