// connection es el puente entre la conexion y la base de datos
const { connection } = require("../db");

// callback es necesario para recibir la respuesta
const getAllUsers = (callback) => {
  //por medio de connection.query hacemos las consultas
  connection.query("SELECT * FROM users", callback);
};

const createUser = (name, email, password, callback) => {
  const sql = "INSERT INTO users (name,email,password) VALUES(?, ?, ?)";
  connection.query(sql, [name, email, password], callback);
};

const getUserById = (id, callback) => {
  const sql = "SELECT id, name, email FROM users WHERE id = ?";
  connection.query(sql, [id], callback);
};

module.exports = { getAllUsers, createUser, getUserById };
