const { sendOnboardingEmail } = require("./emailService");

/**
 * OnboardingService
 *
 * Handles industry-standard onboarding communications and
 * lifecycle events for new employees.
 */
async function sendAccessNotification({ email, fullName, setupToken }) {
    await sendOnboardingEmail({ email, fullName, setupToken });
}

module.exports = { sendAccessNotification };
