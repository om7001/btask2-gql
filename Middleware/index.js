const { isAuthenticated, isAuthenticatedAdmin } = require("./authentication")
const { sendWelcomeEmail } = require("./sendMail")

module.exports = { isAuthenticated, isAuthenticatedAdmin, sendWelcomeEmail }