const { connection } = require("../db");

// Obtener usuarios
const getAllUsers = (callback) => {
  connection.query("SELECT * FROM users", callback);
};

module.exports = { getAllUsers };
