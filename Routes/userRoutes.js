const express = require("express");

const auth = require('../Middleware/authentication');
const { createUser, login, getUser, updateUser, deleteUser, changePassword } = require('../Controller');

const router = express.Router();

router.route("/createuser").post(createUser)

router.route("/login").post(login)

router.route("/user")
    .get(auth, getUser)
    .put(auth, updateUser)
    .delete(deleteUser)

router.route("/change-password").put(auth, changePassword)

module.exports = router