const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUserByIdController,
  createUserController,
  updateUserController,
  deleteUserController,
} = require("../controllers/usersController");

router.get("/users", getUsers);
router.get("/users/:id", getUserByIdController);
router.post("/users", createUserController);
router.put("/users/:id", updateUserController);
router.delete("/users/:id", deleteUserController);

module.exports = router;
