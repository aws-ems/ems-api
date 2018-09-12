const express = require("express");

const UserController = require("../controllers/user");
const checkAuth = require("../middleware/check-auth");
const checkAuthAdmin = require("../middleware/check-auth-admin");

const router = express.Router();

router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

router.get("/", checkAuth, UserController.getUsers);

router.get("/:id", checkAuth, UserController.getUser);

router.delete("/:id", checkAuth, UserController.deleteUser);

router.put("/role-update", checkAuth, checkAuthAdmin, UserController.roleChange);

module.exports = router;
