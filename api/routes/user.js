const express = require("express");

const UserController = require("../controllers/user");
const checkAuth = require("../middleware/check-auth");
const checkAuthAdmin = require("../middleware/check-auth-admin");

const router = express.Router();

router.get("/role-view", checkAuth, checkAuthAdmin, UserController.roleView);

router.get("/:id", checkAuth, UserController.getUser);

router.get("/", checkAuth, UserController.getUsers);

router.post("/signup", UserController.createUser);

router.post("/login", UserController.userLogin);

router.put("/role-update", checkAuth, checkAuthAdmin, UserController.roleChange);

router.delete("/:id", checkAuth, UserController.deleteUser);

module.exports = router;
