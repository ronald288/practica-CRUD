const express = require("express");
const router = express.Router();

const { getUsers } = require("../controllers/usersController");
const { createUserController } = require("../controllers/usersController");
const { getUserByIdController } = require("../controllers/usersController");

router.get("/users", getUsers);
router.get("/users/:id", getUserByIdController);
router.post("/users", createUserController);

module.exports = router;
