const bcrypt = require("bcrypt");
const { getAllUsers } = require("../models/userModel");
const { createUser } = require("../models/userModel");
const { getUserById } = require("../models/userModel");

// ***** OBTENER LISTA DE USUARIO*****
//getUser es una funcion creada que se ejecuta cuando alguien haga el get/users
//req-res es por que en users se necesitan estos parametros
const getUsers = (req, res) => {
  //respuesta del callback hecho en el modelo
  getAllUsers((err, results) => {
    if (err) {
      console.error("Error en la consulta:", err);
      // res es el objeto que usas para responder al cliente
      return res.status(500).json({ error: "Error en el servidor" });
    }
    const users = results.map((user) => {
      const { password, ...rest } = user;
      return rest;
    });
    res.json(users);
  });
};

// ***** OBTENER USUARIO POR ID*****
const getUserByIdController = (req, res) => {
  const { id } = req.params;

  getUserById(id, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Error en el servidor" });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(results[0]);
  });
};

// ****CREAR USUARIO****
const createUserController = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Datos incompletos" });
  }
  try {
    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    createUser(name, email, hashedPassword, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "error en el servidor" });
      }
      res.status(201).json({
        message: "usuario creado",
        id: result.insertId,
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Error al encriptar contraseña" });
  }
};

module.exports = { getUsers, createUserController, getUserByIdController };
