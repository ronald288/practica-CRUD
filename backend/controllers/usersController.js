const { getAllUsers } = require("../models/userModel");

// Obtener todos los usuarios
const getUsers = (req, res) => {
  getAllUsers((err, results) => {
    if (err) {
      console.error("Error en la consulta:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(results);
  });
};

module.exports = { getUsers };
