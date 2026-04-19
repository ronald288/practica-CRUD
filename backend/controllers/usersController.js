const bcrypt = require("bcrypt");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
} = require("../models/userModel");

// ***** OBTENER LISTA DE USUARIO*****
//req-res es por que en users se necesitan estos parametros
const getUsers = async (req, res) => {
  try {
    const results = await getAllUsers();
    //...rest Extrae la propiedad password y guarda todas las otras propiedades en un nuevo objeto rest
    const users = results.map(({ password, ...rest }) => rest);
    // res es el objeto que usas para responder al cliente
    res.json(users);
  } catch (err) {
    console.error("Error en la consulta:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// ***** OBTENER USUARIO POR ID*****
const getUserByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const results = await getUserById(id);
    if (results.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// ****CREAR USUARIO****
const createUserController = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !name.trim() || !email || !email.trim() || !password) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email inválido" });
  }
  try {
    // validar si ya existe
    const existingUser = await getUserByEmail(email);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    // encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // crear usuario
    const result = await createUser(name, email, hashedPassword);

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// ***** ACTUALIZAR USUARIO *****
const updateUserController = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  if (!name || !name.trim() || !email || !email.trim()) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email inválido" });
  }

  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser.length > 0 && existingUser[0].id != id) {
      return res.status(400).json({ error: "El email ya está registrado" });
    }

    let hashedPassword;
    if (password && password.trim() !== "") {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const result = await updateUser(id, name, email, hashedPassword);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario actualizado" });
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// ****ELIMINAR USUARIO*****
const deleteUserController = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await deleteUser(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports = {
  getUsers,
  createUserController,
  getUserByIdController,
  updateUserController,
  deleteUserController,
};
